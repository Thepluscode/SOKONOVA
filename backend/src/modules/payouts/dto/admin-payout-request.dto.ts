import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for admin payout request actions
 */
export class AdminPayoutRequestDto {
  @IsString()
  @IsOptional()
  note?: string;
}
