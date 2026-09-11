import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async getLogs() {
    return this.auditRepo.find({ order: { createdAt: 'DESC' } });
  }

  async log(data: Partial<AuditLog>) {
    data.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const log = this.auditRepo.create(data);
    return this.auditRepo.save(log);
  }
}
