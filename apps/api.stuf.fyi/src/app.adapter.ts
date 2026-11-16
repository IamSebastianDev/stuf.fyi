import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { randomUUIDv7 } from 'node:crypto';
import { PinoConfig } from './core/logging/pino.config';

export const createAppAdapter = (pinoConfig: PinoConfig) => {
    const adapter = new FastifyAdapter({
        genReqId: () => randomUUIDv7(),
        logger: pinoConfig.pino,
    });

    // @fastify/cookie's published generic defaults are narrower than Nest's adapter type.
    adapter.register(fastifyCookie as unknown as Parameters<typeof adapter.register>[0]);

    adapter.getInstance().addHook('onSend', async (request, reply) => {
        reply.header('x-request-id', request.id);
    });

    return adapter;
};
