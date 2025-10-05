import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Foundation } from './foundation.entity';
import { Axis } from '../../axes/entities/axis.entity';

@Entity('foundation_axes')
export class FoundationAxis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'foundation_id' })
  foundationId: number;

  @ManyToOne(() => Foundation, foundation => foundation.foundationAxes)
  foundation: Foundation;

  @Column({ name: 'axis_id' })
  axisId: number;

  @ManyToOne(() => Axis, axis => axis.foundationAxes)
  axis: Axis;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ name: 'selected_at' })
  selectedAt: Date;
}