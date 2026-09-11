import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../../entities';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly apptService: AppointmentService) {}

  @Get()
  async findAll() {
    return this.apptService.findAll();
  }

  @Get('queue')
  async getQueue() {
    return this.apptService.getQueue();
  }

  @Post('ticket')
  async createTicket(@Body() data: Partial<Appointment>) {
    return this.apptService.createTicket(data);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.apptService.updateStatus(id, status);
  }
}
