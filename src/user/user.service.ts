import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userService: UserRepository) {}

  public async createUser(username: string): Promise<User> {
    return this.userService.createUser(username);
  }

  public async getUser(id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  public async setUserCreatedRoom(
    userId: number,
    roomId: number,
  ): Promise<User> {
    return this.userService.setUserCreatedRoom(userId, roomId);
  }

  public async clearUserCreatedRoom(userId: number): Promise<User> {
    return this.userService.clearUserCreatedRoom(userId);
  }
}
