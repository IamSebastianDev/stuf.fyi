import * as v from 'valibot';
import type { HealthResponseSchema } from './health.response.schema';

/** Serialized health status returned by the API. */
export type HealthResponseDto = v.InferOutput<typeof HealthResponseSchema>;
