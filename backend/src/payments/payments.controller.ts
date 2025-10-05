import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { PaymentStatus } from './entities/payment-request.entity';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear solicitud de pago' })
  @ApiResponse({ status: 201, description: 'Solicitud de pago creada exitosamente' })
  async create(@Body() createPaymentDto: CreatePaymentRequestDto, @Request() req) {
    return this.paymentsService.createPaymentRequest(createPaymentDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar solicitudes de pago' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes de pago obtenida exitosamente' })
  async findAll(@Query('status') status?: PaymentStatus) {
    return this.paymentsService.findAll(status);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener pagos pendientes' })
  @ApiResponse({ status: 200, description: 'Pagos pendientes obtenidos exitosamente' })
  async getPendingPayments() {
    return this.paymentsService.getPendingPayments();
  }

  @Get('generated')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener pagos con link generado' })
  @ApiResponse({ status: 200, description: 'Pagos con link generado obtenidos exitosamente' })
  async getGeneratedPayments() {
    return this.paymentsService.getGeneratedPayments();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener solicitud de pago por ID' })
  @ApiResponse({ status: 200, description: 'Solicitud de pago obtenida exitosamente' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Post(':id/generate-link')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Generar link de pago con Plux' })
  @ApiResponse({ status: 200, description: 'Link de pago generado exitosamente' })
  async generatePaymentLink(@Param('id') id: string) {
    return this.paymentsService.generatePluxPaymentLink(+id);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Webhook callback de Plux' })
  @ApiResponse({ status: 200, description: 'Callback procesado exitosamente' })
  async handleCallback(@Body() callbackData: any) {
    await this.paymentsService.handlePluxCallback(callbackData);
    return { status: 'ok' };
  }
}