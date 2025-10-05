import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('axes')
export class Axis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany('Indicator', 'axis')
  indicators: any[];

  @OneToMany('FoundationAxis', 'axis')
  foundationAxes: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}