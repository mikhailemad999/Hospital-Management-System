import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiagnosticsService } from './diagnostics.service';

@ApiTags('Diagnostics (Laboratory & Radiology PACS)')
@Controller('diagnostics')
export class DiagnosticsController {
  constructor(private readonly diagService: DiagnosticsService) {}

  // ================= LAB ENDPOINTS =================
  @Get('lab/orders')
  @ApiOperation({ summary: 'List all pathology and molecular diagnostics laboratory orders' })
  getLabOrders() {
    return this.diagService.findLabOrders();
  }

  @Post('lab/orders')
  @ApiOperation({ summary: 'Order a new diagnostic laboratory panel (STAT/Routine)' })
  createLabOrder(@Body() body: any) {
    return this.diagService.createLabOrder(body);
  }

  @Patch('lab/orders/:id/status')
  @ApiOperation({ summary: 'Update laboratory sample barcode tracking status' })
  updateLabStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.diagService.updateLabOrderStatus(id, status);
  }

  @Post('lab/orders/:id/results')
  @ApiOperation({ summary: 'Record verified laboratory analyzer analyte results' })
  addLabResult(@Param('id') id: string, @Body() body: any) {
    return this.diagService.addLabResult(id, body);
  }

  // ================= RADIOLOGY / PACS ENDPOINTS =================
  @Get('radiology/orders')
  @ApiOperation({ summary: 'List all diagnostic imaging studies and PACS worklist items' })
  getRadiologyOrders() {
    return this.diagService.findRadiologyOrders();
  }

  @Post('radiology/orders')
  @ApiOperation({ summary: 'Order diagnostic imaging study (CT, MRI, X-Ray, Ultrasound)' })
  createRadiologyOrder(@Body() body: any) {
    return this.diagService.createRadiologyOrder(body);
  }

  @Patch('radiology/orders/:id/report')
  @ApiOperation({ summary: 'Submit radiologist findings, clinical impression, and sign-off' })
  updateRadiologyReport(@Param('id') id: string, @Body() body: any) {
    return this.diagService.updateRadiologyReport(id, body);
  }
}
