ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "WebAuthnChallenge" ADD COLUMN "emailVerificationHash" TEXT;

CREATE TABLE "RegistrationEmailVerification" (
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationEmailVerification_pkey" PRIMARY KEY ("email")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "RegistrationEmailVerification_tokenHash_key" ON "RegistrationEmailVerification"("tokenHash");
CREATE INDEX "RegistrationEmailVerification_expiresAt_idx" ON "RegistrationEmailVerification"("expiresAt");
