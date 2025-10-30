import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  buyerId: string; // must match session.user.id in production

  @IsString()
  orderItemId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
