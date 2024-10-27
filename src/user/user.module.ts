import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
  imports: [PrismaModule]
})
export class UserModule {}
