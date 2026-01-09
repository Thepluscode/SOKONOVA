import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceOrderStatus } from '@prisma/client';

@Injectable()
export class SellerServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(data: {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    deliveryTime: number;
  }) {
    const service = await this.prisma.sellerService.create({
      data: {
        sellerId: data.sellerId,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        category: data.category,
        deliveryTime: data.deliveryTime,
        active: true,
      },
    });
    
    return service;
  }

  async getSellerServices(sellerId: string) {
    const services = await this.prisma.sellerService.findMany({
      where: { sellerId, active: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return services;
  }

  async getAllServices() {
    const services = await this.prisma.sellerService.findMany({
      where: { active: true },
      include: {
        seller: {
          select: {
            shopName: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return services;
  }

  async getServiceById(id: string) {
    const service = await this.prisma.sellerService.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            shopName: true,
            shopLogoUrl: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
    });
    
    return service;
  }

  async updateService(id: string, data: Partial<{
    title: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    deliveryTime: number;
    active: boolean;
  }>) {
    const service = await this.prisma.sellerService.update({
      where: { id },
      data,
    });
    
    return service;
  }

  async deleteService(id: string) {
    const service = await this.prisma.sellerService.update({
      where: { id },
      data: { active: false },
    });
    
    return service;
  }

  async createServiceOrder(data: {
    serviceId: string;
    buyerId: string;
    sellerId: string;
    message: string;
    price: number;
    currency: string;
  }) {
    const order = await this.prisma.serviceOrder.create({
      data: {
        serviceId: data.serviceId,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        message: data.message,
        price: data.price,
        currency: data.currency,
        status: 'PENDING' as ServiceOrderStatus,
      },
    });
    
    return order;
  }

  async getSellerServiceOrders(sellerId: string) {
    const orders = await this.prisma.serviceOrder.findMany({
      where: { sellerId },
      include: {
        service: {
          select: {
            title: true,
          },
        },
        buyer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return orders;
  }

  async getBuyerServiceOrders(buyerId: string) {
    const orders = await this.prisma.serviceOrder.findMany({
      where: { buyerId },
      include: {
        service: {
          select: {
            title: true,
          },
        },
        seller: {
          select: {
            shopName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return orders;
  }

  async getServiceOrderById(id: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        service: true,
        buyer: {
          select: {
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            shopName: true,
            email: true,
          },
        },
      },
    });
    
    return order;
  }

  async updateServiceOrderStatus(id: string, status: ServiceOrderStatus, note?: string) {
    const order = await this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status,
        note,
      },
    });
    
    return order;
  }
}