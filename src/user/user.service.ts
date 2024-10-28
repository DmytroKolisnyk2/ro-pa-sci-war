// user.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(username: string): Promise<User> {
    return this.userRepository.createUser(username);
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.userRepository.getUser(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  public async isRoomAlreadyCreatedByUser(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);

    return !!user.createdRoomId;
  }

  public async setUserCreatedRoom(
    userId: number,
    roomId: number,
  ): Promise<User> {
    await this.getUser(userId);

    return this.userRepository.setUserCreatedRoom(userId, roomId);
  }

  public async clearUserCreatedRoom(userId: number): Promise<User> {
    await this.getUser(userId);

    return this.userRepository.clearUserCreatedRoom(userId);
  }
}
