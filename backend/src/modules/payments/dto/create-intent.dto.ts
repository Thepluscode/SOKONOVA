import { IsString, IsEnum } from 'class-validator';

export class CreateIntentDto {
  @IsString()
  orderId: string;

  @IsEnum(['flutterwave', 'paystack', 'stripe'])
  provider: 'flutterwave' | 'paystack' | 'stripe';
}
