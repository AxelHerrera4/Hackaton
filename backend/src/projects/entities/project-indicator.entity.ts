import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Indicator } from '../../indicators/entities/indicator.entity';

@Entity('project_indicators')
export class ProjectIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, project => project.projectIndicators)
  project: Project;

  @Column({ name: 'indicator_id' })
  indicatorId: number;

  @ManyToOne(() => Indicator)
  indicator: Indicator;

  @Column({ name: 'target_value', type: 'decimal', precision: 12, scale: 2, nullable: true })
  targetValue: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}