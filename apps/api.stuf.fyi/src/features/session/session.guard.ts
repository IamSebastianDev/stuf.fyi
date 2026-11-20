import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { SessionService } from './session.service';
import type { AuthenticatedRequest } from './types/authenticated-request.type';

/** Authenticates the cookie and attaches the user ID to a protected HTTP request. */
@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private readonly sessions: SessionService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        request.userId = await this.sessions.requireUserId(request);
        return true;
    }
}
