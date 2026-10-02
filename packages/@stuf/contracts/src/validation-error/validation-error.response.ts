import * as v from 'valibot';
import type { ValidationErrorResponseSchema } from './validation-error.response.schema';

export type ValidationErrorResponse = v.InferOutput<typeof ValidationErrorResponseSchema>;
