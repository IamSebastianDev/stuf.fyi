import type * as v from 'valibot';
import type { VerifiedRegistrationRequestSchema } from './verified-registration.request.schema';

/** Validated proof submitted before requesting passkey creation options. */
export type VerifiedRegistrationRequestDto = v.InferOutput<typeof VerifiedRegistrationRequestSchema>;
