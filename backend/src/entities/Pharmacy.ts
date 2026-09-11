import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  genericName: string;

  @Column({ length: 100 })
  category: string; // Antibiotic, Analgesic, Cardiovascular, Antidiabetic, etc.

  @Column({ length: 50 })
  form: string; // Tablet, Capsule, Vial, Ampoule, Syrup

  @Column({ length: 50 })
  strength: string; // e.g. 500mg, 10mg/mL

  @Column({ length: 20, default: 'box' })
  unitOfMeasure: string;

  @Column({ type: 'int', default: 50 })
  reorderLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 10.00 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 18.00 })
  sellingPrice: number;

  @Column({ type: 'int', default: 100 })
  totalStock: number;

  @Column({ default: true })
  isActive: boolean;
}

@Entity('medication_batches')
export class MedicationBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  medicationId: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  genericName: string;

  @Column({ length: 50 })
  form: string;

  @Column({ length: 50 })
  strength: string;

  @Column({ length: 50 })
  batchNumber: string;

  @Column({ type: 'date' })
  expiryDate: string;

  @Column({ type: 'int', default: 180 })
  daysToExpiry: number;

  @Column({ type: 'int', default: 100 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 12.50 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 22.00 })
  sellingPrice: number;

  @Column({ length: 50, default: 'Rack A-04' })
  location: string;

  @Column({ default: false })
  isLowStock: boolean;

  @Column({ default: false })
  isExpiringSoon: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  batchId: string;

  @Column({ length: 150 })
  medicationName: string;

  @Column({ length: 50 })
  batchNumber: string;

  @Column({ length: 50 })
  movementType: string; // PURCHASE_RECEIPT, PATIENT_DISPENSE, WARD_ISSUE, OR_ISSUE, RETURN, ADJUSTMENT

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @Column({ length: 100, nullable: true })
  patientName: string;

  @Column({ length: 50, nullable: true })
  mrn: string;

  @Column({ length: 255 })
  reason: string;

  @Column({ length: 100 })
  performedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
