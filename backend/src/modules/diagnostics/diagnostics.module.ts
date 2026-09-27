import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticsController } from './diagnostics.controller';
import { DiagnosticsService } from './diagnostics.service';
import { LabOrder, LabResult, RadiologyOrder, AuditLog } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([LabOrder, LabResult, RadiologyOrder, AuditLog])],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService],
  exports: [DiagnosticsService],
})
export class DiagnosticsModule {}
