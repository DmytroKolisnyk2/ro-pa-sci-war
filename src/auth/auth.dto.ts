import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 20)
  username: string;
}
