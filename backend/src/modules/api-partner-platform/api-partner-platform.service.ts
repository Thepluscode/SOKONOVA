import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PartnerStatus } from '@prisma/client';
import { createHmac } from 'crypto';

@Injectable()
export class ApiPartnerPlatformService {
  constructor(private prisma: PrismaService) {}

  async registerPartner(data: {
    companyName: string;
    contactEmail: string;
    apiKeyName: string;
  }) {
    // Generate a secure API key
    const apiKey = this.generateSecureApiKey();
    
    const partner = await this.prisma.apiPartner.create({
      data: {
        companyName: data.companyName,
        contactEmail: data.contactEmail,
        apiKeyName: data.apiKeyName,
        apiKey: apiKey,
        status: 'PENDING' as PartnerStatus,
      },
    });
    
    return partner;
  }

  async getPartner(id: string) {
    const partner = await this.prisma.apiPartner.findUnique({
      where: { id },
    });
    
    return partner;
  }

  async updatePartnerStatus(id: string, status: PartnerStatus) {
    const updatedPartner = await this.prisma.apiPartner.update({
      where: { id },
      data: { status },
    });
    
    return updatedPartner;
  }

  async deletePartner(id: string) {
    const partner = await this.prisma.apiPartner.delete({
      where: { id },
      select: {
        id: true,
        companyName: true,
        contactEmail: true,
      },
    });
    
    return partner;
  }

  async generateApiKey(id: string) {
    const apiKey = this.generateSecureApiKey();
    
    const updatedPartner = await this.prisma.apiPartner.update({
      where: { id },
      data: {
        apiKey,
        apiKeyLastGenerated: new Date(),
      },
    });
    
    return {
      id: updatedPartner.id,
      apiKey: updatedPartner.apiKey,
    };
  }

  async getAllPartners() {
    const partners = await this.prisma.apiPartner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return partners;
  }

  async createPartnerService(id: string, data: { name: string; description: string; price: number }) {
    // This would typically create a service offering for the partner
    // For now, we'll just return a mock response
    return {
      partnerId: id,
      service: data,
      createdAt: new Date(),
    };
  }

  // New methods for webhook support
  async createWebhook(partnerId: string, data: { 
    url: string; 
    events: string[]; 
    secret: string;
  }) {
    // Verify partner exists
    const partner = await this.prisma.apiPartner.findUnique({
      where: { id: partnerId },
    });
    
    if (!partner) {
      throw new Error('Partner not found');
    }
    
    // Create webhook
    const webhook = await this.prisma.webhook.create({
      data: {
        partnerId,
        url: data.url,
        events: data.events,
        secret: data.secret,
        active: true,
      },
    });
    
    return webhook;
  }

  async getPartnerWebhooks(partnerId: string) {
    const webhooks = await this.prisma.webhook.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
    });
    
    return webhooks;
  }

  async updateWebhook(id: string, data: { 
    url?: string; 
    events?: string[]; 
    secret?: string;
    active?: boolean;
  }) {
    const webhook = await this.prisma.webhook.update({
      where: { id },
      data,
    });
    
    return webhook;
  }

  async deleteWebhook(id: string) {
    const webhook = await this.prisma.webhook.delete({
      where: { id },
    });
    
    return webhook;
  }

  // Method to send webhook notifications
  async sendWebhookNotification(webhookId: string, event: string, payload: any) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });
    
    if (!webhook || !webhook.active) {
      return;
    }
    
    // Check if webhook is subscribed to this event
    if (!webhook.events.includes(event)) {
      return;
    }
    
    // Create signature for security
    const signature = this.createWebhookSignature(webhook.secret, JSON.stringify(payload));
    
    try {
      // In a real implementation, we would send an HTTP request to the webhook URL
      // For now, we'll just log it
      console.log(`Sending webhook to ${webhook.url} for event ${event}`);
      console.log(`Payload: ${JSON.stringify(payload)}`);
      console.log(`Signature: ${signature}`);
      
      // Record the webhook delivery
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId,
          eventId: event,
          payload: JSON.stringify(payload),
          status: 'SUCCESS',
          response: 'OK',
        },
      });
    } catch (error) {
      // Record failed delivery
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId,
          eventId: event,
          payload: JSON.stringify(payload),
          status: 'FAILED',
          response: error.message,
        },
      });
      
      throw error;
    }
  }

  // Method to get webhook delivery history
  async getWebhookDeliveries(webhookId: string, limit: number = 50) {
    const deliveries = await this.prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return deliveries;
  }

  // Helper method to generate secure API key
  private generateSecureApiKey(): string {
    return `sk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  // Helper method to create webhook signature
  private createWebhookSignature(secret: string, payload: string): string {
    return createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }
}