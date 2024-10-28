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

  public async getRoom(id: number): Promise<Room> {
    return this.roomRepository.getRoom(id);
  }

  public async addUserToRoom(userId: number, roomId: number): Promise<Room> {
    return this.roomRepository.addUserToRoom(userId, roomId);
  }

  public async removeUserFromRoom(
    userId: number,
    roomId: number,
  ): Promise<Room> {
    return this.roomRepository.removeUserFromRoom(userId, roomId);
  }

  public async getUserRoom(userId: number): Promise<Room> {
    const user = await this.userService.getUser(userId);

    if (!user.createdRoomId) {
      throw new HttpException('User has no room', 400);
    }

    return this.roomRepository.getRoom(user.createdRoomId);
  }
}
