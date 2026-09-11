import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  admissionNumber: string;

  @Column()
  patientId: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 100 })
  wardName: string;

  @Column({ length: 20 })
  roomNumber: string;

  @Column({ length: 20 })
  bedNumber: string;

  @Column({ length: 100 })
  attendingDoctor: string;

  @Column()
  admissionDate: string;

  @Column({ nullable: true })
  dischargeDate: string;

  @Column({ type: 'text' })
  admittingDiagnosis: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'ACTIVE',
  })
  status: string; // ACTIVE, DISCHARGED, TRANSFERRED

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 250.00 })
  dailyBedRate: number;

  @Column({ type: 'text', nullable: true })
  dischargeSummary: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('bed_transfers')
export class BedTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  admissionId: string;

  @Column()
  patientId: string;

  @Column({ length: 50 })
  fromBed: string;

  @Column({ length: 50 })
  toBed: string;

  @Column()
  transferDate: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ length: 100 })
  transferredBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
