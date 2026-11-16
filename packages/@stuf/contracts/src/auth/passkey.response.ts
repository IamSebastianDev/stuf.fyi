import * as v from 'valibot';
import type { PasskeyResponseSchema } from './passkey.response.schema';

/** Passkey metadata safe to return to clients. */
export type PasskeyResponse = v.InferOutput<typeof PasskeyResponseSchema>;
