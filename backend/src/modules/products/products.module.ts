
import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { SellerProductsController } from './seller-products.controller'

@Module({
  controllers: [ProductsController, SellerProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
