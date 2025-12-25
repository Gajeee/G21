
import React from 'react';
import { Card } from '../types';
import { SuitIcon } from '../constants';

interface CardUIProps {
  card: Card;
  index: number;
  totalCards: number;
}

const CardUI: React.FC<CardUIProps> = ({ card, index, totalCards }) => {
  const cardOverlap = 30;
  const totalOffset = (totalCards - 1) * cardOverlap;
  const transform = `translateX(${index * cardOverlap - totalOffset / 2}px)`;

  // Elegant responsive card sizing
  const baseStyles = "w-24 h-36 md:w-36 md:h-52 rounded-xl md:rounded-2xl border flex flex-col shadow-2xl transition-all duration-700 ease-out absolute left-1/2 -ml-12 md:-ml-18";

  if (card.hidden) {
    return (
      <div 
        className={`${baseStyles} bg-[#080808] border-amber-500/20 overflow-hidden`}
        style={{ transform, zIndex: index }}
      >
        <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_1px,transparent_1px,transparent_15px)]" />
        <div className="absolute inset-2 border border-amber-500/10 rounded-lg flex items-center justify-center">
          <span className="text-amber-500/20 text-4xl md:text-6xl font-serif italic tracking-tighter select-none">21</span>
        </div>
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <div 
      className={`${baseStyles} bg-white border-zinc-200 p-2 md:p-4 animate-in slide-in-from-bottom-12 fade-in`}
      style={{ transform, zIndex: index }}
    >
      <div className="absolute inset-1 border border-zinc-100 rounded-lg md:rounded-xl pointer-events-none" />
      
      <div className="flex flex-col items-start leading-none relative z-10">
        <span className={`text-xl md:text-3xl font-black tracking-tighter ${isRed ? 'text-red-600' : 'text-zinc-900'}`}>{card.rank}</span>
        <SuitIcon suit={card.suit} className="text-sm md:text-xl mt-0.5 md:mt-1" />
      </div>
      
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="relative">
          <SuitIcon suit={card.suit} className="text-5xl md:text-8xl opacity-[0.04] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span className={`text-3xl md:text-5xl font-serif italic ${isRed ? 'text-red-500/10' : 'text-zinc-900/5'}`}>{card.rank}</span>
        </div>
      </div>

      <div className="flex flex-col items-end leading-none rotate-180 relative z-10">
        <span className={`text-xl md:text-3xl font-black tracking-tighter ${isRed ? 'text-red-600' : 'text-zinc-900'}`}>{card.rank}</span>
        <SuitIcon suit={card.suit} className="text-sm md:text-xl mt-0.5 md:mt-1" />
      </div>
    </div>
  );
};

export default CardUI;
