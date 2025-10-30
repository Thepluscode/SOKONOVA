
import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsString()
  sellerId: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsString()
  currency: string

  @IsOptional()
  @IsString()
  imageUrl?: string
}
