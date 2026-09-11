import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch, Department, Bed } from '../../entities';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
    @InjectRepository(Department)
    private deptRepo: Repository<Department>,
    @InjectRepository(Bed)
    private bedRepo: Repository<Bed>,
  ) {}

  async getBranches() {
    return this.branchRepo.find();
  }

  async getDepartments() {
    return this.deptRepo.find();
  }

  async getBeds(wardType?: string) {
    if (wardType) {
      return this.bedRepo.find({ where: { wardType } });
    }
    return this.bedRepo.find();
  }

  async updateBedStatus(bedId: string, status: string, patientName?: string, mrn?: string) {
    const bed = await this.bedRepo.findOne({ where: { id: bedId } });
    if (!bed) return null;
    bed.status = status;
    if (patientName !== undefined) bed.patientName = patientName;
    if (mrn !== undefined) bed.mrn = mrn;
    if (status === 'available') {
      bed.patientName = null;
      bed.mrn = null;
      bed.admitTime = null;
    }
    return this.bedRepo.save(bed);
  }
}
