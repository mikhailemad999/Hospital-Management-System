import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('employees')
  async getEmployees() {
    return this.payrollService.getEmployees();
  }

  @Get('attendance')
  async getAttendance() {
    return this.payrollService.getAttendance();
  }

  @Post('clock')
  async clockInOut(@Body() body: { employeeCode: string; shiftType?: string }) {
    return this.payrollService.clockInOut(body.employeeCode, body.shiftType);
  }

  @Get('records')
  async getPayrollRecords(@Query('period') period?: string) {
    return this.payrollService.getPayrollRecords(period);
  }

  @Post('generate')
  async generatePayrollForPeriod(@Body('period') period: string) {
    return this.payrollService.generatePayrollForPeriod(period || 'September 2026');
  }
}
