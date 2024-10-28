import { IsString, IsEnum } from 'class-validator';
import { GameSign } from './game.types';

export class JoinRoomDto {
  @IsString()
  roomSlug: string;
}

export class MakeChoiceDto {
  @IsString()
  roomSlug: string;

  @IsEnum(GameSign)
  choice: GameSign;
}

export class GetStatusDto {
  @IsString()
  roomSlug: string;
}
