import * as v from 'valibot';

/** Transport schema for request validation failures. */
export const ValidationErrorResponseSchema = v.object({
    /** Validation failures always use HTTP 400. */
    statusCode: v.literal(400),
    /** Stable validation error identifier. */
    errorCode: v.literal('VALIDATION_ERROR'),
    /** Human-readable validation summary. */
    message: v.string(),
    /** Individual validation issues returned to the client. */
    errors: v.array(
        v.object({
            /** Location of the invalid request value, when available. */
            path: v.optional(v.string()),
            /** Human-readable issue description. */
            message: v.string(),
        }),
    ),
});
