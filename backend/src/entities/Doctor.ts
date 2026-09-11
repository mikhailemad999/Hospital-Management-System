import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('encounters')
export class Encounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  encounterNumber: string;

  @Column()
  patientId: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 100 })
  doctorName: string;

  @Column({ length: 100 })
  departmentName: string;

  @Column({ length: 50 })
  encounterDate: string;

  @Column({ length: 30, default: 'OUTPATIENT' })
  type: string; // OUTPATIENT, EMERGENCY, INPATIENT

  @Column({ type: 'text' })
  chiefComplaint: string;

  @Column({ type: 'text', nullable: true })
  historyOfPresentIllness: string;

  @Column({ type: 'text', nullable: true })
  physicalExamination: string;

  @Column({ type: 'text' })
  assessment: string;

  @Column({ type: 'text' })
  plan: string;

  @Column({ length: 20, default: 'I10' })
  icd10Code: string;

  @Column({ length: 255, default: 'Essential (primary) hypertension' })
  diagnosisDescription: string;

  @Column({ length: 30, default: 'CLOSED' })
  status: string; // OPEN, CLOSED

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  prescriptionNumber: string;

  @Column()
  encounterId: string;

  @Column()
  patientId: string;

  @Column({ length: 100 })
  doctorName: string;

  @Column({ length: 50 })
  issuedDate: string;

  @Column({ length: 30, default: 'PENDING' })
  status: string; // PENDING, DISPENSED, CANCELLED

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prescriptionId: string;

  @Column({ length: 100 })
  medicationName: string;

  @Column({ length: 50 })
  dosage: string;

  @Column({ length: 50 })
  frequency: string;

  @Column({ type: 'int', default: 7 })
  durationDays: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ length: 30, default: 'PENDING' })
  status: string;
}
