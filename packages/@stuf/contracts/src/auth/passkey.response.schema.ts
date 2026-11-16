import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public metadata for a passkey registered by the current user. */
export const PasskeyResponseSchema = v.object({
    id: IdSchema,
    name: v.nullable(v.string()),
    deviceType: v.nullable(v.string()),
    backedUp: v.boolean(),
    lastUsedAt: v.nullable(DateSchema),
    createdAt: DateSchema,
});
