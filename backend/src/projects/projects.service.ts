import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    const savedProject = await this.projectsRepository.save(project);
    return savedProject;
  }

  async findAll(foundationId?: number): Promise<Project[]> {
    const query = this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.foundation', 'foundation')
      .leftJoinAndSelect('project.projectIndicators', 'projectIndicators')
      .leftJoinAndSelect('projectIndicators.indicator', 'indicator')
      .leftJoinAndSelect('indicator.axis', 'axis')
      .orderBy('project.createdAt', 'DESC');

    if (foundationId) {
      query.where('project.foundationId = :foundationId', { foundationId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: [
        'foundation',
        'projectIndicators',
        'projectIndicators.indicator',
        'projectIndicators.indicator.axis',
        'milestones',
        'reports'
      ],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }

  async findByFoundation(foundationId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { foundationId },
      relations: ['foundation', 'projectIndicators', 'projectIndicators.indicator'],
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { status: 'active' },
      relations: ['foundation'],
      order: { createdAt: 'DESC' },
    });
  }
}