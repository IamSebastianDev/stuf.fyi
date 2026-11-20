import type { FastifyRequest } from 'fastify';

/** HTTP request with the user ID verified by the session guard. */
export type AuthenticatedRequest = FastifyRequest & { userId: string };
