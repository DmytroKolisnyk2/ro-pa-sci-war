import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { RoomModule } from 'src/room/room.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [GameService, GameGateway, GameRepository],
  imports: [RoomModule, RedisModule, AuthModule],
})
export class GameModule {}
