import { derived, grain, readonly } from '@grainular/grains';
import { io } from 'socket.io-client';
import { safeParse, type BaseIssue, type BaseSchema, type InferOutput } from 'valibot';
import { SocketValidationError } from './errors';

type SocketOptions = { path: string };
type ChannelConfig = [string, BaseSchema<unknown, unknown, BaseIssue<unknown>>];
type ChannelInit<R extends ChannelConfig, D extends ChannelConfig> = {
    receive: R;
    dispatch: D;
};

export const createWebsocketClient = ({ path }: SocketOptions) => {
    const socket = io(window.location.origin, { path });

    const createChannel = <R extends ChannelConfig, D extends ChannelConfig>(config: ChannelInit<R, D>) => {
        // @todo -> SocketError
        const error = grain<null | SocketValidationError>(null);
        const history = grain<InferOutput<R[1]>[]>([]);
        const data = derived(history, (entries) => entries.at(-1));

        const listener = (data: InferOutput<R[1]>) => {
            const result = safeParse(config.receive[1], data);

            if (!result.success) {
                error.set(new SocketValidationError(result.issues));
                return;
            }

            history.update((current) => [...current, result.output]);
        };

        socket.on(config.receive[0], listener);
        const close = () => {
            socket.off(config.receive[0], listener);
        };

        const send = (payload: InferOutput<D[1]>) => {
            socket.emit(config.dispatch[0], payload);
        };

        return {
            send,
            close,
            data,
            error: readonly(error),
            history: readonly(history),
        };
    };

    return {
        $socket: socket,
        createChannel,
    };
};
