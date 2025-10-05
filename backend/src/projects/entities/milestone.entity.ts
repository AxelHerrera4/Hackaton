import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, project => project.milestones)
  project: Project;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'guide_questions', type: 'jsonb', nullable: true })
  guideQuestions: any;

  @Column({ name: 'month_year', type: 'date', nullable: true })
  monthYear: Date;

  @Column({ type: 'jsonb', nullable: true })
  attachments: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}