import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { parse } from 'url';

interface AuthenticatedSocket extends WebSocket {
    userId?: string;
    isAlive?: boolean;
}

interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp?: string;
}

// Event types that match frontend
export const WS_EVENTS = {
    ORDER_CREATED: 'order:created',
    ORDER_UPDATED: 'order:updated',
    ORDER_SHIPPED: 'order:shipped',
    ORDER_DELIVERED: 'order:delivered',
    PAYMENT_SUCCESS: 'payment:success',
    PAYMENT_FAILED: 'payment:failed',
    PAYMENT_PENDING: 'payment:pending',
    NOTIFICATION_NEW: 'notification:new',
    CHAT_MESSAGE: 'chat:message',
    CHAT_TYPING: 'chat:typing',
    PRODUCT_SOLD: 'product:sold',
    REVIEW_ADDED: 'review:added',
    PAYOUT_PROCESSED: 'payout:processed',
};

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(NotificationsGateway.name);
    private clients: Map<string, Set<AuthenticatedSocket>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway initialized');

        // Start heartbeat to detect dead connections
        this.heartbeatInterval = setInterval(() => {
            this.server.clients.forEach((ws: AuthenticatedSocket) => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    async handleConnection(client: AuthenticatedSocket, req: IncomingMessage) {
        try {
            // Extract token from query string
            const { query } = parse(req.url || '', true);
            const token = query.token as string;

            if (!token) {
                this.logger.warn('Connection rejected: No token provided');
                client.close(4001, 'Authentication required');
                return;
            }

            // Verify JWT token
            const secret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, secret) as { sub: string; email?: string };

            if (!decoded.sub) {
                this.logger.warn('Connection rejected: Invalid token');
                client.close(4002, 'Invalid token');
                return;
            }

            // Attach user info to socket
            client.userId = decoded.sub;
            client.isAlive = true;

            // Add to user's client set
            if (!this.clients.has(client.userId)) {
                this.clients.set(client.userId, new Set());
            }
            this.clients.get(client.userId)!.add(client);

            // Handle pong for heartbeat
            client.on('pong', () => {
                client.isAlive = true;
            });

            this.logger.log(`Client connected: userId=${client.userId}`);

            // Send welcome message
            this.sendToClient(client, 'connection:success', {
                message: 'Connected to SOKONOVA real-time notifications',
                userId: client.userId,
            });
        } catch (error) {
            this.logger.error('Connection error:', error);
            client.close(4003, 'Authentication failed');
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        if (client.userId) {
            this.clients.get(client.userId)?.delete(client);
            if (this.clients.get(client.userId)?.size === 0) {
                this.clients.delete(client.userId);
            }
            this.logger.log(`Client disconnected: userId=${client.userId}`);
        }
    }

    /**
     * Send a message to a specific client
     */
    private sendToClient(client: AuthenticatedSocket, type: string, payload: any) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type,
                payload,
                timestamp: new Date().toISOString(),
            }));
        }
    }

    /**
     * Send a message to all clients of a specific user
     */
    sendToUser(userId: string, type: string, payload: any) {
        const userClients = this.clients.get(userId);
        if (userClients) {
            userClients.forEach(client => {
                this.sendToClient(client, type, payload);
            });
            this.logger.debug(`Sent ${type} to user ${userId} (${userClients.size} clients)`);
        }
    }

    /**
     * Broadcast to all connected clients
     */
    broadcast(type: string, payload: any) {
        this.server.clients.forEach((client: AuthenticatedSocket) => {
            this.sendToClient(client, type, payload);
        });
    }

    /**
     * Handle incoming messages from clients
     */
    @SubscribeMessage('message')
    handleMessage(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: WebSocketMessage,
    ) {
        this.logger.debug(`Received message from ${client.userId}: ${data.type}`);

        // Handle specific message types
        switch (data.type) {
            case 'ping':
                this.sendToClient(client, 'pong', { timestamp: Date.now() });
                break;
            default:
                // Echo back for debugging
                this.sendToClient(client, 'ack', { received: data.type });
        }
    }

    // ==================== Notification Methods ====================

    /**
     * Notify user of new order
     */
    notifyOrderCreated(userId: string, order: any) {
        this.sendToUser(userId, WS_EVENTS.ORDER_CREATED, order);
    }

    /**
     * Notify user of order update
     */
    notifyOrderUpdated(userId: string, order: any) {
        this.sendToUser(userId, WS_EVENTS.ORDER_UPDATED, order);
    }

    /**
     * Notify user of payment success
     */
    notifyPaymentSuccess(userId: string, payment: any) {
        this.sendToUser(userId, WS_EVENTS.PAYMENT_SUCCESS, payment);
    }

    /**
     * Notify user of payment failure
     */
    notifyPaymentFailed(userId: string, payment: any) {
        this.sendToUser(userId, WS_EVENTS.PAYMENT_FAILED, payment);
    }

    /**
     * Notify user of new notification
     */
    notifyNew(userId: string, notification: any) {
        this.sendToUser(userId, WS_EVENTS.NOTIFICATION_NEW, notification);
    }

    /**
     * Notify seller of product sold
     */
    notifyProductSold(sellerId: string, product: any) {
        this.sendToUser(sellerId, WS_EVENTS.PRODUCT_SOLD, product);
    }

    /**
     * Notify user of new review
     */
    notifyReviewAdded(userId: string, review: any) {
        this.sendToUser(userId, WS_EVENTS.REVIEW_ADDED, review);
    }

    /**
     * Notify seller of payout processed
     */
    notifyPayoutProcessed(sellerId: string, payout: any) {
        this.sendToUser(sellerId, WS_EVENTS.PAYOUT_PROCESSED, payout);
    }

    /**
     * Send chat message
     */
    sendChatMessage(recipientId: string, message: any) {
        this.sendToUser(recipientId, WS_EVENTS.CHAT_MESSAGE, message);
    }

    /**
     * Send typing indicator
     */
    sendTypingIndicator(recipientId: string, data: { senderId: string; isTyping: boolean }) {
        this.sendToUser(recipientId, WS_EVENTS.CHAT_TYPING, data);
    }
}
