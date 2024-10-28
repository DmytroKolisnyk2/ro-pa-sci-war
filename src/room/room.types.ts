import { GameResult } from '@prisma/client';

export type RoomGameResult = Omit<GameResult, 'id' | 'roomId'>;
