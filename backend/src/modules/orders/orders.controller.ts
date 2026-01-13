
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async listMine(@CurrentUser('id') userId: string) {
    return this.orders.listForUser(userId)
  }

  @Get('seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async listSeller(
    @Query('sellerId') sellerId: string | undefined,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    if (sellerId && sellerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access other sellers')
    }
    const targetSellerId =
      user.role === Role.ADMIN && sellerId ? sellerId : user.id
    return this.orders.listForSeller(targetSellerId)
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listForUser(@Param('userId') userId: string) {
    return this.orders.listForUser(userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string, @CurrentUser() user: { id: string; role: Role }) {
    const order = await this.orders.findById(id)
    if (order.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Not allowed to access this order')
    }
    return order
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createFromCart(
    @Body() dto: CreateOrderDto,
    @Query('cartId') cartId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.orders.createFromCart({ ...dto, userId }, cartId)
  }

  // MVP TESTING: Direct order creation without cart
  @Post('create-direct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createDirect(
    @Body() body: {
      userId: string;
      items: Array<{ productId: string; qty: number; price: number }>;
      total: number;
      currency: string;
    },
  ) {
    return this.orders.createDirect(
      body.userId,
      body.items,
      body.total,
      body.currency,
    )
  }
}
