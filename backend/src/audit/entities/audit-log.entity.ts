import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'actor_id', nullable: true })
  actorId: number;

  @ManyToOne(() => User, { nullable: true })
  actor: User;

  @Column({ length: 255 })
  action: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}