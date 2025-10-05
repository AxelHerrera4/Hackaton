import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FoundationsService } from './foundations.service';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('foundations')
@Controller('foundations')
export class FoundationsController {
  constructor(private readonly foundationsService: FoundationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva fundación (solo admin)' })
  @ApiResponse({ status: 201, description: 'Fundación creada exitosamente' })
  async create(@Body() createFoundationDto: CreateFoundationDto) {
    return this.foundationsService.create(createFoundationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las fundaciones' })
  @ApiResponse({ status: 200, description: 'Lista de fundaciones obtenida exitosamente' })
  async findAll() {
    return this.foundationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener fundación por ID' })
  @ApiResponse({ status: 200, description: 'Fundación obtenida exitosamente' })
  async findOne(@Param('id') id: string) {
    return this.foundationsService.findOne(+id);
  }
}