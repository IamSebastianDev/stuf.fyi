import type { Prisma } from '@stuf/prisma';

/** Fields needed to authenticate a request and record session use. */
export const sessionIdentitySelect = {
    id: true,
    userId: true,
    expiresAt: true,
    revokedAt: true,
    user: { select: { disabledAt: true } },
} satisfies Prisma.SessionSelect;

/** Session and account state needed to verify a cookie session. */
export type SessionIdentity = Prisma.SessionGetPayload<{ select: typeof sessionIdentitySelect }>;
