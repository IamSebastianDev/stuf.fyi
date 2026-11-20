import * as v from 'valibot';
import { ProfileColorSchema } from './profile-color.schema';

/** Partial update to the authenticated user's default profile. */
export const UpdateUserProfileRequestSchema = v.pipe(
    v.object({
        /** A trimmed display name. Null or a blank string clears the name. */
        displayName: v.optional(
            v.nullable(
                v.pipe(
                    v.string(),
                    v.trim(),
                    v.transform((name) => name || null),
                ),
            ),
        ),
        /** The selected avatar color from the profile palette. */
        profileColor: v.optional(ProfileColorSchema),
    }),
    v.check(
        ({ displayName, profileColor }) => displayName !== undefined || profileColor !== undefined,
        'Provide a display name or profile color.',
    ),
);
