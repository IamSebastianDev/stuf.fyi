// -- Helpers

import { HttpErrorResponseSchema, type HttpErrorResponse } from '@stuf/contracts/http-error';
import { safeParse } from 'valibot';
import type { QueryParams } from './client';

export type ResponseShape =
    | { ok: true; data: unknown; response: Response }
    | { ok: false; data: HttpErrorResponse; response: Response };

async function extractBody(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return undefined;
    }
}
export async function extractFromResponse(response: Response): Promise<ResponseShape> {
    const data: unknown = await extractBody(response);

    // If the response is okay, we return
    // it parsed
    if (response.ok) {
        return { ok: true, response, data };
    }

    // Otherwise, we try to parse the backend response
    // to see if we have received a usable error
    const parsed = safeParse(HttpErrorResponseSchema, data);
    return {
        ok: false,
        response,
        data: parsed.success
            ? { ...parsed.output }
            : {
                  statusCode: response.status,
                  message: response.statusText || 'Request failed',
              },
    };
}

export function createUrl(path: string, baseUrl: string, params: QueryParams) {
    const url = new URL(`${baseUrl}${path}`);

    for (const [key, value] of Object.entries(params)) {
        for (const param of [value].flat()) {
            if (param !== undefined) url.searchParams.append(key, param);
        }
    }

    return url;
}
