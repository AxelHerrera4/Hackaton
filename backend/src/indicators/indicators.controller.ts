import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IndicatorsService } from './indicators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('indicators')
@Controller('indicators')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar indicadores (KPIs)' })
  @ApiResponse({ status: 200, description: 'Lista de indicadores obtenida exitosamente' })
  async findAll(@Query('axisId') axisId?: string) {
    return this.indicatorsService.findAll(axisId ? +axisId : undefined);
  }

  @Get('approved')
  @ApiOperation({ summary: 'Listar solo indicadores aprobados' })
  @ApiResponse({ status: 200, description: 'Lista de indicadores aprobados obtenida exitosamente' })
  async findApproved(@Query('axisId') axisId?: string) {
    return this.indicatorsService.findApproved(axisId ? +axisId : undefined);
  }
}