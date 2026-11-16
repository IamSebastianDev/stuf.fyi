import { ConfigService } from '@nestjs/config';

export class PinoConfig {
    constructor(private readonly config: ConfigService) {}

    get pino() {
        return {
            name: 'stuf-api',
            level: this.config.get('LOG_LEVEL', 'info'),
            ...(this.config.get('NODE_ENV', 'development') === 'development'
                ? {
                      transport: {
                          target: 'pino-pretty',
                          options: {
                              colorize: true,
                              singleLine: true,
                              translateTime: 'SYS:standard',
                          },
                      },
                  }
                : {}),
        } as const;
    }
}
