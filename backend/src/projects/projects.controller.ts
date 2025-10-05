import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.LIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos obtenida exitosamente' })
  async findAll(@Query('foundationId') foundationId?: string, @Request() req?) {
    // Si es líder, solo puede ver proyectos de su fundación
    const foundationFilter = req.user.role === UserRole.LIDER 
      ? req.user.foundationId 
      : foundationId ? +foundationId : undefined;

    return this.projectsService.findAll(foundationFilter);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener proyectos activos' })
  @ApiResponse({ status: 200, description: 'Proyectos activos obtenidos exitosamente' })
  async getActiveProjects() {
    return this.projectsService.getActiveProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto obtenido exitosamente' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado exitosamente' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar proyecto (solo admin)' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}