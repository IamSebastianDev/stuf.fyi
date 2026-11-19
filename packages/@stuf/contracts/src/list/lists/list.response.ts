import * as v from 'valibot';
import type { ListResponseSchema } from './list.response.schema';

/** Serialized list metadata returned to its members. */
export type ListResponseDto = v.InferOutput<typeof ListResponseSchema>;
