
import { IsString, IsInt, Min } from 'class-validator'

export class CartAddDto {
  @IsString()
  cartId: string

  @IsString()
  productId: string

  @IsInt()
  @Min(1)
  qty: number
}
