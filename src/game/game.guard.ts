import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class RoomMemberGuard implements CanActivate {
  constructor(private readonly roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData();
    const roomSlug = data.roomSlug;
    const userId = context.switchToHttp().getRequest().user.id;

    const isMember = await this.roomService.isUserInRoom(roomSlug, userId);

    return isMember;
  }
}
