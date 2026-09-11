import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lab_orders')
export class LabOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  orderNumber: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 100 })
  testName: string; // Complete Blood Count (CBC), Comprehensive Metabolic Panel, Troponin I, etc.

  @Column({ length: 50, default: 'ROUTINE' })
  priority: string; // STAT, URGENT, ROUTINE

  @Column({ length: 50, default: 'ANALYZING' })
  status: string; // PENDING, SAMPLE_COLLECTED, ANALYZING, COMPLETED

  @Column({ length: 100 })
  orderedBy: string;

  @Column({ length: 50 })
  orderedAt: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('lab_results')
export class LabResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column({ length: 100 })
  parameter: string; // Hemoglobin, WBC, Platelets, Potassium, etc.

  @Column({ length: 50 })
  value: string;

  @Column({ length: 50 })
  referenceRange: string;

  @Column({ length: 20 })
  unit: string;

  @Column({ default: false })
  isAbnormal: boolean;
}

@Entity('radiology_orders')
export class RadiologyOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  orderNumber: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 50 })
  modality: string; // CT, X-RAY, MRI, ULTRASOUND

  @Column({ length: 100 })
  studyDescription: string; // CT Chest/Abdomen/Pelvis with IV Contrast

  @Column({ length: 50, default: 'STAT' })
  priority: string;

  @Column({ length: 50, default: 'REPORTED' })
  status: string; // SCHEDULED, IN_PROGRESS, REPORTED

  @Column({ length: 100 })
  orderedBy: string;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'text', nullable: true })
  impression: string;

  @Column({ length: 100, nullable: true })
  radiologist: string;

  @CreateDateColumn()
  createdAt: Date;
}
