import { createUrl, extractFromResponse, type ResponseShape } from './helpers';

type ClientOptions = { baseUrl: string };
export const createApiClient = ({ baseUrl }: ClientOptions) => {
    return {
        query: async <R>(resourceGenerator: ResourceGenerator, parseResult: ResultGenerator<R>) => {
            const { url, options } = resourceGenerator({ baseUrl });

            const response = await fetch(url, options);

            // normalize the response into a usable object
            const result = await extractFromResponse(response);
            return await parseResult(result);
        },
    };
};

// -- Resource

export type QueryParams = Record<string, undefined | string | string[]>;
export type RequestOptions = RequestInit & {
    authenticated?: boolean;
    params?: QueryParams;
    json?: unknown;
};
export type ResourceDefinition = {
    url: URL;
    options: RequestInit;
};
export function requestConfig(path: `/${string}`, options: RequestOptions = {}) {
    return (clientOptions: ClientOptions): ResourceDefinition => {
        const { authenticated, params, json, ...requestInit } = options;
        return {
            url: createUrl(path, clientOptions.baseUrl, params ?? {}),
            options: {
                method: 'GET',
                headers: {
                    ...(json ? { 'Content-Type': 'application/json' } : {}),
                    ...requestInit.headers,
                },
                ...(json ? { body: JSON.stringify(json) } : {}),
                ...(authenticated ? { credentials: 'include' } : {}),
                ...requestInit,
            },
        };
    };
}

export type ResourceGenerator = ReturnType<typeof requestConfig>;

// -- Result

export type ResolveCallback<R> = (input: { response: ResponseShape }) => R | Promise<R>;
export function resolveResponse<R>(callback: ResolveCallback<R>) {
    return (response: ResponseShape) => {
        return callback({ response });
    };
}

export type ResultGenerator<R> = ReturnType<typeof resolveResponse<R>>;
