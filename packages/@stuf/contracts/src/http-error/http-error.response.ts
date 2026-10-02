import * as v from 'valibot';
import type { HttpErrorResponseSchema } from './http-error.response.schema';

export type HttpErrorResponse = v.InferOutput<typeof HttpErrorResponseSchema>;
