import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'foundation_id' })
  foundationId: number;

  @ManyToOne('Foundation', 'projects')
  foundation: any;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'report_start_date', type: 'date', nullable: true })
  reportStartDate: Date;

  @Column({ name: 'report_end_date', type: 'date', nullable: true })
  reportEndDate: Date;

  @Column({ length: 50, default: 'active' })
  status: string;

  @OneToMany('ProjectIndicator', 'project')
  projectIndicators: any[];

  @OneToMany('Milestone', 'project')
  milestones: any[];

  @OneToMany('Report', 'project')
  reports: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}