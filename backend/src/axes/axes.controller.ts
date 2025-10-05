import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AxesService } from './axes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('axes')
@Controller('axes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AxesController {
  constructor(private readonly axesService: AxesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los ejes temáticos' })
  @ApiResponse({ status: 200, description: 'Lista de ejes obtenida exitosamente' })
  async findAll() {
    return this.axesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener eje por ID' })
  @ApiResponse({ status: 200, description: 'Eje obtenido exitosamente' })
  async findOne(@Param('id') id: string) {
    return this.axesService.findOne(+id);
  }
}