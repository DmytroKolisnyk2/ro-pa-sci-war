import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [AuthModule, RoomModule, UserModule, RedisModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
