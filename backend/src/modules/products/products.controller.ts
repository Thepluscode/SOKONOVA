
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  async list() {
    return this.products.listAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.products.getById(id)
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    // TODO: add seller auth guard
    return this.products.create(dto)
  }
}
