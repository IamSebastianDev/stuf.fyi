import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './core/prisma/prisma-exception-filter';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './features/health/health.module';

@Module({
    imports: [HealthModule, PrismaModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: PrismaExceptionFilter,
        },
    ],
})
export class AppModule {}
