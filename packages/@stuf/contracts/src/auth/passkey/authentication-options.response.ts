import * as v from 'valibot';
import type { AuthenticationOptionsResponseSchema } from './authentication-options.response.schema';

/** Validated WebAuthn authentication options DTO. */
export type AuthenticationOptionsResponseDto = v.InferOutput<typeof AuthenticationOptionsResponseSchema>;
