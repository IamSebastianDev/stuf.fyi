import * as v from 'valibot';
import type { HealthResponseSchema } from './health.response.schema';

export type HealthResponse = v.InferOutput<typeof HealthResponseSchema>;
