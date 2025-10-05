import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Axis } from '../../axes/entities/axis.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('indicators')
export class Indicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'axis_id' })
  axisId: number;

  @ManyToOne(() => Axis, axis => axis.indicators)
  axis: Axis;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ type: 'text', nullable: true })
  formula: string;

  @Column({ name: 'is_custom', default: false })
  isCustom: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @Column({ default: false })
  approved: boolean;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @ManyToOne(() => User, { nullable: true })
  approver: User;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}