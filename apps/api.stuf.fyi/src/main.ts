import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks();

    // We set up API versioning from the beginning.
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // Set up the application bootstrap
    const host = process.env.API_HOST ?? 'localhost';
    const port = process.env.API_PORT ?? '5172';

    await app.listen(Number(port), host);
}
await bootstrap();
