import { resource } from '@grainular/resource';
import { HealthResponseSchema } from '@stuf/contracts/health';
import { client, requestConfig, resolveResponse, validateResult } from '../../core/services/api-client';

const health = resource(async ({ abortSignal }) => {
    return client.query(
        requestConfig('/health', { signal: abortSignal }),
        resolveResponse(validateResult(HealthResponseSchema)),
    );
});

export const healthStore = {
    state: { ...health },
};
