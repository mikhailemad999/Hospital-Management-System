import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vital_signs')
export class VitalSign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ length: 50, nullable: true })
  admissionId: string;

  @Column({ length: 50 })
  recordedAt: string;

  @Column({ length: 100 })
  recordedBy: string;

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  temperature: number; // Celsius (e.g. 37.2)

  @Column({ type: 'int' })
  pulse: number; // bpm

  @Column({ type: 'int' })
  systolicBP: number;

  @Column({ type: 'int' })
  diastolicBP: number;

  @Column({ type: 'int' })
  respiratoryRate: number; // breaths/min

  @Column({ type: 'int' })
  oxygenSaturation: number; // % SpO2

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  bloodGlucose: number; // mg/dL

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isAbnormal: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('mar_records')
export class MARRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  bedNumber: string;

  @Column({ length: 100 })
  medication: string;

  @Column({ length: 50 })
  dose: string;

  @Column({ length: 50 })
  route: string; // ORAL, IV, IM, SC, INHALATION

  @Column({ length: 50 })
  scheduledTime: string;

  @Column({ length: 30, default: 'DUE' })
  status: string; // DUE, ADMINISTERED, HELD, REFUSED

  @Column({ length: 100, nullable: true })
  administeredBy: string;

  @Column({ length: 50, nullable: true })
  administeredAt: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('nursing_notes')
export class NursingNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ length: 50 })
  shift: string; // Day, Evening, Night

  @Column({ length: 50 })
  noteDate: string;

  @Column({ length: 100 })
  nurseName: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  carePlanAction: string;

  @CreateDateColumn()
  createdAt: Date;
}
