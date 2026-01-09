import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SellerServicesService } from './seller-services.service';

@Controller('seller-services')
export class SellerServicesController {
  constructor(private readonly sellerServicesService: SellerServicesService) {}

  // POST /seller-services
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async createService(
    @Body() data: {
      sellerId: string;
      title: string;
      description: string;
      price: number;
      currency: string;
      category: string;
      deliveryTime: number;
    },
  ) {
    return this.sellerServicesService.createService(data);
  }

  // GET /seller-services/seller/:sellerId
  @Get('seller/:sellerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getSellerServices(@Param('sellerId') sellerId: string) {
    return this.sellerServicesService.getSellerServices(sellerId);
  }

  // GET /seller-services
  @Get()
  async getAllServices() {
    return this.sellerServicesService.getAllServices();
  }

  // GET /seller-services/:id
  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.sellerServicesService.getServiceById(id);
  }

  // PUT /seller-services/:id
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async updateService(
    @Param('id') id: string,
    @Body() data: {
      title?: string;
      description?: string;
      price?: number;
      currency?: string;
      category?: string;
      deliveryTime?: number;
      active?: boolean;
    },
  ) {
    return this.sellerServicesService.updateService(id, data);
  }

  // DELETE /seller-services/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async deleteService(@Param('id') id: string) {
    return this.sellerServicesService.deleteService(id);
  }

  // POST /seller-services/:id/order
  @Post(':id/order')
  @UseGuards(JwtAuthGuard)
  async createServiceOrder(
    @Param('id') id: string,
    @Body() data: {
      buyerId: string;
      sellerId: string;
      message: string;
      price: number;
      currency: string;
    },
  ) {
    return this.sellerServicesService.createServiceOrder({
      serviceId: id,
      ...data,
    });
  }

  // GET /seller-services/orders/seller/:sellerId
  @Get('orders/seller/:sellerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async getSellerServiceOrders(@Param('sellerId') sellerId: string) {
    return this.sellerServicesService.getSellerServiceOrders(sellerId);
  }

  // GET /seller-services/orders/buyer/:buyerId
  @Get('orders/buyer/:buyerId')
  @UseGuards(JwtAuthGuard)
  async getBuyerServiceOrders(@Param('buyerId') buyerId: string) {
    return this.sellerServicesService.getBuyerServiceOrders(buyerId);
  }

  // GET /seller-services/orders/:id
  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getServiceOrderById(@Param('id') id: string) {
    return this.sellerServicesService.getServiceOrderById(id);
  }

  // PUT /seller-services/orders/:id/status
  @Put('orders/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  async updateServiceOrderStatus(
    @Param('id') id: string,
    @Body() data: {
      status: string;
      note?: string;
    },
  ) {
    return this.sellerServicesService.updateServiceOrderStatus(id, data.status as any, data.note);
  }
}