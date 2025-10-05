import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReviewReportDto } from './dto/review-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { ReportStatus } from './entities/report.entity';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.LIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo reporte mensual' })
  @ApiResponse({ status: 201, description: 'Reporte creado exitosamente' })
  async create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reportes' })
  @ApiResponse({ status: 200, description: 'Lista de reportes obtenida exitosamente' })
  async findAll(
    @Query('foundationId') foundationId?: string,
    @Query('status') status?: ReportStatus,
    @Request() req?
  ) {
    // Si es líder, solo puede ver reportes de su fundación
    const foundationFilter = req.user.role === UserRole.LIDER 
      ? req.user.foundationId 
      : foundationId ? +foundationId : undefined;

    return this.reportsService.findAll(foundationFilter, status);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.REVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener reportes pendientes de revisión' })
  @ApiResponse({ status: 200, description: 'Reportes pendientes obtenidos exitosamente' })
  async getPendingReports() {
    return this.reportsService.getPendingReports();
  }

  @Get('approved')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TESORERIA, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener reportes aprobados listos para pago' })
  @ApiResponse({ status: 200, description: 'Reportes aprobados obtenidos exitosamente' })
  async getApprovedReports() {
    return this.reportsService.getApprovedReports();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reporte por ID' })
  @ApiResponse({ status: 200, description: 'Reporte obtenido exitosamente' })
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar reporte' })
  @ApiResponse({ status: 200, description: 'Reporte actualizado exitosamente' })
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Post(':id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.REVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Revisar y aprobar/rechazar reporte' })
  @ApiResponse({ status: 200, description: 'Reporte revisado exitosamente' })
  async review(
    @Param('id') id: string, 
    @Body() reviewDto: ReviewReportDto,
    @Request() req
  ) {
    return this.reportsService.review(+id, reviewDto, req.user.id);
  }
}