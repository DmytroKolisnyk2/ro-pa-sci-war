export enum GameSign { 
  Rock = 'r',
  Paper = 'p',
  Scissors = 's'
}

export interface GameChoice { 
  userId: number;
  choice: GameSign;
}

export interface GameResult { 
  winnerId: number | null;
  isTie: boolean;
  message: string;
}

export interface GameStatus {
  result: GameResult | null;
  usersThatChosen: number[];
}