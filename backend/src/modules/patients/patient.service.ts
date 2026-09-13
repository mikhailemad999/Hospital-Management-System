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

  async create(data: Partial<Patient> & Record<string, any>) {
    if (!data.mrn) {
      const count = await this.patientRepo.count();
      data.mrn = `MRN-${90000 + count + 1}`;
    }

    // Support fullName or firstName/lastName
    if (!data.firstName && data.fullName) {
      const parts = String(data.fullName).trim().split(/\s+/);
      data.firstName = parts[0] || 'Patient';
      data.lastName = parts.slice(1).join(' ') || 'Record';
    }
    data.firstName = data.firstName || 'Patient';
    data.lastName = data.lastName || 'Record';

    // Support contactPhone, mobile, or phone
    data.phone = data.phone || data.contactPhone || data.mobile || '+1 (555) 000-0000';

    // Support nationalId
    if (!data.nationalId) {
      data.nationalId = `NAT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    }

    // Normalize gender
    if (data.gender) {
      const g = String(data.gender).toUpperCase();
      data.gender = g.startsWith('M') ? 'M' : g.startsWith('F') ? 'F' : 'Other';
    } else {
      data.gender = 'M';
    }

    // Default dates & age
    data.dateOfBirth = data.dateOfBirth || '1985-05-15';
    data.age = data.age !== undefined ? data.age : 35;
    data.bloodType = data.bloodType || 'O+';
    data.status = data.status || 'Outpatient';

    // Handle array fields
    if (Array.isArray(data.allergies)) {
      data.allergies = data.allergies.join(', ');
    }
    if (Array.isArray(data.chronicConditions)) {
      data.chronicConditions = data.chronicConditions.join(', ');
    }

    // Handle nested insurance
    if (data.insurance && typeof data.insurance === 'object') {
      if (data.insurance.provider) data.insuranceProvider = data.insurance.provider;
      if (data.insurance.policyNumber) data.insurancePolicyNumber = data.insurance.policyNumber;
      if (data.insurance.coveragePct !== undefined) data.insuranceCoveragePct = data.insurance.coveragePct;
    }

    // Handle nested emergencyContact
    if (data.emergencyContact && typeof data.emergencyContact === 'object') {
      if (data.emergencyContact.name) data.emergencyContactName = data.emergencyContact.name;
      if (data.emergencyContact.relationship) data.emergencyContactRelationship = data.emergencyContact.relationship;
      if (data.emergencyContact.phone) data.emergencyContactPhone = data.emergencyContactPhone;
    }

    const patient = this.patientRepo.create(data);
    return this.patientRepo.save(patient);
  }

  async update(id: string, data: Partial<Patient> & Record<string, any>) {
    if (Array.isArray(data.allergies)) {
      data.allergies = data.allergies.join(', ');
    }
    if (Array.isArray(data.chronicConditions)) {
      data.chronicConditions = data.chronicConditions.join(', ');
    }
    if (data.insurance && typeof data.insurance === 'object') {
      if (data.insurance.provider) data.insuranceProvider = data.insurance.provider;
      if (data.insurance.policyNumber) data.insurancePolicyNumber = data.insurance.policyNumber;
      if (data.insurance.coveragePct !== undefined) data.insuranceCoveragePct = data.insuranceCoveragePct;
    }
    if (data.emergencyContact && typeof data.emergencyContact === 'object') {
      if (data.emergencyContact.name) data.emergencyContactName = data.emergencyContact.name;
      if (data.emergencyContact.relationship) data.emergencyContactRelationship = data.emergencyContact.relationship;
      if (data.emergencyContact.phone) data.emergencyContactPhone = data.emergencyContactPhone;
    }
    await this.findOne(id);
    await this.patientRepo.update(id, data);
    return this.findOne(id);
  }
}
