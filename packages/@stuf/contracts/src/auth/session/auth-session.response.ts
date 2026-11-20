import * as v from 'valibot';
import type { AuthSessionResponseSchema } from './auth-session.response.schema';

/** Values returned by the controller before response serialization. */
export type AuthSessionResponseInput = v.InferInput<typeof AuthSessionResponseSchema>;

/** Authenticated user and registered passkeys with serialized timestamps. */
export type AuthSessionResponseDto = v.InferOutput<typeof AuthSessionResponseSchema>;
