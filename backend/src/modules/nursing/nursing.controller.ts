import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { NursingService } from './nursing.service';
import { VitalSign, NursingNote } from '../../entities';

@Controller('nursing')
export class NursingController {
  constructor(private readonly nursingService: NursingService) {}

  @Get('vitals')
  async getVitals(@Query('patientId') patientId?: string) {
    return this.nursingService.getVitals(patientId);
  }

  @Post('vitals')
  async recordVitals(@Body() data: Partial<VitalSign>) {
    return this.nursingService.recordVitals(data);
  }

  @Get('mar')
  async getMAR() {
    return this.nursingService.getMAR();
  }

  @Post('mar/:id/administer')
  async administerMAR(
    @Param('id') id: string,
    @Body() body: { nurseName: string; notes?: string },
  ) {
    return this.nursingService.administerMAR(id, body.nurseName, body.notes);
  }

  @Get('notes')
  async getNursingNotes() {
    return this.nursingService.getNursingNotes();
  }

  @Post('notes')
  async createNursingNote(@Body() data: Partial<NursingNote>) {
    return this.nursingService.createNursingNote(data);
  }
}
