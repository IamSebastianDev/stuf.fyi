import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public representation of an application user. */
export const UserResponseSchema = v.object({
    /** Public user identifier. */
    id: IdSchema,
    /** Time at which the user record was created. */
    createdAt: DateSchema,
    /** Time at which the user record was last changed. */
    updatedAt: DateSchema,
});
