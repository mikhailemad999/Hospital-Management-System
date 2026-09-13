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

  async recordVitals(data: Partial<VitalSign> & Record<string, any>) {
    data.recordedAt = data.recordedAt || (new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EST');
    data.recordedBy = data.recordedBy || 'Nurse on Duty';
    data.patientId = data.patientId || 'pat-1';

    // Parse blood pressure if provided as string e.g. "120/80"
    if (data.bloodPressure && typeof data.bloodPressure === 'string') {
      const parts = data.bloodPressure.split('/');
      if (parts.length === 2) {
        data.systolicBP = parseInt(parts[0], 10) || data.systolicBP;
        data.diastolicBP = parseInt(parts[1], 10) || data.diastolicBP;
      }
    }
    data.systolicBP = data.systolicBP !== undefined ? data.systolicBP : 120;
    data.diastolicBP = data.diastolicBP !== undefined ? data.diastolicBP : 80;
    data.pulse = data.pulse !== undefined ? data.pulse : (data.heartRate !== undefined ? data.heartRate : 75);
    data.temperature = data.temperature !== undefined ? data.temperature : (data.temp !== undefined ? data.temp : 37.0);
    data.respiratoryRate = data.respiratoryRate !== undefined ? data.respiratoryRate : (data.rr !== undefined ? data.rr : 16);
    data.oxygenSaturation = data.oxygenSaturation !== undefined ? data.oxygenSaturation : (data.spo2 !== undefined ? data.spo2 : 98);

    // Check abnormal thresholds
    const isAbnormal = 
      (data.oxygenSaturation < 93) ||
      (data.systolicBP > 140 || data.systolicBP < 90) ||
      (data.temperature > 38.0) ||
      (data.pulse > 100 || data.pulse < 55);
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

  async createNursingNote(data: Partial<NursingNote> & Record<string, any>) {
    data.noteDate = data.noteDate || new Date().toISOString().replace('T', ' ').substring(0, 19);
    data.patientId = data.patientId || 'pat-1';
    data.shift = data.shift || 'Day';
    data.nurseName = data.nurseName || 'Nurse Emily Chen, RN';
    data.content = data.content || 'Routine nursing assessment documented.';
    const n = this.notesRepo.create(data);
    return this.notesRepo.save(n);
  }
}
