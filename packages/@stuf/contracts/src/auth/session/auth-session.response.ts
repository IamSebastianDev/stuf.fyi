import * as v from 'valibot';
import type { AuthSessionResponseSchema } from './auth-session.response.schema';

/** Authenticated user, session metadata, and registered passkeys. */
export type AuthSessionResponseDto = v.InferOutput<typeof AuthSessionResponseSchema>;
