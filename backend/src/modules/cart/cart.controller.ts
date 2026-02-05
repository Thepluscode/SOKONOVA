import { Body, Controller, Get, Post, Query, Delete } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartAddDto } from './dto/cart-add.dto'

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  // Note: Authentication can be optional for guest carts
  // For authenticated users, userId should come from JWT via guards
  @Get()
  async getCart(@Query('userId') userId?: string, @Query('anonKey') anonKey?: string) {
    const cart = await this.cart.ensureCartForUser(userId, anonKey)
    return cart
  }

  @Post()
  async addRoot(@Body() dto: CartAddDto) {
    const updatedCart = await this.cart.addItem(dto.cartId, dto.productId, dto.qty)
    return updatedCart
  }

  @Post('add')
  async add(@Body() dto: CartAddDto) {
    // Add item and return updated cart directly from service
    const updatedCart = await this.cart.addItem(dto.cartId, dto.productId, dto.qty)
    return updatedCart
  }

  @Delete('remove')
  async remove(@Query('cartId') cartId: string, @Query('productId') productId: string) {
    const updatedCart = await this.cart.removeItem(cartId, productId)
    return updatedCart
  }

  @Delete('clear')
  async clear(@Query('cartId') cartId: string) {
    const updatedCart = await this.cart.clear(cartId)
    return updatedCart
  }
}
