import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public representation of a user's membership in a list. */
export const ListMemberResponseSchema = v.object({
    /** Public identifier of the membership. */
    id: IdSchema,
    /** List to which the membership grants access. */
    listId: IdSchema,
    /** Public identifier of the member. */
    userId: IdSchema,
    /** Time at which the user became a member. */
    createdAt: DateSchema,
});
