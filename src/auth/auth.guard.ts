import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { jwtConstants } from './auth.constants';
import { JwtPayload } from './types/auth.types';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isWebSocket = context.getType() === 'ws';
    const token = isWebSocket
      ? this.extractTokenFromWebSocket(context)
      : this.extractTokenFromHeader(context.switchToHttp().getRequest());

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const client = isWebSocket
        ? context.switchToWs().getClient<Socket>()
        : context.switchToHttp().getRequest();
      client['user'] = payload; 
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromWebSocket(
    context: ExecutionContext,
  ): string | undefined {
    const client = context.switchToWs().getClient<Socket>();
    const authHeader = client.handshake?.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
