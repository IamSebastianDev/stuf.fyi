import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { HealthResponseSchema } from '@stuf/contracts/health';
import { HealthService } from './health.service';

@Controller({ version: '1', path: '/health' })
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get()
    @SerializeOptions({
        schema: HealthResponseSchema,
    })
    async getHealth() {
        return this.healthService.getHealth();
    }
}
