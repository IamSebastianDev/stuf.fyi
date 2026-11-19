import * as v from 'valibot';
import type { CreateListResponseSchema } from './create-list.response.schema';

/** Serialized result of creating a list and its first membership. */
export type CreateListResponseDto = v.InferOutput<typeof CreateListResponseSchema>;
