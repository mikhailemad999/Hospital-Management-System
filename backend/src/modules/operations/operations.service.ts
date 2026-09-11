import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation, OperationConsumable } from '../../entities';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private opRepo: Repository<Operation>,
    @InjectRepository(OperationConsumable)
    private consumableRepo: Repository<OperationConsumable>,
  ) {}

  async getSchedules() {
    return this.opRepo.find({ order: { scheduledTime: 'ASC' } });
  }

  async createOperation(data: Partial<Operation>) {
    const count = await this.opRepo.count();
    data.operationNumber = `OR-2026-${1000 + count + 1}`;
    if (!data.status) data.status = 'SCHEDULED';
    // Calculate doctor share basis (e.g. 25% of gross revenue minus consumables)
    if (data.grossRevenue && !data.surgeonShare) {
      data.surgeonShare = Number(((data.grossRevenue - (data.consumablesCost || 0)) * 0.35).toFixed(2));
    }
    const op = this.opRepo.create(data);
    return this.opRepo.save(op);
  }

  async updateStatus(id: string, status: string, duration?: string) {
    const payload: Partial<Operation> = { status };
    if (duration) payload.actualDuration = duration;
    await this.opRepo.update(id, payload);
    return this.opRepo.findOne({ where: { id } });
  }

  async getConsumables(operationId: string) {
    return this.consumableRepo.find({ where: { operationId } });
  }

  async logConsumable(data: Partial<OperationConsumable>) {
    data.totalCost = (data.quantity || 1) * (data.unitCost || 0);
    data.usedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST';
    const c = this.consumableRepo.create(data);
    return this.consumableRepo.save(c);
  }
}
