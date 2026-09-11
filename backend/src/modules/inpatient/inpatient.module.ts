import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission, BedTransfer, Bed } from '../../entities';
import { InpatientService } from './inpatient.service';
import { InpatientController } from './inpatient.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admission, BedTransfer, Bed])],
  controllers: [InpatientController],
  providers: [InpatientService],
  exports: [InpatientService],
})
export class InpatientModule {}
