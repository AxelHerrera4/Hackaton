import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('foundations')
export class Foundation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @OneToMany('User', 'foundation')
  users: any[];

  @OneToMany('Project', 'foundation')
  projects: any[];

  @OneToMany('Report', 'foundation')
  reports: any[];

  @OneToMany('FoundationAxis', 'foundation')
  foundationAxes: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}