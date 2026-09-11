import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ default: true })
  isActive: boolean;
}

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  headStaff: string;

  @Column({ default: true })
  isActive: boolean;
}

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  wardType: string; // ICU, GENERAL, SURGERY, PEDIATRICS, CARDIOLOGY

  @Column({ type: 'int', default: 20 })
  capacity: number;
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  roomNumber: string;

  @Column({ length: 100 })
  wardName: string;

  @Column({ length: 50, default: 'GENERAL' })
  roomType: string; // PRIVATE, SEMI_PRIVATE, GENERAL, ICU
}

@Entity('beds')
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  bedNumber: string;

  @Column({ length: 20 })
  roomNumber: string;

  @Column({ length: 100 })
  wardName: string;

  @Column({ length: 50, default: 'GENERAL' })
  wardType: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'available',
  })
  status: string; // available, occupied, cleaning, maintenance, reserved

  @Column({ nullable: true })
  patientId: string;

  @Column({ length: 100, nullable: true })
  patientName: string;

  @Column({ length: 50, nullable: true })
  mrn: string;

  @Column({ nullable: true })
  admitTime: string;

  @Column({ length: 100, nullable: true })
  attendingDoctor: string;

  @Column({ length: 100, nullable: true })
  nurseInCharge: string;

  @Column({ length: 50, default: '4.32 bar' })
  o2Telemetry: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 250.00 })
  dailyRate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
