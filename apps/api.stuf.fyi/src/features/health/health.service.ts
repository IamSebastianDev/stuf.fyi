import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class HealthService {
    constructor(private readonly prismaService: PrismaService) {}

    async getHealth() {
        return {
            timestamp: new Date(),
            database: await this.prismaService.client.$healthy().catch(() => false),
            api: true,
        };
    }
}
