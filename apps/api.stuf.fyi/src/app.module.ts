import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { PrismaExceptionFilter } from './core/prisma/prisma-exception-filter';
import { ConfigModule } from './core/config/config.module';
import { loggingProvider } from './core/logging/logging.provider';
import { PrismaModule } from './core/prisma/prisma.module';
import { SocketModule } from './core/socket/socket.module';
import { AuthModule } from './features/auth/auth.module';
import { HealthModule } from './features/health/health.module';

@Module({
    imports: [
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            ...loggingProvider,
        }),
        ConfigModule,
        HealthModule,
        AuthModule,
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
