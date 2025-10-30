
import { Body, Controller, Get, Post, Query, Delete } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartAddDto } from './dto/cart-add.dto'

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  // In production, derive userId/anonKey from auth/session
  @Get()
  async getCart(@Query('userId') userId?: string, @Query('anonKey') anonKey?: string) {
    const c = await this.cart.ensureCartForUser(userId, anonKey)
    return c
  }

  @Post('add')
  async add(@Body() dto: CartAddDto) {
    await this.cart.addItem(dto.cartId, dto.productId, dto.qty)
    return { ok: true }
  }

  @Delete('remove')
  async remove(@Query('cartId') cartId: string, @Query('productId') productId: string) {
    await this.cart.removeItem(cartId, productId)
    return { ok: true }
  }

  @Delete('clear')
  async clear(@Query('cartId') cartId: string) {
    await this.cart.clear(cartId)
    return { ok: true }
  }
}
