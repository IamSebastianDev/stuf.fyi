export const pinoOptions = {
    name: 'stuf-api',
    level: process.env.LOG_LEVEL ?? 'info',
    ...(process.env.NODE_ENV === 'development'
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
};
