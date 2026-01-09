import { IsString, IsOptional } from 'class-validator';

export class ApplyDto {
  @IsString()
  userId: string;

  @IsString()
  businessName: string;

  @IsString()
  phone: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  storefrontDesc: string;

  // Bank details for payouts
  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  accountName?: string;

  @IsString()
  @IsOptional()
  bankCode?: string;
}
