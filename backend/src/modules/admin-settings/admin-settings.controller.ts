import {
    Controller,
    Get,
    Put,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminSettingsController {
    constructor(private readonly settingsService: AdminSettingsService) { }

    // ============================================
    // Payment Settings
    // ============================================

    @Get('settings/payments')
    async getPaymentSettings() {
        return this.settingsService.getPaymentSettings();
    }

    @Put('settings/payments')
    async updatePaymentSettings(@Body() data: any) {
        await this.settingsService.updatePaymentSettings(data);
        return { success: true, message: 'Payment settings updated' };
    }

    // ============================================
    // Shipping Settings
    // ============================================

    @Get('settings/shipping')
    async getShippingSettings() {
        return this.settingsService.getShippingSettings();
    }

    @Put('settings/shipping')
    async updateShippingSettings(@Body() data: any) {
        await this.settingsService.updateShippingSettings(data);
        return { success: true, message: 'Shipping settings updated' };
    }

    // ============================================
    // Branding Settings
    // ============================================

    @Get('settings/branding')
    async getBrandingSettings() {
        return this.settingsService.getBrandingSettings();
    }

    @Put('settings/branding')
    async updateBrandingSettings(@Body() data: any) {
        await this.settingsService.updateBrandingSettings(data);
        return { success: true, message: 'Branding settings updated' };
    }

    // ============================================
    // Commission Settings
    // ============================================

    @Get('settings/commissions')
    async getCommissionSettings() {
        return this.settingsService.getCommissionSettings();
    }

    @Put('settings/commissions')
    async updateCommissionSettings(@Body() data: any) {
        await this.settingsService.updateCommissionSettings(data);
        return { success: true, message: 'Commission settings updated' };
    }

    // ============================================
    // Loyalty Settings
    // ============================================

    @Get('settings/loyalty')
    async getLoyaltySettings() {
        return this.settingsService.getLoyaltySettings();
    }

    @Put('settings/loyalty')
    async updateLoyaltySettings(@Body() data: any) {
        await this.settingsService.updateLoyaltySettings(data);
        return { success: true, message: 'Loyalty settings updated' };
    }

    // ============================================
    // Referral Settings
    // ============================================

    @Get('settings/referral')
    async getReferralSettings() {
        return this.settingsService.getReferralSettings();
    }

    @Put('settings/referral')
    async updateReferralSettings(@Body() data: any) {
        await this.settingsService.updateReferralSettings(data);
        return { success: true, message: 'Referral settings updated' };
    }

    // ============================================
    // Flash Sales
    // ============================================

    @Get('flash-sales')
    async getFlashSales() {
        return this.settingsService.getFlashSales();
    }

    @Post('flash-sales')
    async createFlashSale(@Body() data: any) {
        return this.settingsService.createFlashSale(data);
    }

    @Put('flash-sales/:id')
    async updateFlashSale(@Param('id') id: string, @Body() data: any) {
        return this.settingsService.updateFlashSale(id, data);
    }

    @Delete('flash-sales/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteFlashSale(@Param('id') id: string) {
        await this.settingsService.deleteFlashSale(id);
    }

    // ============================================
    // Analytics Endpoints
    // ============================================

    @Get('analytics/orders')
    async getOrderAnalytics() {
        return this.settingsService.getOrderAnalytics();
    }

    @Get('analytics/inventory')
    async getInventoryAnalytics() {
        return this.settingsService.getInventoryAnalytics();
    }

    @Get('analytics/logistics')
    async getLogisticsAnalytics() {
        return this.settingsService.getLogisticsAnalytics();
    }
}

