import * as v from 'valibot';
import { ListMemberResponseSchema } from '../members/list-member.response.schema';
import { ListResponseSchema } from './list.response.schema';

/** Response returned after a list and its owner membership are created. */
export const CreateListResponseSchema = v.object({
    /** Newly created list. */
    list: ListResponseSchema,
    /** Membership granting the creator access to the new list. */
    membership: ListMemberResponseSchema,
});
