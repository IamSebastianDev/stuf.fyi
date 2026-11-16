import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { PrismaExceptionFilter } from './core/prisma/prisma-exception-filter';
import { pinoOptions } from './core/logging/pino-options';
import { PrismaModule } from './core/prisma/prisma.module';
import { SocketModule } from './core/socket/socket.module';
import { HealthModule } from './features/health/health.module';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                ...pinoOptions,
                autoLogging: false,
            },
        }),
        HealthModule,
        PrismaModule,
        SocketModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: PrismaExceptionFilter,
        },
    ],
})
export class AppModule {}
