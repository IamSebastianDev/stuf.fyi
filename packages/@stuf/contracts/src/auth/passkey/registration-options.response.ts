import * as v from 'valibot';
import type { RegistrationOptionsResponseSchema } from './registration-options.response.schema';

/** Validated WebAuthn registration options DTO. */
export type RegistrationOptionsResponseDto = v.InferOutput<typeof RegistrationOptionsResponseSchema>;
