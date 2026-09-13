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

  async createOperation(data: Partial<Operation> & Record<string, any>) {
    const count = await this.opRepo.count();
    data.operationNumber = data.operationNumber || `OR-2026-${1000 + count + 1 + Math.floor(Math.random() * 500)}`;
    data.orRoom = data.orRoom || data.theaterNumber || 'OR-1 (General Surgery)';
    data.patientName = data.patientName || 'Emergency Surgery Patient';
    data.mrn = data.mrn || `MRN-OR-${1000 + count + 1}`;
    data.procedureName = data.procedureName || 'General Surgical Intervention';
    data.leadSurgeon = data.leadSurgeon || 'Dr. Elena Rostova, MD';
    data.anesthetist = data.anesthetist || 'Dr. Nathan Vance, MD';
    data.circulatingNurse = data.circulatingNurse || 'Nurse Lisa Adams, RN';
    data.scheduledTime = data.scheduledTime || (new Date().toISOString().replace('T', ' ').substring(0, 16));
    data.preOpDiagnosis = data.preOpDiagnosis || 'Pre-operative assessment completed';
    data.consumablesCost = data.consumablesCost !== undefined ? data.consumablesCost : 850.00;
    data.grossRevenue = data.grossRevenue !== undefined ? data.grossRevenue : 4500.00;
    if (!data.status) data.status = 'SCHEDULED';

    // Calculate doctor share basis (35% of net after consumables)
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

  async logConsumable(data: Partial<OperationConsumable> & Record<string, any>) {
    data.batchNumber = data.batchNumber || `LOT-${Math.floor(1000 + Math.random() * 9000)}`;
    data.usedAt = data.usedAt || (new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST');
    data.quantity = data.quantity !== undefined ? data.quantity : 1;
    data.unitCost = data.unitCost !== undefined ? data.unitCost : 10.00;
    data.totalCost = Number(((data.quantity || 1) * (data.unitCost || 0)).toFixed(2));
    const c = this.consumableRepo.create(data);
    return this.consumableRepo.save(c);
  }
}
