import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 20)
  username: string;
}

export class LoginResponseDto {
  token: string;
}

export class JwtPayloadDto {
  id: number;
  username: string;
  ait: number;
  exp: number;
}