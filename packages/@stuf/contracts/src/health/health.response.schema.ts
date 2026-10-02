import { dateSchema } from '#/shared/date.schema';
import * as v from 'valibot';

export const HealthResponseSchema = v.object({
    ok: v.boolean(),
    timestamp: dateSchema,
});
