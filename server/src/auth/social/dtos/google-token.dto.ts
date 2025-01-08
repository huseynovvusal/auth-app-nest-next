import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsBoolean()
  @IsOptional()
  isJwtToken?: boolean;
}
