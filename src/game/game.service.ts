import { HttpException, Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GameChoice, GameResult, GameSign, GameStatus } from './game.types';
import { gameConstants, signsValuesMap } from './game.constants';
import { RoomService } from 'src/room/room.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly roomService: RoomService,
  ) {}

  async addPlayerToRoom(roomId: string, userId: number): Promise<void> {
    const connectedUsersCount =
      await this.roomService.getRoomUsersCount(roomId);

    if (connectedUsersCount >= gameConstants.PLAYERS_COUNT) {
      throw new WsException('Room is full');
    }

    await this.roomService.addUserToRoom(roomId, userId);
  }

  async handlePlayerChoice(
    roomId: string,
    userId: number,
    choice: GameSign,
  ): Promise<GameStatus> {
    const connectedUsersCount =
      await this.roomService.getRoomUsersCount(roomId);

    if (connectedUsersCount !== gameConstants.PLAYERS_COUNT) {
      throw new WsException('Room is not full');
    }
    
    await this.gameRepository.saveChoice(roomId, userId, choice);

    const choices = await this.gameRepository.getChoices(roomId);
    const usersThatChosen = choices.map((choice) => choice.userId);

    const data = { usersThatChosen, result: null };

    if (choices.length === gameConstants.PLAYERS_COUNT) {
      const result = this.getGameResult(choices);
      await this.gameRepository.resetChoices(roomId);
      data.result = result;
    }

    return data;
  }

  async getRoomStatus(roomId: string): Promise<GameStatus> {
    const choices = await this.gameRepository.getChoices(roomId);
    const gameStatus: GameStatus = {
      usersThatChosen: choices.map((choice) => choice.userId),
      result: null,
    };

    return gameStatus;
  }

  private getGameResult(choices: GameChoice[]): GameResult {
    const [firstChoice, secondChoice] = choices;
    const player1Choice = signsValuesMap[firstChoice.choice];
    const player2Choice = signsValuesMap[secondChoice.choice];

    const result =
      (gameConstants.SIGNS_COUNT + player1Choice - player2Choice) %
      gameConstants.SIGNS_COUNT;

    if (result === 1) {
      return {
        winnerId: firstChoice.userId,
        isTie: false,
        message: 'First player wins!',
      };
    } else if (result === 2) {
      return {
        winnerId: secondChoice.userId,
        isTie: false,
        message: 'Second player wins!',
      };
    } else {
      return {
        winnerId: null,
        isTie: true,
        message: 'Draw!',
      };
    }
  }
}
