import { HttpException, Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { Room } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { RoomGameResult } from './room.types';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userService: UserService,
  ) {}

  public async createRoom(userId: number): Promise<Room> {
    const isRoomCreated =
      await this.userService.isRoomAlreadyCreatedByUser(userId);

    if (isRoomCreated) {
      throw new HttpException('User already has a room', 400);
    }

    const createdRoom = await this.roomRepository.createRoom();

    await this.userService.setUserCreatedRoom(userId, createdRoom.id);

    return createdRoom;
  }

  public async getRoomBySlug(slug: string): Promise<Room> {
    const room = this.roomRepository.getRoomBySlag(slug);

    if (!room) {
      throw new HttpException('Room not found', 404);
    }

    return room;
  }

  public async addUserToRoom(slug: string, userId: number): Promise<Room> {
    await this.getRoomBySlug(slug);

    return this.roomRepository.addUserToRoom(slug, userId);
  }

  public async getRoomUsersCount(slug: string): Promise<number> {
    await this.getRoomBySlug(slug);

    return this.roomRepository.getRoomUsersCount(slug);
  }

  public async removeUserFromRoom(slug: string, userId: number): Promise<Room> {
    await this.getRoomBySlug(slug);

    const isRoomCreated =
      await this.userService.isRoomAlreadyCreatedByUser(userId);

    if (isRoomCreated) {
      await this.userService.clearUserCreatedRoom(userId);
    }

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
    await this.getRoomBySlug(slug);

    return await this.roomRepository.isUserInRoom(slug, userId);
  }

  public async saveToRoomGameResult(
    slug: string,
    result: RoomGameResult,
  ): Promise<Room> {
    await this.getRoomBySlug(slug);

    return this.roomRepository.saveToRoomGameResult(slug, result);
  }

  public async getRoomDetailedInfo(
    slug: string,
    userId: number,
  ): Promise<Room> {
    const isUserInRoom = await this.isUserInRoom(slug, userId);

    if (!isUserInRoom) {
      throw new HttpException('User is not in the room', 400);
    }

    return this.roomRepository.getRoomDetailedInfo(slug);
  }
}
