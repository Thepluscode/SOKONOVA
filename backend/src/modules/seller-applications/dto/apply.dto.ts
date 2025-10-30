import { IsString } from 'class-validator';

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
}
