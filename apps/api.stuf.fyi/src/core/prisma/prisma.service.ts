import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { prisma } from '@stuf/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    readonly client = prisma;
    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
