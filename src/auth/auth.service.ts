import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload, LoginResponse } from './types/auth.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async login(username: string): Promise<LoginResponse> {
    const user: User = await this.userService.createUser(username);
    const token = await this.generateToken(user);

    return {
      token,
    };
  }

  private generateToken(user: User): Promise<string> {
    const payload: JwtPayload = { username: user.username, id: user.id };

    return this.jwtService.signAsync(payload);
  }
}
