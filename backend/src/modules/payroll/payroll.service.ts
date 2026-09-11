import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, AttendanceRecord, PayrollRecord } from '../../entities';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Employee)
    private empRepo: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private attRepo: Repository<AttendanceRecord>,
    @InjectRepository(PayrollRecord)
    private payrollRepo: Repository<PayrollRecord>,
  ) {}

  async getEmployees() {
    return this.empRepo.find();
  }

  async getAttendance() {
    return this.attRepo.find({ order: { shiftDate: 'DESC' } });
  }

  async clockInOut(employeeCode: string, shiftType: string = 'Day') {
    const today = new Date().toISOString().substring(0, 10);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let record = await this.attRepo.findOne({
      where: { employeeCode, shiftDate: today },
    });

    if (!record) {
      const emp = await this.empRepo.findOne({ where: { employeeCode } });
      record = this.attRepo.create({
        employeeCode,
        employeeName: emp ? emp.fullName : 'Staff Member',
        shiftDate: today,
        shiftType,
        clockIn: nowTime,
        status: 'ON_DUTY',
        biometricVerified: true,
      });
    } else {
      record.clockOut = nowTime;
      record.status = 'PRESENT';
      record.workedHours = 8.0;
    }

    return this.attRepo.save(record);
  }

  async getPayrollRecords(period: string = 'September 2026') {
    return this.payrollRepo.find({
      where: period ? { period } : {},
      order: { netPayable: 'DESC' },
    });
  }

  async generatePayrollForPeriod(period: string) {
    const employees = await this.empRepo.find({ where: { status: 'ACTIVE' } });
    const records: PayrollRecord[] = [];

    for (const emp of employees) {
      const isDoctor = emp.jobTitle.toLowerCase().includes('surgeon') || emp.jobTitle.toLowerCase().includes('cardiologist') || emp.jobTitle.toLowerCase().includes('doctor');
      const commission = isDoctor ? Number((Math.random() * 3000 + 2500).toFixed(2)) : 0.00;
      const allowances = Number(emp.housingAllowance) + Number(emp.transportAllowance);
      const deductions = Number((emp.basicSalary * 0.05).toFixed(2));
      const netPayable = Number(emp.basicSalary) + allowances + commission - deductions;

      const p = this.payrollRepo.create({
        period,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        jobTitle: emp.jobTitle,
        basicSalary: emp.basicSalary,
        allowances,
        doctorCommissions: commission,
        overtimeBonus: 0.00,
        deductions,
        netPayable,
        status: 'APPROVED',
      });
      records.push(await this.payrollRepo.save(p));
    }
    return records;
  }
}
