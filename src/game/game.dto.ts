import { IsEnum, IsUUID } from 'class-validator';
import { GameSign } from './game.types';

export class JoinRoomDto {
  @IsUUID()
  roomSlug: string;
}

export class MakeChoiceDto {
  @IsUUID()
  roomSlug: string;

  @IsEnum(GameSign)
  choice: GameSign;
}

export class GetStatusDto {
  @IsUUID()
  roomSlug: string;
}
