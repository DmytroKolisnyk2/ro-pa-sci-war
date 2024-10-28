import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createRoom(): Promise<Room> {
    const slug = uuid();
    const createdRoom = this.prisma.room.create({
      data: { slug },
    });

    return createdRoom;
  }

  public async getRoomBySlag(slug: string): Promise<Room> {
    const room = this.prisma.room.findUnique({
      where: {
        slug,
      },
    });

    return room;
  }

  public async addUserToRoom(slug: string, userId: number): Promise<Room> {
    const room = this.prisma.room.update({
      where: {
        slug,
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

  public async getRoomById(id: number): Promise<Room> {
    return this.prisma.room.findUnique({
      where: {
        id,
      },
    });
  }

  public async removeUserFromRoom(slug: string, userId: number): Promise<Room> {
    const room = this.prisma.room.update({
      where: {
        slug,
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

  public async isUserInRoom(slug: string, userId: number): Promise<boolean> {
    const room = await this.prisma.room.findUnique({
      where: {
        slug,
      },
      include: {
        users: {
          where: {
            id: userId,
          },
        },
      },
    });

    if (room.users.length > 0) {
      return true;
    }

    return false;
  }

  public async getRoomUsersCount(slug: string): Promise<number> {
    const room = await this.prisma.room.findUnique({
      where: {
        slug,
      },
      include: {
        users: true,
      },
    });

    return room.users.length;
  }
}
