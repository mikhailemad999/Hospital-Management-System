import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('emergency_cases')
export class EmergencyCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  caseNumber: string;

  @Column({ nullable: true })
  patientId: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ type: 'int', default: 45 })
  age: number;

  @Column({ length: 10, default: 'M' })
  gender: string;

  @Column({ length: 50 })
  arrivalTime: string;

  @Column({ type: 'int', default: 3 })
  acuityLevel: number; // 1 to 5

  @Column({ length: 20, default: 'URG' })
  acuityLabel: string; // RESUS, EMERG, URG, LESS, NON

  @Column({ type: 'text' })
  chiefComplaint: string;

  @Column({ length: 50, default: 'Bay 4' })
  bay: string;

  @Column({ type: 'int', default: 85 })
  vitalsHr: number;

  @Column({ length: 20, default: '128/82' })
  vitalsBp: string;

  @Column({ type: 'int', default: 98 })
  vitalsSpo2: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 37.1 })
  vitalsTemp: number;

  @Column({ type: 'int', default: 18 })
  vitalsRr: number;

  @Column({ length: 50, default: 'Physician Exam' })
  status: string; // Awaiting Triage, Physician Exam, Diagnostics, OR Bypass, Admitted, Discharged

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 4.8 })
  doorToTriageMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 16.2 })
  doorToDocMin: number;

  @Column({ length: 100, nullable: true })
  attendingPhysician: string;

  @CreateDateColumn()
  createdAt: Date;
}
