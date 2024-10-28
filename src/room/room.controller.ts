// room.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Room } from '@prisma/client'; 
import { RoomDto } from './room.dto';
import { ValidationExceptionFilter } from 'src/filters/validation-exception.filter';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { PipeExceptionFilter } from 'src/filters/pipe-exception.filter';

@UseFilters(ValidationExceptionFilter, HttpExceptionFilter, PipeExceptionFilter)
@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
    type: RoomDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createRoom(@Request() req): Promise<Room> {
    return this.roomService.createRoom(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('created')
  @ApiOperation({ summary: 'Get the room created by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the room created by the user.',
    type: RoomDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getMyRoom(@Request() req): Promise<Room> {
    return this.roomService.getUserRoom(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':slug')
  @ApiOperation({ summary: 'Get room details by slug' })
  @ApiParam({ name: 'slug', description: 'The unique slug of the room' })
  @ApiResponse({
    status: 200,
    description: 'Returns the room details.',
    type: RoomDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: User not in room' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getRoomBySlug(@Param('slug') slug: string, @Request() req): Promise<Room> {
    const userId = req.user.id;
    return this.roomService.getRoomDetailedInfo(slug, userId);
  }
}
