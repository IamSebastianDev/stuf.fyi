import type { HttpErrorResponse } from '@stuf/contracts/http-error';
import { type BaseIssue } from 'valibot';

export class ApiError extends Error {
    readonly statusCode: number;
    readonly errorCode: string | undefined;

    constructor({ statusCode, errorCode, message }: HttpErrorResponse) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

export class ResponseValidationError extends Error {
    readonly issues: readonly BaseIssue<unknown>[];
    constructor(issues: readonly BaseIssue<unknown>[]) {
        super('Response validation failed');
        this.issues = issues;
    }

    // We can later add an additional return transformation
    // into a useful string representation @todo
    get reason() {
        return this.issues;
    }
}
