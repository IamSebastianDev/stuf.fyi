import { DateSchema } from '#/shared/date.schema';
import * as v from 'valibot';

/** Public session metadata; bearer tokens and hashes are never exposed. */
export const SessionResponseSchema = v.object({
    /** Time at which the session was created. */
    createdAt: DateSchema,
    /** Time at which the session expires. */
    expiresAt: DateSchema,
    /** Last time the session was used, when available. */
    lastUsedAt: v.nullable(DateSchema),
});
