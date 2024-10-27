import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createUser(username: string): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: username,
      },
    });

    return createdUser;
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  public async setUserCreatedRoom(
    userId: number,
    roomId: number,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        createdRoomId: roomId,
      },
    });

    return user;
  }

  public async clearUserCreatedRoom(userId: number): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        createdRoomId: null,
      },
    });

    return user;
  }
}
