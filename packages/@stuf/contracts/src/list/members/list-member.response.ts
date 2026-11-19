import * as v from 'valibot';
import type { ListMemberResponseSchema } from './list-member.response.schema';

/** Serialized metadata joining a user to a shared list. */
export type ListMemberResponseDto = v.InferOutput<typeof ListMemberResponseSchema>;
