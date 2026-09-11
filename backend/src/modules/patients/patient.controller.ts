import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from '../../entities';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(@Query('q') query?: string) {
    return this.patientService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Get('mrn/:mrn')
  async findByMrn(@Param('mrn') mrn: string) {
    return this.patientService.findByMrn(mrn);
  }

  @Post()
  async create(@Body() patientData: Partial<Patient>) {
    return this.patientService.create(patientData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() patientData: Partial<Patient>) {
    return this.patientService.update(id, patientData);
  }
}
