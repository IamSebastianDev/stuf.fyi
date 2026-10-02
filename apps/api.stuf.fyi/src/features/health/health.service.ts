import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class HealthService {
    constructor(private readonly prismaService: PrismaService) {}

    async getHealth() {
        return {
            timestamp: new Date(Date.now()).toISOString(),
            database: await this.prismaService.client.$healthy(),
            api: true,
        };
    }
}
