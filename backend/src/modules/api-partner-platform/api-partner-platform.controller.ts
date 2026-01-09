import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiPartnerPlatformService } from './api-partner-platform.service';
import { PartnerStatus } from '@prisma/client';

@Controller('api-partners')
export class ApiPartnerPlatformController {
  constructor(private readonly apiPartnerService: ApiPartnerPlatformService) {}

  // POST /api-partners/register
  @Post('register')
  async registerPartner(
    @Body() data: {
      companyName: string;
      contactEmail: string;
      apiKeyName: string;
    },
  ) {
    return this.apiPartnerService.registerPartner(data);
  }

  // GET /api-partners/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getPartner(@Param('id') id: string) {
    return this.apiPartnerService.getPartner(id);
  }

  // PUT /api-partners/:id/status
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePartnerStatus(
    @Param('id') id: string,
    @Body() data: { status: PartnerStatus },
  ) {
    return this.apiPartnerService.updatePartnerStatus(id, data.status);
  }

  // DELETE /api-partners/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deletePartner(@Param('id') id: string) {
    return this.apiPartnerService.deletePartner(id);
  }

  // POST /api-partners/:id/generate-key
  @Post(':id/generate-key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async generateApiKey(@Param('id') id: string) {
    return this.apiPartnerService.generateApiKey(id);
  }

  // GET /api-partners/admin/all
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllPartners() {
    return this.apiPartnerService.getAllPartners();
  }

  // POST /api-partners/:id/service
  @Post(':id/service')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPartnerService(
    @Param('id') id: string,
    @Body() data: { name: string; description: string; price: number },
  ) {
    return this.apiPartnerService.createPartnerService(id, data);
  }

  // Webhook endpoints
  // POST /api-partners/:id/webhooks
  @Post(':id/webhooks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createWebhook(
    @Param('id') id: string,
    @Body() data: { url: string; events: string[]; secret: string },
  ) {
    return this.apiPartnerService.createWebhook(id, data);
  }

  // GET /api-partners/:id/webhooks
  @Get(':id/webhooks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getPartnerWebhooks(@Param('id') id: string) {
    return this.apiPartnerService.getPartnerWebhooks(id);
  }

  // PUT /api-partners/webhooks/:webhookId
  @Put('webhooks/:webhookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateWebhook(
    @Param('webhookId') webhookId: string,
    @Body() data: { url?: string; events?: string[]; secret?: string; active?: boolean },
  ) {
    return this.apiPartnerService.updateWebhook(webhookId, data);
  }

  // DELETE /api-partners/webhooks/:webhookId
  @Delete('webhooks/:webhookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteWebhook(@Param('webhookId') webhookId: string) {
    return this.apiPartnerService.deleteWebhook(webhookId);
  }

  // GET /api-partners/webhooks/:webhookId/deliveries
  @Get('webhooks/:webhookId/deliveries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getWebhookDeliveries(@Param('webhookId') webhookId: string) {
    return this.apiPartnerService.getWebhookDeliveries(webhookId);
  }
}