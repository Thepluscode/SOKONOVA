import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProductViewsService } from './product-views.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('product-views')
export class ProductViewsController {
  constructor(private productViewsService: ProductViewsService) {}

  // AUTHENTICATED: track product view for personalized recommendations
  // POST /product-views
  @Post()
  @UseGuards(JwtAuthGuard)
  async trackView(@Body() body: { userId: string; productId: string }) {
    return this.productViewsService.trackView(body.userId, body.productId);
  }
}