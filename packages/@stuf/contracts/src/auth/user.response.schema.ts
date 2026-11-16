import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public representation of an authenticated application user. */
export const UserResponseSchema = v.object({
    id: IdSchema,
    createdAt: DateSchema,
    updatedAt: DateSchema,
});
