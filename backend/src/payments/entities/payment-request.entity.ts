import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  LINK_GENERATED = 'link_generated',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('payment_requests')
export class PaymentRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'report_id' })
  reportId: number;

  @ManyToOne('Report')
  @JoinColumn({ name: 'report_id' })
  report: any;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'plux_payment_link', type: 'text', nullable: true })
  pluxPaymentLink: string;

  @Column({ name: 'plux_payment_id', length: 255, nullable: true })
  pluxPaymentId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}