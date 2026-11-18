import * as v from 'valibot';

const CredentialDescriptorSchema = v.object({
    id: v.string(),
    type: v.literal('public-key'),
    transports: v.optional(v.array(v.string())),
});

/** WebAuthn registration options returned by the API. */
export const RegistrationOptionsResponseSchema = v.object({
    rp: v.object({
        name: v.string(),
        id: v.optional(v.string()),
    }),
    user: v.object({
        id: v.string(),
        name: v.string(),
        displayName: v.string(),
    }),
    challenge: v.string(),
    pubKeyCredParams: v.array(
        v.object({
            alg: v.number(),
            type: v.literal('public-key'),
        }),
    ),
    timeout: v.optional(v.number()),
    excludeCredentials: v.optional(v.array(CredentialDescriptorSchema)),
    authenticatorSelection: v.optional(v.record(v.string(), v.unknown())),
    attestation: v.optional(v.string()),
    extensions: v.optional(v.record(v.string(), v.unknown())),
    hints: v.optional(v.array(v.string())),
});
