import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  employeeCode: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100 })
  jobTitle: string; // Attending Trauma Surgeon, Charge Nurse, Clinical Pharmacist, etc.

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  housingAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  transportAllowance: number;

  @Column({ length: 50, default: 'ACTIVE' })
  status: string;
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  employeeCode: string;

  @Column({ length: 100 })
  employeeName: string;

  @Column({ length: 50 })
  shiftDate: string;

  @Column({ length: 50 })
  shiftType: string; // Day (07:00-15:00), Evening (15:00-23:00), Night (23:00-07:00)

  @Column({ length: 20 })
  clockIn: string;

  @Column({ length: 20, nullable: true })
  clockOut: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 8.00 })
  workedHours: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0.00 })
  overtimeHours: number;

  @Column({ length: 50, default: 'PRESENT' })
  status: string; // PRESENT, LATE, ABSENT, ON_DUTY

  @Column({ default: true })
  biometricVerified: boolean;
}

@Entity('payroll_records')
export class PayrollRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  period: string; // e.g. "October 2026"

  @Column({ length: 50 })
  employeeCode: string;

  @Column({ length: 100 })
  employeeName: string;

  @Column({ length: 100 })
  jobTitle: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  allowances: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  doctorCommissions: number; // consultation + surgery shares

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  overtimeBonus: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  deductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netPayable: number;

  @Column({ length: 50, default: 'APPROVED' })
  status: string; // DRAFT, APPROVED, PAID, LOCKED
}
