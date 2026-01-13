import { IsString, IsOptional } from 'class-validator';

export class ResolveDisputeDto {
  @IsOptional()
  @IsString()
  actorId?: string; // sellerId OR adminId, depending on policy

  @IsString()
  status: string;
  // Allowed:
  // "SELLER_RESPONDED"
  // "RESOLVED_BUYER_COMPENSATED"
  // "RESOLVED_REDELIVERED"
  // "REJECTED"

  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
