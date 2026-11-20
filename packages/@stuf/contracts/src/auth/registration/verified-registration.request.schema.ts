import * as v from 'valibot';

/** Presents the one-time email proof when starting passkey registration. */
export const VerifiedRegistrationRequestSchema = v.object({
    token: v.pipe(v.string(), v.regex(/^[A-Za-z0-9_-]{43}$/)),
});
