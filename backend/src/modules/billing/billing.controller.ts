import { Controller, Get, Post, Body } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Invoice } from '../../entities';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  async getInvoices() {
    return this.billingService.getInvoices();
  }

  @Post('invoices')
  async createInvoice(@Body() data: Partial<Invoice>) {
    return this.billingService.createInvoice(data);
  }

  @Post('payments')
  async processPayment(
    @Body() body: { invoiceId: string; amount: number; method: string; cashierName: string },
  ) {
    return this.billingService.processPayment(body);
  }

  @Get('cashier-shift')
  async getCashierShift() {
    return this.billingService.getCashierShift();
  }
}
