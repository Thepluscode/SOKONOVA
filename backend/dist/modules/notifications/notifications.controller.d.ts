import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    list(userId: string, limit?: string, unreadOnly?: string): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        readAt: Date | null;
        createdAt: Date;
        userId: string;
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
