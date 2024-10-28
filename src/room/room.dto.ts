import { ApiProperty } from '@nestjs/swagger';
import { GameResult, User } from '@prisma/client';

export class RoomDto {
  @ApiProperty({ description: 'Unique identifier of the room' })
  id: number;

  @ApiProperty({ description: 'Slug of the room' })
  slug: string;

  @ApiProperty({ description: 'User who are connected to the room' })
  users: User[];
  
  @ApiProperty({ description: 'Game results of the room' })
  gameResult: GameResult[];
}
