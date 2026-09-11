import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('branches')
  async getBranches() {
    return this.hospitalService.getBranches();
  }

  @Get('departments')
  async getDepartments() {
    return this.hospitalService.getDepartments();
  }

  @Get('beds')
  async getBeds(@Query('wardType') wardType?: string) {
    return this.hospitalService.getBeds(wardType);
  }

  @Patch('beds/:id/status')
  async updateBedStatus(
    @Param('id') id: string,
    @Body() body: { status: string; patientName?: string; mrn?: string },
  ) {
    return this.hospitalService.updateBedStatus(id, body.status, body.patientName, body.mrn);
  }
}
