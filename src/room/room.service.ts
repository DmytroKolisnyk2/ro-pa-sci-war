import { HttpException, Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userService: UserService,
  ) {}

  public async createRoom(userId: number): Promise<Room> {
    if (await this.userService.isRoomAlreadyCreatedByUser(userId)) {
      throw new HttpException('User already has a room', 400);
    }

    const createdRoom = await this.roomRepository.createRoom();

    await this.userService.setUserCreatedRoom(userId, createdRoom.id);

    return createdRoom;
  }

  public async getRoomBySlug(slug: string): Promise<Room> {
    return this.roomRepository.getRoomBySlag(slug);
  }

  public async addUserToRoom(slug: string, userId: number): Promise<Room> {
    return this.roomRepository.addUserToRoom(slug, userId);
  }

  public async getRoomUsersCount(slug: string): Promise<number> { 
    return this.roomRepository.getRoomUsersCount(slug);
  }

  public async removeUserFromRoom(slug: string, userId: number): Promise<Room> {
    return this.roomRepository.removeUserFromRoom(slug, userId);
  }

  public async getUserRoom(userId: number): Promise<Room> {
    const user = await this.userService.getUser(userId);

    if (!user.createdRoomId) {
      throw new HttpException('User has no room', 400);
    }

    return this.roomRepository.getRoomById(user.createdRoomId);
  }

  public async isUserInRoom(slug: string, userId: number): Promise<boolean> {
    return await this.roomRepository.isUserInRoom(slug, userId);
  }
}
