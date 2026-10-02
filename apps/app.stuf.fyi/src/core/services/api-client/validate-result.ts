import { safeParse, type BaseIssue, type BaseSchema } from 'valibot';
import type { ResolveCallback } from './client';
import { ApiError, ResponseValidationError } from './errors';

export const validateResult = <TInput, TOutput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>>(
    schema: BaseSchema<TInput, TOutput, TIssue>,
): ResolveCallback<TOutput> => {
    return ({ response }) => {
        if (!response.ok) {
            throw new ApiError(response.data);
        }

        const parsed = safeParse(schema, response.data);

        if (!parsed.success) {
            throw new ResponseValidationError(parsed.issues);
        }

        return parsed.output;
    };
};
