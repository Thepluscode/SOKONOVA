
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

  @Post('create')
  async createFromCart(
    @Body() dto: CreateOrderDto,
    @Query('cartId') cartId: string,
  ) {
    return this.orders.createFromCart(dto, cartId)
  }
}
