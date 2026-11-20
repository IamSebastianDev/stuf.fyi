import * as v from 'valibot';
import { EmailSchema } from '../../user/email.schema';

/** Requests a verification link at the address used for account creation. */
export const RegistrationEmailRequestSchema = v.object({
    email: EmailSchema,
});
