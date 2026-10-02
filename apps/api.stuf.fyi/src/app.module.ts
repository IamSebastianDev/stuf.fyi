import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './features/health/health.module';

@Module({
    imports: [HealthModule, PrismaModule],
})
export class AppModule {}
