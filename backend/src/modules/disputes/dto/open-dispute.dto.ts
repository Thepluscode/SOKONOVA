import { IsString, IsOptional } from 'class-validator';

export class OpenDisputeDto {
  @IsOptional()
  @IsString()
  buyerId?: string; // enforce buyerId === session.user.id in real app

  @IsString()
  orderItemId: string;

  @IsString()
  reasonCode: string; // "NOT_DELIVERED" | "DAMAGED" | "COUNTERFEIT" | "WRONG_ITEM" | "OTHER"

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photoProofUrl?: string;
}
