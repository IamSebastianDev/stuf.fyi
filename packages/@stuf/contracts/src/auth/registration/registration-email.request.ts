import type * as v from 'valibot';
import type { RegistrationEmailRequestSchema } from './registration-email.request.schema';

/** Validated and normalized signup email. */
export type RegistrationEmailRequestDto = v.InferOutput<typeof RegistrationEmailRequestSchema>;
