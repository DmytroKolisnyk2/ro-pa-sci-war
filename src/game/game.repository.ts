import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { GameChoice, GameSign } from './game.types';

@Injectable()
export class GameRepository {
  constructor(private readonly redis: RedisService) {}

  private getGameKey(roomId: string) {
    return `game:${roomId}`;
  }

  async saveChoice(
    roomId: string,
    userId: number,
    choice: GameSign,
  ): Promise<void> {
    const key = this.getGameKey(roomId);
    await this.redis.hset(key, userId.toString(), choice);
  }

  async getChoices(roomId: string) {
    const key = this.getGameKey(roomId);
    const choices = await this.redis.hgetall(key);

    const parsedChoices: GameChoice[] = Object.entries(choices).map(
      ([userId, choice]) => ({
        userId: +userId,
        choice: choice as GameSign,
      }),
    );
    return parsedChoices;
  }

  async resetChoices(roomId: string): Promise<void> {
    const key = this.getGameKey(roomId);
    await this.redis.del(key);
  }

  async resetUserChoices(roomId: string, userId: number): Promise<void> {
    const key = this.getGameKey(roomId);
    await this.redis.hdel(key, userId.toString());
  }
}
