import { ConfigService } from '@nestjs/config';
import { PinoConfig } from './pino.config';

export const loggingProvider = {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
        const pinoConfig = new PinoConfig(config);

        return {
            pinoHttp: {
                ...pinoConfig.pino,
                autoLogging: false,
            },
        };
    },
};
