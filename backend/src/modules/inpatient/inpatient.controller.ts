import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { InpatientService } from './inpatient.service';
import { Admission } from '../../entities';

@Controller('inpatient')
export class InpatientController {
  constructor(private readonly inpatService: InpatientService) {}

  @Get('admissions')
  async getAdmissions(@Query('status') status?: string) {
    return this.inpatService.getAdmissions(status);
  }

  @Post('admissions')
  async createAdmission(@Body() data: Partial<Admission>) {
    return this.inpatService.createAdmission(data);
  }

  @Post('transfer')
  async transferBed(
    @Body() body: { admissionId: string; toBedNumber: string; reason: string; staffName: string },
  ) {
    return this.inpatService.transferBed(body.admissionId, body.toBedNumber, body.reason, body.staffName);
  }

  @Post('discharge/:id')
  async dischargePatient(@Param('id') id: string, @Body('summary') summary: string) {
    return this.inpatService.dischargePatient(id, summary);
  }
}
