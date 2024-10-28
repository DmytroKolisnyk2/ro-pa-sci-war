import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, JwtPayloadDto, LoginResponseDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ValidationExceptionFilter } from 'src/filters/validation-exception.filter';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { PipeExceptionFilter } from 'src/filters/pipe-exception.filter';

@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, PipeExceptionFilter)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: "Get the authenticated user's information" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Returns the authenticated user's payload",
    type: JwtPayloadDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  me(@Request() req): JwtPayloadDto {
    return req.user as JwtPayloadDto;
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    const loginResponse = await this.authService.login(data.username);
    return loginResponse as LoginResponseDto;
  }
}
