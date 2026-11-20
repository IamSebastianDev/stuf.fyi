import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';
import { ProfileColorSchema } from './profile-color.schema';

/** Public representation of an application user. */
export const UserResponseSchema = v.object({
    /** Public user identifier. */
    id: IdSchema,
    /** Account-wide display name, or null when the user has not set one. */
    displayName: v.nullable(v.string()),
    /** Default avatar color for the account. */
    profileColor: ProfileColorSchema,
    /** Time at which the user record was created. */
    createdAt: DateSchema,
    /** Time at which the user record was last changed. */
    updatedAt: DateSchema,
});
