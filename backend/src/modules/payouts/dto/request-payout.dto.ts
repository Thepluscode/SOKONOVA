import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

/**
 * DTO for seller payout requests
 */
export class RequestPayoutDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  method: string; // e.g. "Bank Transfer", "Mobile Money"

  @IsString()
  @IsOptional()
  note?: string;
}
