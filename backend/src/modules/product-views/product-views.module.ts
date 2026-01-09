import { Module } from '@nestjs/common';
import { ProductViewsService } from './product-views.service';
import { ProductViewsController } from './product-views.controller';

@Module({
  providers: [ProductViewsService],
  controllers: [ProductViewsController],
})
export class ProductViewsModule {}