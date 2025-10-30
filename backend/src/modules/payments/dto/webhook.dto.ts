import { IsString, IsEnum } from 'class-validator';

export class WebhookDto {
  @IsString()
  externalRef: string;

  @IsEnum(['SUCCEEDED', 'FAILED'])
  status: 'SUCCEEDED' | 'FAILED';
}
