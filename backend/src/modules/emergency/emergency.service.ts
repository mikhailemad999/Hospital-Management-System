import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyCase } from '../../entities';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(EmergencyCase)
    private emergRepo: Repository<EmergencyCase>,
  ) {}

  async findAll() {
    return this.emergRepo.find({ order: { acuityLevel: 'ASC', createdAt: 'DESC' } });
  }

  async getUrgencySpectrum() {
    const cases = await this.emergRepo.find();
    return {
      l1: cases.filter((c) => c.acuityLevel === 1).length,
      l2: cases.filter((c) => c.acuityLevel === 2).length,
      l3: cases.filter((c) => c.acuityLevel === 3).length,
      l4: cases.filter((c) => c.acuityLevel === 4).length,
      l5: cases.filter((c) => c.acuityLevel === 5).length,
      totalActive: cases.length,
      avgDoorToTriage: 4.8,
      avgDoorToDoc: 16.2,
    };
  }

  async createRapidIntake(data: Partial<EmergencyCase>) {
    const count = await this.emergRepo.count();
    data.caseNumber = `ED-2026-${1000 + count + 1}`;
    data.arrivalTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST';
    if (!data.acuityLevel) data.acuityLevel = 3;
    const labelMap: Record<number, string> = { 1: 'RESUS', 2: 'EMERG', 3: 'URG', 4: 'LESS', 5: 'NON' };
    data.acuityLabel = labelMap[data.acuityLevel] || 'URG';
    data.doorToTriageMin = Number((Math.random() * 3 + 2).toFixed(1));
    data.doorToDocMin = Number((Math.random() * 10 + 8).toFixed(1));
    const newCase = this.emergRepo.create(data);
    return this.emergRepo.save(newCase);
  }

  async updateStatus(id: string, status: string, bay?: string) {
    const updatePayload: Partial<EmergencyCase> = { status };
    if (bay) updatePayload.bay = bay;
    await this.emergRepo.update(id, updatePayload);
    return this.emergRepo.findOne({ where: { id } });
  }
}
