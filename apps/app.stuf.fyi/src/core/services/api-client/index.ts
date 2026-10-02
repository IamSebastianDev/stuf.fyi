import { createApiClient } from './client';

export { requestConfig, resolveResponse } from './client';
export { validateResult } from './validate-result';

export const client = createApiClient({
    baseUrl: `${window.location.origin}/api/v1`,
});
