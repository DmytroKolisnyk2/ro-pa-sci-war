import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createRoom(
    @Request() req,
  ) {
    return this.roomService.createRoom(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('created')
  getMyRoom(@Request() req) {
    return this.roomService.getUserRoom(req.user.id);
  }
}
