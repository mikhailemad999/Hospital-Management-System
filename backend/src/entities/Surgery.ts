import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  operationNumber: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 150 })
  procedureName: string;

  @Column({ length: 50, default: 'OR-3 (Trauma Suite)' })
  orRoom: string;

  @Column({ length: 100 })
  leadSurgeon: string;

  @Column({ length: 100 })
  anesthetist: string;

  @Column({ length: 100 })
  circulatingNurse: string;

  @Column({ length: 50 })
  scheduledTime: string;

  @Column({ length: 50, nullable: true })
  actualDuration: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'IN_SURGERY',
  })
  status: string; // PRE_OP, IN_SURGERY, POST_OP_RECOVERY, COMPLETED, STANDBY

  @Column({ type: 'text' })
  preOpDiagnosis: string;

  @Column({ type: 'text', nullable: true })
  postOpDiagnosis: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 850.00 })
  consumablesCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1200.00 })
  surgeonShare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 4500.00 })
  grossRevenue: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('operation_consumables')
export class OperationConsumable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operationId: string;

  @Column({ length: 100 })
  itemName: string;

  @Column({ length: 50 })
  batchNumber: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCost: number;

  @Column({ length: 50 })
  usedAt: string;
}
