import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSign, MARRecord, NursingNote } from '../../entities';

@Injectable()
export class NursingService {
  constructor(
    @InjectRepository(VitalSign)
    private vitalsRepo: Repository<VitalSign>,
    @InjectRepository(MARRecord)
    private marRepo: Repository<MARRecord>,
    @InjectRepository(NursingNote)
    private notesRepo: Repository<NursingNote>,
  ) {}

  async getVitals(patientId?: string) {
    if (patientId) {
      return this.vitalsRepo.find({ where: { patientId }, order: { createdAt: 'DESC' } });
    }
    return this.vitalsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async recordVitals(data: Partial<VitalSign>) {
    data.recordedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST';
    // Check abnormal thresholds
    const isAbnormal = 
      (data.oxygenSaturation !== undefined && data.oxygenSaturation < 93) ||
      (data.systolicBP !== undefined && (data.systolicBP > 140 || data.systolicBP < 90)) ||
      (data.temperature !== undefined && data.temperature > 38.0) ||
      (data.pulse !== undefined && (data.pulse > 100 || data.pulse < 55));
    data.isAbnormal = isAbnormal;
    const v = this.vitalsRepo.create(data);
    return this.vitalsRepo.save(v);
  }

  async getMAR() {
    return this.marRepo.find({ order: { createdAt: 'DESC' } });
  }

  async administerMAR(id: string, nurseName: string, notes?: string) {
    const mar = await this.marRepo.findOne({ where: { id } });
    if (!mar) return null;
    mar.status = 'ADMINISTERED';
    mar.administeredBy = nurseName;
    mar.administeredAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST';
    if (notes) mar.notes = notes;
    return this.marRepo.save(mar);
  }

  async getNursingNotes() {
    return this.notesRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createNursingNote(data: Partial<NursingNote>) {
    data.noteDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const n = this.notesRepo.create(data);
    return this.notesRepo.save(n);
  }
}
