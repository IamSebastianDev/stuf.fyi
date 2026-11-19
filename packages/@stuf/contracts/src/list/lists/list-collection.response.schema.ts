import * as v from 'valibot';
import { ListResponseSchema } from './list.response.schema';

/** Lists available to the authenticated user. */
export const ListCollectionResponseSchema = v.object({
    /** Lists where the user is a member. Empty when the user has no memberships. */
    lists: v.array(ListResponseSchema),
});
