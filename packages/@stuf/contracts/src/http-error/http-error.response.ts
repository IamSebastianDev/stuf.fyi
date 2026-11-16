import * as v from 'valibot';
import type { HttpErrorResponseSchema } from './http-error.response.schema';

/** Standard error payload returned by an HTTP endpoint. */
export type HttpErrorResponse = v.InferOutput<typeof HttpErrorResponseSchema>;
