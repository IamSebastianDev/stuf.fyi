import * as v from 'valibot';
import type { ListCollectionResponseSchema } from './list-collection.response.schema';

/** Serialized collection of lists available to the authenticated user. */
export type ListCollectionResponseDto = v.InferOutput<typeof ListCollectionResponseSchema>;
