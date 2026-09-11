import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLog } from '../../entities';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  async getLogs() {
    return this.auditService.getLogs();
  }

  @Post('logs')
  async createLog(@Body() data: Partial<AuditLog>) {
    return this.auditService.log(data);
  }
}
