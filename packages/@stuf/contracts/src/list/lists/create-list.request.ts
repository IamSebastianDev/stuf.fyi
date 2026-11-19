import * as v from 'valibot';
import type { CreateListRequestSchema } from './create-list.request.schema';

/** Validated list creation input with defaults applied. */
export type CreateListRequestDto = v.InferOutput<typeof CreateListRequestSchema>;
