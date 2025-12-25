
import { Card, Suit, Rank } from '../types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = parseInt(rank);
      if (rank === 'A') value = 11;
      else if (['J', 'Q', 'K'].includes(rank)) value = 10;
      
      deck.push({ suit, rank, value });
    }
  }
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.hidden) continue;
    value += card.value;
    if (card.rank === 'A') aces += 1;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

export const isBlackjack = (hand: Card[]): boolean => {
  return hand.length === 2 && calculateHandValue(hand) === 21;
};
