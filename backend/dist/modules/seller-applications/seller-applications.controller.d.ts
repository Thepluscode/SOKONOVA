import { SellerApplicationsService } from './seller-applications.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';
export declare class SellerApplicationsController {
    private svc;
    constructor(svc: SellerApplicationsService);
    apply(body: ApplyDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        country: string;
        city: string;
        phone: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    mine(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        country: string;
        city: string;
        phone: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    pending(adminId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        country: string;
        city: string;
        phone: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        adminNote: string | null;
        reviewedAt: Date | null;
    })[]>;
    approve(appId: string, body: ModerateDto): Promise<{
        application: {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            country: string;
            city: string;
            phone: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            businessName: string;
            storefrontDesc: string;
            adminNote: string | null;
            reviewedAt: Date | null;
        };
        user: {
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
        };
    }>;
    reject(appId: string, body: ModerateDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        country: string;
        city: string;
        phone: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
}
