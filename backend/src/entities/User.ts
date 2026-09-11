import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'receptionist',
  })
  role: string;

  @Column({ length: 100, default: 'General Medicine' })
  department: string;

  @Column({ length: 50, default: 'STAFF-001' })
  badgeNumber: string;

  @Column({ length: 255, nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
