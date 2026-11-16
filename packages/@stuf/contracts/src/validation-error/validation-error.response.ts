import * as v from 'valibot';
import type { ValidationErrorResponseSchema } from './validation-error.response.schema';

/** Validation failure payload returned by an HTTP endpoint. */
export type ValidationErrorResponse = v.InferOutput<typeof ValidationErrorResponseSchema>;
