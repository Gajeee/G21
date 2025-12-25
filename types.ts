
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  hidden?: boolean;
}

export enum GameStatus {
  BETTING = 'BETTING',
  DEALING = 'DEALING',
  PLAYER_TURN = 'PLAYER_TURN',
  DEALER_TURN = 'DEALER_TURN',
  RESULTS = 'RESULTS'
}

export enum ResultType {
  WIN = 'WIN',
  LOSS = 'LOSS',
  PUSH = 'PUSH',
  BLACKJACK = 'BLACKJACK'
}

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  chips: number;
  currentBet: number;
  status: GameStatus;
  message: string;
  result: ResultType | null;
  stats: {
    wins: number;
    losses: number;
    pushes: number;
  };
}
