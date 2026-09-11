import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyCase } from '../../entities';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergService: EmergencyService) {}

  @Get('cases')
  async findAll() {
    return this.emergService.findAll();
  }

  @Get('spectrum')
  async getSpectrum() {
    return this.emergService.getUrgencySpectrum();
  }

  @Post('intake')
  async createIntake(@Body() data: Partial<EmergencyCase>) {
    return this.emergService.createRapidIntake(data);
  }

  @Patch('cases/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; bay?: string },
  ) {
    return this.emergService.updateStatus(id, body.status, body.bay);
  }
}
