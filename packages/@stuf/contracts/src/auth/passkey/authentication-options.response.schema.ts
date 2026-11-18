import * as v from 'valibot';

const CredentialDescriptorSchema = v.object({
    id: v.string(),
    type: v.literal('public-key'),
    transports: v.optional(v.array(v.string())),
});

/** WebAuthn authentication options returned by the API. */
export const AuthenticationOptionsResponseSchema = v.object({
    challenge: v.string(),
    timeout: v.optional(v.number()),
    rpId: v.optional(v.string()),
    allowCredentials: v.optional(v.array(CredentialDescriptorSchema)),
    userVerification: v.optional(v.string()),
    extensions: v.optional(v.record(v.string(), v.unknown())),
    hints: v.optional(v.array(v.string())),
});
