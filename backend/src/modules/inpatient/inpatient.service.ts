import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admission, BedTransfer, Bed } from '../../entities';

@Injectable()
export class InpatientService {
  constructor(
    @InjectRepository(Admission)
    private admRepo: Repository<Admission>,
    @InjectRepository(BedTransfer)
    private transferRepo: Repository<BedTransfer>,
    @InjectRepository(Bed)
    private bedRepo: Repository<Bed>,
  ) {}

  async getAdmissions(status: string = 'ACTIVE') {
    return this.admRepo.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async createAdmission(data: Partial<Admission> & Record<string, any>) {
    const count = await this.admRepo.count();
    data.admissionNumber = data.admissionNumber || `ADM-2026-${1000 + count + 1 + Math.floor(Math.random() * 500)}`;
    data.status = data.status || 'ACTIVE';
    data.admissionDate = data.admissionDate || (new Date().toISOString().replace('T', ' ').substring(0, 19));
    data.patientId = data.patientId || `pat-${Date.now().toString().slice(-6)}`;
    data.patientName = data.patientName || 'Admitted Patient';
    data.mrn = data.mrn || `MRN-${90000 + count + 1}`;
    data.wardName = data.wardName || data.ward || 'General Ward';
    data.roomNumber = data.roomNumber || data.room || 'Room 101';
    data.bedNumber = data.bedNumber || 'Bed-01';
    data.attendingDoctor = data.attendingDoctor || data.attendingPhysician || 'Dr. Sarah Vance, MD';
    data.admittingDiagnosis = data.admittingDiagnosis || data.diagnosis || 'Clinical observation & inpatient care';
    data.dailyBedRate = data.dailyBedRate !== undefined ? data.dailyBedRate : 250.00;
    
    // Update bed status
    if (data.bedNumber) {
      await this.bedRepo.update(
        { bedNumber: data.bedNumber },
        {
          status: 'occupied',
          patientName: data.patientName,
          mrn: data.mrn,
          admitTime: data.admissionDate,
          attendingDoctor: data.attendingDoctor,
        },
      );
    }

    const adm = this.admRepo.create(data);
    return this.admRepo.save(adm);
  }

  async transferBed(admissionId: string, toBedNumber: string, reason: string, staffName: string) {
    const adm = await this.admRepo.findOne({ where: [{ id: admissionId }, { admissionNumber: admissionId }] });
    if (!adm) return null;

    const oldBed = adm.bedNumber;
    // Release old bed
    await this.bedRepo.update({ bedNumber: oldBed }, { status: 'cleaning', patientName: null, mrn: null });
    // Occupy new bed
    await this.bedRepo.update(
      { bedNumber: toBedNumber },
      { status: 'occupied', patientName: adm.patientName, mrn: adm.mrn, admitTime: adm.admissionDate },
    );

    // Record transfer
    await this.transferRepo.save(
      this.transferRepo.create({
        admissionId: adm.id,
        patientId: adm.patientId,
        fromBed: oldBed,
        toBed: toBedNumber,
        transferDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        reason,
        transferredBy: staffName,
      }),
    );

    adm.bedNumber = toBedNumber;
    return this.admRepo.save(adm);
  }

  async dischargePatient(admissionId: string, summary: string) {
    const adm = await this.admRepo.findOne({ where: [{ id: admissionId }, { admissionNumber: admissionId }] });
    if (!adm) return null;

    adm.status = 'DISCHARGED';
    adm.dischargeDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    adm.dischargeSummary = summary;

    if (adm.bedNumber) {
      await this.bedRepo.update({ bedNumber: adm.bedNumber }, { status: 'cleaning', patientName: null, mrn: null });
    }

    return this.admRepo.save(adm);
  }
}
