import * as v from 'valibot';

export const ValidationErrorResponseSchema = v.object({
    statusCode: v.literal(400),
    errorCode: v.literal('VALIDATION_ERROR'),
    message: v.string(),
    errors: v.array(
        v.object({
            path: v.optional(v.string()),
            message: v.string(),
        }),
    ),
});
