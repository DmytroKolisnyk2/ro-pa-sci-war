import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoomRepository } from './room.repository';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [RoomService, RoomRepository],
  controllers: [RoomController],
  imports: [AuthModule, UserModule, PrismaModule],
})
export class RoomModule {}
