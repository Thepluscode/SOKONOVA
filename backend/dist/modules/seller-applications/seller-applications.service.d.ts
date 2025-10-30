import { PrismaService } from '../prisma.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';
export declare class SellerApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    apply(dto: ApplyDto): Promise<{
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
    getMine(userId: string): Promise<{
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
    listPending(adminId: string): Promise<({
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
    approve(appId: string, dto: ModerateDto): Promise<{
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
    reject(appId: string, dto: ModerateDto): Promise<{
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
