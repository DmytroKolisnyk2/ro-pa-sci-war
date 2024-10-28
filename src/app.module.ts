import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, RoomModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
