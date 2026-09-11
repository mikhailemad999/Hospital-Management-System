import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { SeedService } from './database/seed/seed.service';

import { AuthModule } from './modules/auth/auth.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { PatientModule } from './modules/patients/patient.module';
import { AppointmentModule } from './modules/appointments/appointment.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { InpatientModule } from './modules/inpatient/inpatient.module';
import { NursingModule } from './modules/nursing/nursing.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { OperationsModule } from './modules/operations/operations.module';
import { BillingModule } from './modules/billing/billing.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { AuditModule } from './modules/audit/audit.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    HospitalModule,
    PatientModule,
    AppointmentModule,
    EmergencyModule,
    InpatientModule,
    NursingModule,
    PharmacyModule,
    OperationsModule,
    BillingModule,
    PayrollModule,
    AuditModule,
    TelemetryModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
