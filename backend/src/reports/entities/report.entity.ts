import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReportStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  READY_FOR_PAYMENT = 'ready_for_payment',
  PAID = 'paid',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne('Project', 'reports')
  project: any;

  @Column({ name: 'foundation_id' })
  foundationId: number;

  @ManyToOne('Foundation', 'reports')
  foundation: any;

  @Column({ name: 'period_year' })
  periodYear: number;

  @Column({ name: 'period_month' })
  periodMonth: number;

  @Column({ type: 'jsonb' })
  data: any;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'jsonb', nullable: true })
  attachments: any;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: number;

  @ManyToOne('User', { nullable: true })
  reviewer: any;

  @Column({ name: 'reviewed_at', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación con payment requests
  paymentRequests: any[];
}