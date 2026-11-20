import * as v from 'valibot';
import { PasskeyResponseSchema } from '../passkey';
import { UserResponseSchema } from '../../user';

/** User and passkeys returned after sign-in or when restoring a cookie session. */
export const AuthSessionResponseSchema = v.object({
    /** Authenticated application user. */
    user: UserResponseSchema,
    /** Passkeys registered for the authenticated user. */
    passkeys: v.array(PasskeyResponseSchema),
});
