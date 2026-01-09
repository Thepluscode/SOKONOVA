
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Get('user/:userId')
  async listForUser(@Param('userId') userId: string) {
    return this.orders.listForUser(userId)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.orders.findById(id)
  }

  @Post('create')
  async createFromCart(
    @Body() dto: CreateOrderDto,
    @Query('cartId') cartId: string,
  ) {
    return this.orders.createFromCart(dto, cartId)
  }

  // MVP TESTING: Direct order creation without cart
  @Post('create-direct')
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
