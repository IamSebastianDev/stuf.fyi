import * as v from 'valibot';
import type { UserResponseSchema } from './user.response.schema';

/** Public user data safe to expose to clients. */
export type UserResponse = v.InferOutput<typeof UserResponseSchema>;
