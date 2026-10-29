import * as v from 'valibot';
import { createWebsocketClient } from './client';
export const socket = createWebsocketClient({
    path: '/socket',
});

const PongSchema = v.object({
    message: v.string(),
});

export const pingPong = socket.createChannel({
    receive: ['pong', PongSchema],
    dispatch: ['ping', PongSchema],
});
