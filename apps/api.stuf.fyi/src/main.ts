import {
    BadRequestException,
    StandardSchemaSerializerInterceptor,
    StandardSchemaValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { createAppAdapter } from './app.adapter';
import { AppModule } from './app.module';
import { PinoConfig } from './core/logging/pino.config';

async function bootstrap() {
    const config = new ConfigService();
    const pinoConfig = new PinoConfig(config);
    const adapter = createAppAdapter(pinoConfig);
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { bufferLogs: true });
    app.useLogger(app.get(Logger));
    app.useWebSocketAdapter(new IoAdapter(app));

    app.enableShutdownHooks();

    // We set up API versioning from the beginning.
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // Register global stuff
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(
        new LoggerErrorInterceptor(),
        new StandardSchemaSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(
        new StandardSchemaValidationPipe({
            exceptionFactory: (issues) => {
                return new BadRequestException({
                    errorCode: 'VALIDATION_FAILED',
                    message: 'Request validation failed',
                    errors: issues.map(({ message, path }) => ({
                        message,
                        path: path
                            ?.map((segment) => {
                                return String(typeof segment === 'object' ? segment.key : segment);
                            })
                            .join('->'),
                    })),
                });
            },
        }),
    );

    // Set up the application bootstrap
    const host = config.get<string>('API_HOST', 'localhost');
    const port = Number(config.get<string>('API_PORT', '5172'));
    await app.listen(port, host);
}
await bootstrap();
