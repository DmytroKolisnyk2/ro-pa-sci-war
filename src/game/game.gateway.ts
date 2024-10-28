import {
  UseGuards,
  Logger,
  BadRequestException,
  NotFoundException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayDisconnect,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameService } from './game.service';
import { RoomMemberGuard } from './game.guard';
import { GetStatusDto, JoinRoomDto, MakeChoiceDto } from './game.dto';
import { AllWsExceptionsFilter } from './game.filter';

@UsePipes(ValidationPipe)
@UseFilters(AllWsExceptionsFilter)
@WebSocketGateway({})
@UseGuards(AuthGuard)
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  afterInit() {
    this.logger.log('Gateway initialized');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.gameService.addPlayerToRoom(data.roomSlug, client.user.id);
      await client.join(data.roomSlug);
      client.to(data.roomSlug).emit('userJoined', {
        userId: client.user.id,
        username: client.user.username,
      });
    } catch (error) {
      throw new BadRequestException('Failed to join room');
    }
  }

  @UseGuards(RoomMemberGuard)
  @SubscribeMessage('makeChoice')
  async handleMakeChoice(
    @MessageBody() data: MakeChoiceDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const gameStatus = await this.gameService.handlePlayerChoice(
        data.roomSlug,
        client.user.id,
        data.choice,
      );
      client.to(data.roomSlug).emit('gameStatus', gameStatus);
    } catch (error) {
      throw new NotFoundException('Room not found or invalid choice');
    }
  }

  @UseGuards(RoomMemberGuard)
  @SubscribeMessage('getStatus')
  async handleGetStatus(
    @MessageBody() data: GetStatusDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const status = await this.gameService.getRoomStatus(data.roomSlug);
      client.emit('gameStatus', status);
    } catch (error) {
      throw new NotFoundException('Room not found');
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.user.id;
      const rooms = Array.from(client.rooms);
      for (const room of rooms) {
        await this.gameService.removePlayerFromRoom(room, userId);
        client.to(room).emit('userLeft', { userId });
      }
    } catch (error) {
      this.logger.error(`Failed to remove user from room`, error);
    }
  }
}
