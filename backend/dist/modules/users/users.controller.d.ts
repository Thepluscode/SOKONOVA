import { UsersService } from './users.service';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        sellerHandle: string | null;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        shopName: string | null;
        shopLogoUrl: string | null;
        shopBannerUrl: string | null;
        shopBio: string | null;
        country: string | null;
        city: string | null;
        ratingAvg: number | null;
        ratingCount: number | null;
        phone: string | null;
        timezone: string | null;
        notifyEmail: boolean;
        notifySms: boolean;
        notifyPush: boolean;
        digestWeekly: boolean;
        quietHoursStart: number | null;
        quietHoursEnd: number | null;
        pushSubscription: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStorefront(id: string, body: {
        shopName?: string;
        sellerHandle?: string;
        shopLogoUrl?: string;
        shopBannerUrl?: string;
        shopBio?: string;
        country?: string;
        city?: string;
    }): Promise<{
        id: string;
        sellerHandle: string;
        shopName: string;
        shopLogoUrl: string;
        shopBannerUrl: string;
        shopBio: string;
        country: string;
        city: string;
        ratingAvg: number;
        ratingCount: number;
    }>;
}
