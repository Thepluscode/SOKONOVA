import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsOptional()
  @IsString()
  sellerId?: string

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
  category?: string

  @IsOptional()
  @IsString()
  imageUrl?: string
}
