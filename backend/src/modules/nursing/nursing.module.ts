import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSign, MARRecord, NursingNote } from '../../entities';
import { NursingService } from './nursing.service';
import { NursingController } from './nursing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSign, MARRecord, NursingNote])],
  controllers: [NursingController],
  providers: [NursingService],
  exports: [NursingService],
})
export class NursingModule {}
