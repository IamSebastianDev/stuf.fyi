import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './types/authenticated-request.type';

/** Injects the user ID established by SessionGuard. */
export const SessionUserId = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest<AuthenticatedRequest>().userId,
);
