import * as v from 'valibot';
import type { SessionResponseSchema } from './session.response.schema';

/** Session metadata safe to return to clients. */
export type SessionResponse = v.InferOutput<typeof SessionResponseSchema>;
