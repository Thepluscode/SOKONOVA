import { SellerApplicationsService } from './seller-applications.service';
import { ApplyDto } from './dto/apply.dto';
import { ModerateDto } from './dto/moderate.dto';
export declare class SellerApplicationsController {
    private svc;
    constructor(svc: SellerApplicationsService);
    apply(body: ApplyDto, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        country: string;
        phone: string;
        userId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        bankCode: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    activateInstant(body: ApplyDto, user: {
        id: string;
    }): Promise<{
        success: boolean;
        application: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            country: string;
            phone: string;
            userId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            businessName: string;
            storefrontDesc: string;
            bankName: string | null;
            accountNumber: string | null;
            accountName: string | null;
            bankCode: string | null;
            adminNote: string | null;
            reviewedAt: Date | null;
        };
        user: {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        };
        message: string;
    }>;
    mine(user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        country: string;
        phone: string;
        userId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        bankCode: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
    pending(user: {
        id: string;
    }): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        country: string;
        phone: string;
        userId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        bankCode: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    })[]>;
    approve(appId: string, body: ModerateDto, user: {
        id: string;
    }): Promise<{
        application: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            country: string;
            phone: string;
            userId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            businessName: string;
            storefrontDesc: string;
            bankName: string | null;
            accountNumber: string | null;
            accountName: string | null;
            bankCode: string | null;
            adminNote: string | null;
            reviewedAt: Date | null;
        };
        user: {
            id: string;
            ratingAvg: number | null;
            ratingCount: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
        };
    }>;
    reject(appId: string, body: ModerateDto, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        country: string;
        phone: string;
        userId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        businessName: string;
        storefrontDesc: string;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        bankCode: string | null;
        adminNote: string | null;
        reviewedAt: Date | null;
    }>;
}
