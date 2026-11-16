import { DateSchema } from '#/shared/date.schema';
import * as v from 'valibot';

/** Transport schema for API and database health status. */
export const HealthResponseSchema = v.object({
    /** Whether the API process is responding. */
    api: v.boolean(),
    /** Whether the database dependency is reachable. */
    database: v.boolean(),
    /** Time at which the health result was produced. */
    timestamp: DateSchema,
});
