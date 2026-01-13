
import { IsString, IsNumber, IsOptional } from 'class-validator'

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string

  @IsNumber()
  total: number

  @IsString()
  currency: string

  @IsOptional()
  @IsString()
  shippingAdr?: string
}
