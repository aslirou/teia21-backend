import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsBoolean()
  responded?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
