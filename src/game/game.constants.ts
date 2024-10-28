import { GameSign } from './game.types';

export const gameConstants = {
  PLAYERS_COUNT: 2,
  SIGNS_COUNT: 3,
};

export const signsValuesMap: Record<GameSign, number> = {
  [GameSign.Rock]: 0,
  [GameSign.Paper]: 1,
  [GameSign.Scissors]: 2,
};
