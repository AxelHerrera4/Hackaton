import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectIndicator } from './entities/project-indicator.entity';
import { Milestone } from './entities/milestone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectIndicator, Milestone])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, TypeOrmModule],
})
export class ProjectsModule {}