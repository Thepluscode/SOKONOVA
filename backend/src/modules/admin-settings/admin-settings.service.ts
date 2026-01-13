import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminSettingsService {
    constructor(private prisma: PrismaService) { }

    // ============================================
    // Generic Settings CRUD
    // ============================================

    async getSettings(key: string) {
        const settings = await this.prisma.adminSettings.findUnique({
            where: { key },
        });
        return settings?.value || null;
    }

    async updateSettings(key: string, value: any) {
        return this.prisma.adminSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    // ============================================
    // Payment Settings
    // ============================================

    async getPaymentSettings() {
        return this.getSettings('payment');
    }

    async updatePaymentSettings(data: any) {
        return this.updateSettings('payment', data);
    }

    // ============================================
    // Shipping Settings
    // ============================================

    async getShippingSettings() {
        return this.getSettings('shipping');
    }

    async updateShippingSettings(data: any) {
        return this.updateSettings('shipping', data);
    }

    // ============================================
    // Branding Settings
    // ============================================

    async getBrandingSettings() {
        return this.getSettings('branding');
    }

    async updateBrandingSettings(data: any) {
        return this.updateSettings('branding', data);
    }

    // ============================================
    // Commission Settings
    // ============================================

    async getCommissionSettings() {
        return this.getSettings('commissions');
    }

    async updateCommissionSettings(data: any) {
        return this.updateSettings('commissions', data);
    }

    // ============================================
    // Loyalty Settings
    // ============================================

    async getLoyaltySettings() {
        return this.getSettings('loyalty');
    }

    async updateLoyaltySettings(data: any) {
        return this.updateSettings('loyalty', data);
    }

    // ============================================
    // Referral Settings
    // ============================================

    async getReferralSettings() {
        return this.getSettings('referral');
    }

    async updateReferralSettings(data: any) {
        return this.updateSettings('referral', data);
    }

    // ============================================
    // Flash Sales CRUD
    // ============================================

    async getFlashSales() {
        const sales = await this.prisma.flashSale.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Map status based on dates
        const now = new Date();
        return sales.map(sale => ({
            ...sale,
            status: this.calculateFlashSaleStatus(sale, now),
            products: sale.productIds.length,
        }));
    }

    async createFlashSale(data: {
        name: string;
        startDate: string;
        endDate: string;
        discount: number;
        products?: string[];
    }) {
        return this.prisma.flashSale.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                discount: data.discount,
                productIds: data.products || [],
            },
        });
    }

    async updateFlashSale(id: string, data: any) {
        return this.prisma.flashSale.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    }

    async deleteFlashSale(id: string) {
        return this.prisma.flashSale.delete({
            where: { id },
        });
    }

    private calculateFlashSaleStatus(sale: any, now: Date): 'scheduled' | 'active' | 'ended' {
        const start = new Date(sale.startDate);
        const end = new Date(sale.endDate);

        if (now < start) return 'scheduled';
        if (now > end) return 'ended';
        return 'active';
    }
}
