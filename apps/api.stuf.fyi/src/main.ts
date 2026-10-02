import {
    BadRequestException,
    StandardSchemaSerializerInterceptor,
    StandardSchemaValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.enableShutdownHooks();

    // We set up API versioning from the beginning.
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // Register global stuff
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new StandardSchemaSerializerInterceptor(app.get(Reflector)));
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
    const host = process.env.API_HOST ?? 'localhost';
    const port = process.env.API_PORT ?? '5172';

    await app.listen(Number(port), host);
}
await bootstrap();
