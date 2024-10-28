import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(username: string): Promise<User> {
    return this.userRepository.createUser(username);
  }

  public async getUser(id: number): Promise<User> {
    return this.userRepository.getUser(id);
  }

  public async isRoomAlreadyCreatedByUser(userId: number): Promise<boolean> {
    const user = await this.userRepository.getUser(userId);

    if (user.createdRoomId) {
      return true;
    }

    return false;
  }

  public async setUserCreatedRoom(
    userId: number,
    roomId: number,
  ): Promise<User> {
    return this.userRepository.setUserCreatedRoom(userId, roomId);
  }

  public async clearUserCreatedRoom(userId: number): Promise<User> {
    return this.userRepository.clearUserCreatedRoom(userId);
  }
}
