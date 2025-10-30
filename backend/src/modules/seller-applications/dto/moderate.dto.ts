import { IsString, IsOptional } from 'class-validator';

export class ModerateDto {
  @IsString()
  adminId: string; // who's performing the action (must be ADMIN)

  @IsOptional()
  @IsString()
  adminNote?: string;
}
