import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { Operation, OperationConsumable } from '../../entities';

@Controller('operations')
export class OperationsController {
  constructor(private readonly opService: OperationsService) {}

  @Get('schedules')
  async getSchedules() {
    return this.opService.getSchedules();
  }

  @Post('schedules')
  async createOperation(@Body() data: Partial<Operation>) {
    return this.opService.createOperation(data);
  }

  @Patch('schedules/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; duration?: string },
  ) {
    return this.opService.updateStatus(id, body.status, body.duration);
  }

  @Get(':id/consumables')
  async getConsumables(@Param('id') id: string) {
    return this.opService.getConsumables(id);
  }

  @Post('consumables')
  async logConsumable(@Body() data: Partial<OperationConsumable>) {
    return this.opService.logConsumable(data);
  }
}
