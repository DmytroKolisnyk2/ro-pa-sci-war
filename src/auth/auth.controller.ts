import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtPayload, LoginResponse } from './auth.types';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() req): JwtPayload {
    return req.user;
  }

  @Post('login')
  login(@Body() data: LoginDto): Promise<LoginResponse> {
    const loginResponse = this.authService.login(data.username);

    return loginResponse;
  }
}
