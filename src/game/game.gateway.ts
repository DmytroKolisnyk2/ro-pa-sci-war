import { Request, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameService } from './game.service';
import { GameSign } from './game.types';
import { RoomMemberGuard } from './game.guard';

@WebSocketGateway({})
@UseGuards(AuthGuard)
export class GameGateway implements OnGatewayInit {
  constructor(private readonly gameService: GameService) {}

  afterInit() {
    console.log('Gateway initialized');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomSlug: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.gameService.addPlayerToRoom(data.roomSlug, client.user.id);

    await client.join(data.roomSlug);
    console.log({
      userId: client.user.id,
      username: client.user.username,
    });

    client.to(data.roomSlug).emit('userJoined', {
      userId: client.user.id,
      username: client.user.username,
    });
  }

  @UseGuards(RoomMemberGuard)
  @SubscribeMessage('makeChoice')
  async handleMakeChoice(
    @MessageBody() data: { roomSlug: string; choice: GameSign },
    @ConnectedSocket() client: Socket,
  ) {
    const gameStatus = await this.gameService.handlePlayerChoice(
      data.roomSlug,
      client.user.id,
      data.choice,
    );

    client.to(data.roomSlug).emit('gameStatus', gameStatus);
  }

  @UseGuards(RoomMemberGuard)
  @SubscribeMessage('getStatus')
  async handleGetStatus(
    @MessageBody() data: { roomSlug: string },
    @ConnectedSocket() client: Socket,
  ) {
    const status = await this.gameService.getRoomStatus(data.roomSlug);
    client.emit('gameStatus', status);
  }
}
