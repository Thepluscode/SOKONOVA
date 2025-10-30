import { IsString } from 'class-validator';

export class ModerateReviewDto {
  @IsString()
  adminId: string;
}
