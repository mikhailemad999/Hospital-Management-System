import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  mrn: string;

  @Column({ unique: true, length: 50 })
  nationalId: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 10 })
  gender: string; // M, F, Other

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'int', default: 35 })
  age: number;

  @Column({ length: 10, default: 'O+' })
  bloodType: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ length: 50, nullable: true })
  emergencyContactRelationship: string;

  @Column({ length: 50, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'text', nullable: true })
  allergies: string; // JSON string or comma-separated

  @Column({ type: 'text', nullable: true })
  chronicConditions: string;

  @Column({ length: 100, default: 'MetLife Healthcare' })
  insuranceProvider: string;

  @Column({ length: 50, default: 'INS-99281' })
  insurancePolicyNumber: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 80.00 })
  insuranceCoveragePct: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  balance: number;

  @Column({ length: 50, default: 'Outpatient' })
  status: string; // Inpatient, Outpatient, Discharged, Emergency

  @Column({ length: 50, nullable: true })
  assignedBed: string;

  @Column({ nullable: true })
  admissionDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
