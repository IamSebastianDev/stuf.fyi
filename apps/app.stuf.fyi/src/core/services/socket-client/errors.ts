import type { BaseIssue } from 'valibot';

export class SocketValidationError extends Error {
    readonly issues: readonly BaseIssue<unknown>[];
    constructor(issues: readonly BaseIssue<unknown>[]) {
        super('Payload validation failed');
        this.issues = issues;
    }

    // We can later add an additional return transformation
    // into a useful string representation @todo
    get reason() {
        return this.issues;
    }
}
