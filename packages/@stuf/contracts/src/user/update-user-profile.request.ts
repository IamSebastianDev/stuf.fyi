import * as v from 'valibot';
import type { UpdateUserProfileRequestSchema } from './update-user-profile.request.schema';

/** Validated values to apply to the authenticated user's default profile. */
export type UpdateUserProfileRequestDto = v.InferOutput<typeof UpdateUserProfileRequestSchema>;
