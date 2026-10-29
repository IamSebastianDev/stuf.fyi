import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    type OnGatewayInit,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

export abstract class IoGateway implements OnGatewayInit {
    private server: Server | null = null;

    afterInit(server: Server) {
        this.server = server;
    }

    protected get io() {
        if (!this.server) {
            throw new Error('Websocket Server not yet initialized');
        }

        return this.server;
    }
}

@WebSocketGateway({ path: '/socket' })
export class SocketGateway extends IoGateway {
    handleConnection(client: Socket) {
        client.emit('connected', {
            socketId: client.id,
        });
    }

    @SubscribeMessage('ping')
    handlePing(@MessageBody() body: { message: string }, @ConnectedSocket() client: Socket) {
        return {
            event: 'pong',
            data: {
                message: body.message,
                socketId: client.id,
            },
        };
    }
}
