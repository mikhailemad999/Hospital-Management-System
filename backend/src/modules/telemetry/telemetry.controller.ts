import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('command-center')
  async getCommandCenterTelemetry() {
    return this.telemetryService.getExecutiveTelemetry();
  }
}
