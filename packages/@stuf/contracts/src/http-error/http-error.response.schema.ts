import * as v from 'valibot';

export const HttpErrorResponseSchema = v.object({
    statusCode: v.number(),
    errorCode: v.optional(v.string()),
    message: v.string(),
});
