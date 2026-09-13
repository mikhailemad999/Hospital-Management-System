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

  async log(data: Partial<AuditLog> & Record<string, any>) {
    data.timestamp = data.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
    data.user = data.user || data.userId || data.userName || 'system';
    data.role = data.role || data.userRole || 'admin';
    data.action = data.action || 'SYSTEM_EVENT';
    data.entity = data.entity || data.resource || 'SYSTEM';
    data.entityId = data.entityId || data.resourceId || 'N/A';
    data.ipAddress = data.ipAddress || '127.0.0.1';
    data.details = data.details || data.message || 'Audit event logged';
    data.severity = data.severity || 'INFO';
    const log = this.auditRepo.create(data);
    return this.auditRepo.save(log);
  }
}
