import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public metadata for a passkey registered by the current user. */
export const PasskeyResponseSchema = v.object({
    /** Public identifier for the registered passkey record. */
    id: IdSchema,
    /** User-defined passkey label, when one has been assigned. */
    name: v.nullable(v.string()),
    /** Authenticator device category reported by WebAuthn. */
    deviceType: v.nullable(v.string()),
    /** Whether the authenticator reports that the credential is backed up. */
    backedUp: v.boolean(),
    /** Last successful authentication time, when the passkey has been used. */
    lastUsedAt: v.nullable(DateSchema),
    /** Time at which the passkey was registered. */
    createdAt: DateSchema,
});
