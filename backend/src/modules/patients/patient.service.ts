import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from '../../entities';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async findAll(query?: string) {
    if (!query) {
      return this.patientRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.patientRepo.find({
      where: [
        { mrn: Like(`%${query}%`) },
        { nationalId: Like(`%${query}%`) },
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { phone: Like(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async findByMrn(mrn: string) {
    const patient = await this.patientRepo.findOne({ where: { mrn } });
    if (!patient) throw new NotFoundException(`Patient with MRN ${mrn} not found`);
    return patient;
  }

  async create(data: Partial<Patient>) {
    if (!data.mrn) {
      const count = await this.patientRepo.count();
      data.mrn = `MRN-${90000 + count + 1}`;
    }
    const patient = this.patientRepo.create(data);
    return this.patientRepo.save(patient);
  }

  async update(id: string, data: Partial<Patient>) {
    await this.findOne(id);
    await this.patientRepo.update(id, data);
    return this.findOne(id);
  }
}
