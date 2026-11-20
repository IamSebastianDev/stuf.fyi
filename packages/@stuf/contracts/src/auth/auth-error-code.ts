/** Error codes returned by the auth API. Shared by server and browser consumers. */
export const AuthErrorCode = {
    AuthenticationRequired: 'AUTHENTICATION_REQUIRED',
    RegistrationEmailAlreadyUsed: 'REGISTRATION_EMAIL_ALREADY_USED',
    RegistrationEmailLinkInvalid: 'REGISTRATION_EMAIL_LINK_INVALID',
    RegistrationEmailUnavailable: 'REGISTRATION_EMAIL_UNAVAILABLE',
    PasskeyAlreadyRegistered: 'PASSKEY_ALREADY_REGISTERED',
    PasskeyNotFound: 'PASSKEY_NOT_FOUND',
    WebAuthnChallengeInvalid: 'WEBAUTHN_CHALLENGE_INVALID',
    WebAuthnChallengeMissing: 'WEBAUTHN_CHALLENGE_MISSING',
    WebAuthnVerificationFailed: 'WEBAUTHN_VERIFICATION_FAILED',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
