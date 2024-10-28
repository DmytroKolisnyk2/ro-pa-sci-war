import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createRoom(): Promise<Room> {
    const slug = uuid();
    const createdRoom = await this.prisma.room.create({
      data: { slug },
    });

    return createdRoom;
  }

  public async getRoom(id: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
      },
    });

    return room;
  }

  public async addUserToRoom(userId: number, roomId: number): Promise<Room> {
    const room = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return room;
  }

  public async removeUserFromRoom(
    userId: number,
    roomId: number,
  ): Promise<Room> {
    const room = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    return room;
  }
}
