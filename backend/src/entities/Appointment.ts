import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  ticketNumber: string;

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

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column({ length: 20 })
  timeSlot: string;

  @Column({ length: 30, default: 'OUTPATIENT' })
  type: string; // OUTPATIENT, EMERGENCY, FOLLOW_UP

  @Column({ length: 30, default: 'WAITING' })
  status: string; // WAITING, CALLED, IN_CONSULTATION, COMPLETED, NO_SHOW, CANCELLED

  @Column({ type: 'int', default: 1 })
  queuePosition: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 150.00 })
  fee: number;

  @CreateDateColumn()
  createdAt: Date;
}
