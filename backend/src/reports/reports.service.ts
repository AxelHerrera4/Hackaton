import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReviewReportDto } from './dto/review-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, userId: number): Promise<Report> {
    // Verificar que no existe reporte para el mismo proyecto y período
    const existingReport = await this.reportsRepository.findOne({
      where: {
        projectId: createReportDto.projectId,
        periodYear: createReportDto.periodYear,
        periodMonth: createReportDto.periodMonth,
      },
    });

    if (existingReport) {
      throw new BadRequestException('Ya existe un reporte para este proyecto y período');
    }

    const report = this.reportsRepository.create({
      ...createReportDto,
      status: ReportStatus.PENDING,
    });

    return this.reportsRepository.save(report);
  }

  async findAll(foundationId?: number, status?: ReportStatus): Promise<Report[]> {
    const query = this.reportsRepository.createQueryBuilder('report')
      .leftJoinAndSelect('report.project', 'project')
      .leftJoinAndSelect('report.foundation', 'foundation')
      .leftJoinAndSelect('report.reviewer', 'reviewer')
      .orderBy('report.createdAt', 'DESC');

    if (foundationId) {
      query.where('report.foundationId = :foundationId', { foundationId });
    }

    if (status) {
      query.andWhere('report.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['project', 'foundation', 'reviewer', 'paymentRequests'],
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);
    
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException('Solo se pueden editar reportes pendientes');
    }

    Object.assign(report, updateReportDto);
    return this.reportsRepository.save(report);
  }

  async review(id: number, reviewDto: ReviewReportDto, reviewerId: number): Promise<Report> {
    const report = await this.findOne(id);

    if (report.status !== ReportStatus.PENDING && report.status !== ReportStatus.IN_REVIEW) {
      throw new BadRequestException('Este reporte no puede ser revisado');
    }

    report.status = reviewDto.approved ? ReportStatus.APPROVED : ReportStatus.REJECTED;
    report.reviewedBy = reviewerId;
    report.reviewedAt = new Date();
    
    if (!reviewDto.approved && reviewDto.rejectionReason) {
      report.rejectionReason = reviewDto.rejectionReason;
    }

    // Si es aprobado, cambiar a listo para pago
    if (reviewDto.approved) {
      report.status = ReportStatus.READY_FOR_PAYMENT;
    }

    return this.reportsRepository.save(report);
  }

  async updateStatus(id: number, status: ReportStatus): Promise<Report> {
    const report = await this.findOne(id);
    report.status = status;
    return this.reportsRepository.save(report);
  }

  async getReportsByFoundation(foundationId: number): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { foundationId },
      relations: ['project', 'foundation'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingReports(): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { status: ReportStatus.PENDING },
      relations: ['project', 'foundation'],
      order: { createdAt: 'ASC' },
    });
  }

  async getApprovedReports(): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { status: ReportStatus.READY_FOR_PAYMENT },
      relations: ['project', 'foundation'],
      order: { createdAt: 'ASC' },
    });
  }
}