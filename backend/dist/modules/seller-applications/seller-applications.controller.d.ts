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
        city: string;
        country: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        userId: string;
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
            city: string;
            country: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            userId: string;
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
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    mine(user: {
        id: string;
    }): Promise<{
        id: string;
        city: string;
        country: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        userId: string;
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
            email: string;
            name: string;
            role: string;
        };
    } & {
        id: string;
        city: string;
        country: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        userId: string;
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
            city: string;
            country: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            userId: string;
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
            email: string;
            password: string | null;
            name: string | null;
            role: string;
            city: string | null;
            country: string | null;
            phone: string | null;
            sellerHandle: string | null;
            shopName: string | null;
            shopLogoUrl: string | null;
            shopBannerUrl: string | null;
            shopBio: string | null;
            ratingAvg: number | null;
            ratingCount: number | null;
            bio: string | null;
            notifyEmail: boolean;
            notifySms: boolean;
            notifyPush: boolean;
            timezone: string | null;
            quietHoursStart: number | null;
            quietHoursEnd: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    reject(appId: string, body: ModerateDto, user: {
        id: string;
    }): Promise<{
        id: string;
        city: string;
        country: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        userId: string;
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
