// WebSocket Service - Real-time updates for orders, notifications, and chat

const WS_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) || 'ws://localhost:4001';

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;

interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp?: string;
}

class WebSocketService {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
    private connectionHandlers: Set<ConnectionHandler> = new Set();
    private disconnectionHandlers: Set<ConnectionHandler> = new Set();
    private isConnecting = false;
    private token: string | null = null;

    /**
     * Initialize WebSocket connection with JWT token
     */
    connect(token: string): void {
        if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.token = token;
        this.isConnecting = true;

        try {
            this.socket = new WebSocket(`${WS_URL}?token=${token}`);

            this.socket.onopen = () => {
                console.log('[WebSocket] Connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.connectionHandlers.forEach(handler => handler());
            };

            this.socket.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (err) {
                    console.error('[WebSocket] Failed to parse message:', err);
                }
            };

            this.socket.onclose = (event) => {
                console.log('[WebSocket] Disconnected:', event.code, event.reason);
                this.isConnecting = false;
                this.disconnectionHandlers.forEach(handler => handler());
                this.attemptReconnect();
            };

            this.socket.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                this.isConnecting = false;
            };
        } catch (err) {
            console.error('[WebSocket] Failed to connect:', err);
            this.isConnecting = false;
        }
    }

    /**
     * Disconnect WebSocket
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.close(1000, 'Client disconnect');
            this.socket = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }

    /**
     * Attempt to reconnect with exponential backoff
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.token) {
            console.log('[WebSocket] Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            if (this.token) {
                this.connect(this.token);
            }
        }, delay);
    }

    /**
     * Handle incoming WebSocket message
     */
    private handleMessage(message: WebSocketMessage): void {
        const handlers = this.messageHandlers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => handler(message.payload));
        }

        // Also notify 'all' handlers
        const allHandlers = this.messageHandlers.get('*');
        if (allHandlers) {
            allHandlers.forEach(handler => handler(message));
        }
    }

    /**
     * Subscribe to a specific message type
     */
    subscribe(type: string, handler: MessageHandler): () => void {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, new Set());
        }
        this.messageHandlers.get(type)!.add(handler);

        // Return unsubscribe function
        return () => {
            this.messageHandlers.get(type)?.delete(handler);
        };
    }

    /**
     * Subscribe to connection events
     */
    onConnect(handler: ConnectionHandler): () => void {
        this.connectionHandlers.add(handler);
        return () => this.connectionHandlers.delete(handler);
    }

    /**
     * Subscribe to disconnection events
     */
    onDisconnect(handler: ConnectionHandler): () => void {
        this.disconnectionHandlers.add(handler);
        return () => this.disconnectionHandlers.delete(handler);
    }

    /**
     * Send a message through WebSocket
     */
    send(type: string, payload: any): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload, timestamp: new Date().toISOString() }));
        } else {
            console.warn('[WebSocket] Cannot send - not connected');
        }
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }
}

// Singleton instance
export const websocketService = new WebSocketService();

// React hook for WebSocket subscriptions
export function useWebSocket(type: string, handler: MessageHandler) {
    // This hook should be used in React components
    // Import { useEffect } from 'react' when using
    // useEffect(() => {
    //   const unsubscribe = websocketService.subscribe(type, handler);
    //   return unsubscribe;
    // }, [type, handler]);
}

// Predefined message types
export const WS_EVENTS = {
    // Order events
    ORDER_CREATED: 'order:created',
    ORDER_UPDATED: 'order:updated',
    ORDER_SHIPPED: 'order:shipped',
    ORDER_DELIVERED: 'order:delivered',

    // Payment events
    PAYMENT_SUCCESS: 'payment:success',
    PAYMENT_FAILED: 'payment:failed',
    PAYMENT_PENDING: 'payment:pending',

    // Notification events
    NOTIFICATION_NEW: 'notification:new',

    // Chat events
    CHAT_MESSAGE: 'chat:message',
    CHAT_TYPING: 'chat:typing',

    // Seller events
    PRODUCT_SOLD: 'product:sold',
    REVIEW_ADDED: 'review:added',
    PAYOUT_PROCESSED: 'payout:processed',
};

export default websocketService;
