import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, Payment, CashierShift } from '../../entities';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(CashierShift)
    private shiftRepo: Repository<CashierShift>,
  ) {}

  async getInvoices() {
    return this.invoiceRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createInvoice(data: Partial<Invoice>) {
    const count = await this.invoiceRepo.count();
    data.invoiceNumber = `INV-2026-${1000 + count + 1}`;
    data.date = new Date().toISOString().substring(0, 10);
    data.paid = 0;
    data.balance = data.total || 0;
    data.status = 'UNPAID';
    const inv = this.invoiceRepo.create(data);
    return this.invoiceRepo.save(inv);
  }

  async processPayment(data: { invoiceId: string; amount: number; method: string; cashierName: string }) {
    const inv = await this.invoiceRepo.findOne({ where: { id: data.invoiceId } });
    if (!inv) return null;

    const count = await this.paymentRepo.count();
    const payment = this.paymentRepo.create({
      paymentNumber: `RCPT-2026-${1000 + count + 1}`,
      invoiceId: inv.id,
      patientName: inv.patientName,
      amount: data.amount,
      method: data.method,
      cashierName: data.cashierName,
      transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
    await this.paymentRepo.save(payment);

    inv.paid = Number(inv.paid) + Number(data.amount);
    inv.balance = Number(inv.total) - Number(inv.paid);
    if (inv.balance <= 0) {
      inv.balance = 0;
      inv.status = 'PAID';
    } else {
      inv.status = 'PARTIAL';
    }
    await this.invoiceRepo.save(inv);

    return { success: true, payment, updatedInvoice: inv };
  }

  async getCashierShift() {
    let shift = await this.shiftRepo.findOne({ where: { status: 'OPEN' } });
    if (!shift) {
      shift = this.shiftRepo.create({
        shiftNumber: 'SHIFT-2026-09A',
        cashierName: 'David Keller, CPA',
        startTime: '08:00 EST',
        openingFloat: 500.00,
        totalCashCollected: 1420.00,
        totalCardCollected: 4890.50,
        totalInsuranceProcessed: 12400.00,
        status: 'OPEN',
      });
      await this.shiftRepo.save(shift);
    }
    return shift;
  }
}
