import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  invoiceNumber: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ length: 50 })
  mrn: string;

  @Column({ length: 50 })
  date: string;

  @Column({ type: 'text' })
  itemsJson: string; // JSON array of items: [{ description, category, qty, unitPrice, total }]

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  discount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  paid: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  balance: number;

  @Column({ length: 30, default: 'UNPAID' })
  status: string; // PAID, PARTIAL, UNPAID

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  paymentNumber: string;

  @Column()
  invoiceId: string;

  @Column({ length: 100 })
  patientName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 50, default: 'CREDIT_CARD' })
  method: string; // CASH, CREDIT_CARD, DEBIT_CARD, INSURANCE

  @Column({ length: 100 })
  cashierName: string;

  @Column({ length: 50 })
  transactionDate: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('cashier_shifts')
export class CashierShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  shiftNumber: string;

  @Column({ length: 100 })
  cashierName: string;

  @Column({ length: 50 })
  startTime: string;

  @Column({ length: 50, nullable: true })
  endTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500.00 })
  openingFloat: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  totalCashCollected: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  totalCardCollected: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  totalInsuranceProcessed: number;

  @Column({ length: 30, default: 'OPEN' })
  status: string; // OPEN, BALANCED, CLOSED
}
