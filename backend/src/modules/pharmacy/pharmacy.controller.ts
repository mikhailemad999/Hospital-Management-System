import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { MedicationBatch } from '../../entities';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('medications')
  async getMedications() {
    return this.pharmacyService.getMedications();
  }

  @Get('batches')
  async getBatches(@Query('medicationId') medicationId?: string) {
    return this.pharmacyService.getBatches(medicationId);
  }

  @Get('alerts')
  async getAlerts() {
    return this.pharmacyService.getAlerts();
  }

  @Post('dispense')
  async dispenseFEFO(
    @Body() body: { medicationId: string; quantity: number; patientName: string; mrn: string; performedBy: string },
  ) {
    return this.pharmacyService.dispenseFEFO(body.medicationId, body.quantity, body.patientName, body.mrn, body.performedBy);
  }

  @Post('receive')
  async receiveStock(@Body() data: Partial<MedicationBatch>) {
    return this.pharmacyService.receiveStock(data);
  }

  @Get('movements')
  async getMovements() {
    return this.pharmacyService.getMovements();
  }
}
