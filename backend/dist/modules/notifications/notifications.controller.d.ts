import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    list(userId: string, limit?: string, unreadOnly?: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        message: string;
        type: string;
        isRead: boolean;
        readAt: Date | null;
    }[]>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    delete(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
