import * as v from 'valibot';

/** Transport schema for errors that are not validation-specific. */
export const HttpErrorResponseSchema = v.object({
    /** HTTP status code associated with the error. */
    statusCode: v.number(),
    /** Stable machine-readable error identifier. */
    errorCode: v.optional(v.string()),
    /** Human-readable error description. */
    message: v.string(),
});
