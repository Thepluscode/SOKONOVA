
import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator'

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsNumber()
  total?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsString()
  shippingAdr?: string

  @IsOptional()
  @IsString()
  buyerName?: string

  @IsOptional()
  @IsString()
  buyerPhone?: string

  @IsOptional()
  @IsEmail()
  buyerEmail?: string
}
