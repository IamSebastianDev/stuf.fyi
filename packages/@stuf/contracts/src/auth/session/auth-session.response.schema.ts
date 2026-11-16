import * as v from 'valibot';
import { PasskeyResponseSchema } from '../passkey';
import { UserResponseSchema } from '../../user';
import { SessionResponseSchema } from './session.response.schema';

/** The authenticated session state returned after a passkey ceremony. */
export const AuthSessionResponseSchema = v.object({
    /** Authenticated application user. */
    user: UserResponseSchema,
    /** Public metadata for the current authenticated session. */
    session: SessionResponseSchema,
    /** Passkeys registered for the authenticated user. */
    passkeys: v.array(PasskeyResponseSchema),
});
