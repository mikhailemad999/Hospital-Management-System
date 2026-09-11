import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  timestamp: string;

  @Column({ length: 100 })
  user: string;

  @Column({ length: 50 })
  role: string;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ length: 100 })
  entityId: string;

  @Column({ length: 50, default: '192.168.10.45' })
  ipAddress: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ length: 20, default: 'INFO' })
  severity: string; // INFO, WARN, CRITICAL

  @CreateDateColumn()
  createdAt: Date;
}
