
import React from 'react';

export const INITIAL_CHIPS = 1000;
export const MIN_BET = 10;

export const SuitIcon = ({ suit, className }: { suit: string, className?: string }) => {
  switch (suit) {
    case 'hearts':
      return <span className={`text-red-500 ${className}`}>♥</span>;
    case 'diamonds':
      return <span className={`text-red-500 ${className}`}>♦</span>;
    case 'clubs':
      return <span className={`text-white ${className}`}>♣</span>;
    case 'spades':
      return <span className={`text-white ${className}`}>♠</span>;
    default:
      return null;
  }
};
