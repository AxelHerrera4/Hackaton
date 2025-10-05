import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRequest, PaymentStatus } from './entities/payment-request.entity';
import { Report, ReportStatus } from '../reports/entities/report.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentRequest)
    private paymentRequestsRepository: Repository<PaymentRequest>,
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async createPaymentRequest(createPaymentDto: CreatePaymentRequestDto, userId: number): Promise<PaymentRequest> {
    // Verificar que el reporte existe y está aprobado
    const report = await this.reportsRepository.findOne({
      where: { id: createPaymentDto.reportId },
      relations: ['foundation', 'project'],
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    if (report.status !== ReportStatus.READY_FOR_PAYMENT) {
      throw new BadRequestException('El reporte debe estar aprobado para generar un pago');
    }

    // Verificar que no existe ya una solicitud de pago para este reporte
    const existingPayment = await this.paymentRequestsRepository.findOne({
      where: { reportId: createPaymentDto.reportId },
    });

    if (existingPayment) {
      throw new BadRequestException('Ya existe una solicitud de pago para este reporte');
    }

    // Crear la solicitud de pago
    const paymentRequest = this.paymentRequestsRepository.create({
      ...createPaymentDto,
      createdBy: userId,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRequestsRepository.save(paymentRequest);
    return savedPayment;
  }

  async generatePluxPaymentLink(paymentRequestId: number): Promise<PaymentRequest> {
    const paymentRequest = await this.paymentRequestsRepository.findOne({
      where: { id: paymentRequestId },
      relations: ['report', 'report.foundation', 'report.project'],
    });

    if (!paymentRequest) {
      throw new NotFoundException('Solicitud de pago no encontrada');
    }

    if (paymentRequest.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('La solicitud de pago ya ha sido procesada');
    }

    try {
      // Simular generación de link de Plux para desarrollo
      const pluxPaymentId = `PLUX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const pluxPaymentLink = `https://plux.ec/pay/${pluxPaymentId}`;

      // Actualizar la solicitud con los datos simulados de Plux
      paymentRequest.pluxPaymentLink = pluxPaymentLink;
      paymentRequest.pluxPaymentId = pluxPaymentId;
      paymentRequest.status = PaymentStatus.LINK_GENERATED;
      paymentRequest.metadata = {
        simulatedPluxResponse: {
          paymentLink: pluxPaymentLink,
          paymentId: pluxPaymentId,
          status: 'created'
        },
        generatedAt: new Date(),
      };

      return this.paymentRequestsRepository.save(paymentRequest);
    } catch (error) {
      throw new BadRequestException(`Error al generar link de pago: ${error.message}`);
    }
  }

  async findAll(status?: PaymentStatus): Promise<PaymentRequest[]> {
    const query = this.paymentRequestsRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.report', 'report')
      .leftJoinAndSelect('report.foundation', 'foundation')
      .leftJoinAndSelect('report.project', 'project')
      .leftJoinAndSelect('payment.creator', 'creator')
      .orderBy('payment.createdAt', 'DESC');

    if (status) {
      query.where('payment.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<PaymentRequest> {
    const paymentRequest = await this.paymentRequestsRepository.findOne({
      where: { id },
      relations: ['report', 'report.foundation', 'report.project', 'creator'],
    });

    if (!paymentRequest) {
      throw new NotFoundException('Solicitud de pago no encontrada');
    }

    return paymentRequest;
  }

  async handlePluxCallback(callbackData: any): Promise<void> {
    // Buscar la solicitud de pago por el ID de Plux
    const paymentRequest = await this.paymentRequestsRepository.findOne({
      where: { pluxPaymentId: callbackData.paymentId },
      relations: ['report'],
    });

    if (!paymentRequest) {
      throw new NotFoundException('Solicitud de pago no encontrada para el callback');
    }

    // Actualizar estado según respuesta de Plux
    if (callbackData.status === 'paid' || callbackData.status === 'completed') {
      paymentRequest.status = PaymentStatus.PAID;
      
      // Actualizar el reporte a pagado
      await this.reportsRepository.update(
        { id: paymentRequest.reportId },
        { status: ReportStatus.PAID }
      );
    } else if (callbackData.status === 'failed' || callbackData.status === 'rejected') {
      paymentRequest.status = PaymentStatus.FAILED;
    }

    // Guardar metadata del callback
    paymentRequest.metadata = {
      ...paymentRequest.metadata,
      callback: callbackData,
      callbackReceivedAt: new Date(),
    };

    await this.paymentRequestsRepository.save(paymentRequest);
  }

  async getPendingPayments(): Promise<PaymentRequest[]> {
    return this.findAll(PaymentStatus.PENDING);
  }

  async getGeneratedPayments(): Promise<PaymentRequest[]> {
    return this.findAll(PaymentStatus.LINK_GENERATED);
  }

  async getPaidPayments(): Promise<PaymentRequest[]> {
    return this.findAll(PaymentStatus.PAID);
  }
}