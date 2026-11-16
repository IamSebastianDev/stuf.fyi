import { DateSchema } from '#/shared/date.schema';
import * as v from 'valibot';

/** Public session metadata; bearer tokens and hashes are never exposed. */
export const SessionResponseSchema = v.object({
    createdAt: DateSchema,
    expiresAt: DateSchema,
    lastUsedAt: v.nullable(DateSchema),
});
