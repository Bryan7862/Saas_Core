import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: {
        origin: '*', // Adjust validation strictly if needed
    },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(NotificationsGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            // Extract token from handshake auth or query
            const token =
                client.handshake.auth?.token || client.handshake.query?.token as string;

            if (!token) {
                this.logger.warn(`Client ${client.id} rejected: No token`);
                client.disconnect();
                return;
            }

            // Verify Token
            const secret = this.configService.get<string>('JWT_SECRET');
            const payload = this.jwtService.verify(token, { secret });

            // Join User Room
            const roomName = `user_${payload.sub}`;
            await client.join(roomName);

            this.logger.log(`Client ${client.id} joined room ${roomName}`);
        } catch (error) {
            this.logger.error(`Connection error for ${client.id}: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client ${client.id} disconnected`);
    }

    // Utility to send message to user room
    sendToUser(userId: string, payload: any) {
        this.server.to(`user_${userId}`).emit('new_notification', payload);
    }
}
