import { dateSchema } from '#/shared/date.schema';
import * as v from 'valibot';

export const HealthResponseSchema = v.object({
    api: v.boolean(),
    database: v.boolean(),
    timestamp: dateSchema,
});
