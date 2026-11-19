import { combined, derived } from '@grainular/grains';
import { resource } from '@grainular/resource';
import {
    CreateListRequestSchema,
    CreateListResponseSchema,
    ListCollectionResponseSchema,
    type CreateListResponseDto,
    type ListResponseDto,
} from '@stuf/contracts/list';
import { parse, type InferInput } from 'valibot';
import { client, requestConfig, resolveResponse, validateResult } from '../../../core/services/api-client';
import { sessionStore } from '../../auth/stores/session.store';

const userId = derived(sessionStore.state.authenticatedUser, (user) => user?.id);
const emptyLists: readonly ListResponseDto[] = [];

/** Loads the current user's list memberships and cancels stale reads on session changes. */
const collection = resource(
    async ({ abortSignal }) => {
        const currentUserId = userId();
        if (!currentUserId) return null;

        const { lists } = await client.query(
            requestConfig('/lists', { authenticated: true, signal: abortSignal }),
            resolveResponse(validateResult(ListCollectionResponseSchema)),
        );

        return { userId: currentUserId, lists };
    },
    [userId],
);

/** Keeps the previous account's lists out of the state while a new session loads. */
const lists = derived(combined([userId, collection.data]), ([currentUserId, result]): readonly ListResponseDto[] =>
    result && result.userId === currentUserId ? result.lists : emptyLists,
);

/** Creates a list and refreshes the collection after the API confirms it. */
const createList = async (input: InferInput<typeof CreateListRequestSchema>): Promise<CreateListResponseDto> => {
    const result = await client.query(
        requestConfig('/lists', {
            method: 'POST',
            authenticated: true,
            json: parse(CreateListRequestSchema, input),
        }),
        resolveResponse(validateResult(CreateListResponseSchema)),
    );

    collection.refresh();
    return result;
};

export const listStore = {
    state: {
        lists,
        status: collection.state,
        pending: collection.pending,
        error: collection.error,
    },
    actions: {
        createList,
        refresh: collection.refresh,
    },
};
