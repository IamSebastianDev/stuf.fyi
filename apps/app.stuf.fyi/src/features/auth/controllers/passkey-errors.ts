import { ApiError } from '../../../core/services/api-client/errors';

/** Uses the API error code or the browser exception name to select feedback. */
export const authErrorKey = (cause: unknown): string => {
    if (cause instanceof ApiError) return cause.errorCode ?? '';
    return cause instanceof Error ? cause.name : '';
};

/** A canceled prompt leaves the screen available for another attempt. */
export const isPasskeyPromptCanceled = (key: string): boolean => key === 'NotAllowedError' || key === 'AbortError';
