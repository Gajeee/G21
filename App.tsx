
import React, { useState, useCallback, useEffect } from 'react';
import { 
  GameState, 
  GameStatus, 
  ResultType
} from './types';
import { 
  INITIAL_CHIPS
} from './constants';
import { 
  createDeck, 
  calculateHandValue, 
  isBlackjack 
} from './services/gameLogic';
import CardUI from './components/CardUI';
import { audio } from './services/audioService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    deck: createDeck(),
    playerHand: [],
    dealerHand: [],
    chips: INITIAL_CHIPS,
    currentBet: 0,
    status: GameStatus.BETTING,
    message: 'G21 MINIMAL',
    result: null,
    stats: { wins: 0, losses: 0, pushes: 0 }
  });

  const placeBet = (amount: number) => {
    if (state.chips < amount) return;
    audio.playChip();
    setState(prev => ({
      ...prev,
      currentBet: amount,
      status: GameStatus.DEALING,
      message: 'DEALING...'
    }));
    setTimeout(dealInitialCards, 800);
  };

  const dealInitialCards = useCallback(() => {
    audio.playDeal();
    const newDeck = [...state.deck];
    const playerHand = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand = [newDeck.pop()!, { ...newDeck.pop()!, hidden: true }];

    setState(prev => ({
      ...prev,
      deck: newDeck,
      playerHand,
      dealerHand,
      status: GameStatus.PLAYER_TURN,
      message: 'YOUR MOVE'
    }));

    if (isBlackjack(playerHand)) {
      handleStand(playerHand, dealerHand, newDeck);
    }
  }, [state.deck]);

  const handleHit = () => {
    audio.playDeal();
    const newDeck = [...state.deck];
    const newCard = newDeck.pop()!;
    const newHand = [...state.playerHand, newCard];
    const newValue = calculateHandValue(newHand);

    setState(prev => ({
      ...prev,
      deck: newDeck,
      playerHand: newHand,
      message: newValue > 21 ? 'BUST' : 'HIT OR STAND?'
    }));

    if (newValue > 21) {
      setTimeout(() => finalizeGame(ResultType.LOSS), 800);
    }
  };

  const handleStand = (pHand = state.playerHand, dHand = state.dealerHand, dck = state.deck) => {
    audio.playClick();
    setState(prev => ({ ...prev, status: GameStatus.DEALER_TURN, message: 'HOUSE TURN' }));
    
    let currentDealerHand = dHand.map(c => ({ ...c, hidden: false }));
    let currentDeck = [...dck];

    const playDealer = () => {
      const dealerValue = calculateHandValue(currentDealerHand);
      if (dealerValue < 17) {
        audio.playDeal();
        currentDealerHand.push(currentDeck.pop()!);
        setState(prev => ({ ...prev, dealerHand: [...currentDealerHand], deck: [...currentDeck] }));
        setTimeout(playDealer, 800);
      } else {
        evaluateWinner(pHand, currentDealerHand);
      }
    };

    setTimeout(playDealer, 600);
  };

  const evaluateWinner = (playerHand: any[], dealerHand: any[]) => {
    const pVal = calculateHandValue(playerHand);
    const dVal = calculateHandValue(dealerHand);
    const pBJ = isBlackjack(playerHand);
    const dBJ = isBlackjack(dealerHand);

    let result: ResultType;
    if (pVal > 21) result = ResultType.LOSS;
    else if (dVal > 21) result = ResultType.WIN;
    else if (pBJ && !dBJ) result = ResultType.BLACKJACK;
    else if (!pBJ && dBJ) result = ResultType.LOSS;
    else if (pVal > dVal) result = ResultType.WIN;
    else if (pVal < dVal) result = ResultType.LOSS;
    else result = ResultType.PUSH;

    finalizeGame(result);
  };

  const finalizeGame = (result: ResultType) => {
    if (result === ResultType.WIN || result === ResultType.BLACKJACK) audio.playWin();
    else if (result === ResultType.LOSS) audio.playLoss();
    else audio.playClick();

    let chipAdjustment = 0;
    let statUpdate = { ...state.stats };

    if (result === ResultType.WIN) {
      chipAdjustment = state.currentBet;
      statUpdate.wins++;
    } else if (result === ResultType.BLACKJACK) {
      chipAdjustment = Math.floor(state.currentBet * 1.5);
      statUpdate.wins++;
    } else if (result === ResultType.LOSS) {
      chipAdjustment = -state.currentBet;
      statUpdate.losses++;
    } else {
      statUpdate.pushes++;
    }

    setState(prev => ({
      ...prev,
      status: GameStatus.RESULTS,
      result,
      chips: prev.chips + chipAdjustment,
      stats: statUpdate,
      message: result === ResultType.WIN || result === ResultType.BLACKJACK ? 'WIN' : result === ResultType.LOSS ? 'LOSE' : 'PUSH'
    }));
  };

  const resetGame = () => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      status: GameStatus.BETTING,
      playerHand: [],
      dealerHand: [],
      currentBet: 0,
      result: null,
      message: 'G21 MINIMAL',
      deck: prev.deck.length < 15 ? createDeck() : prev.deck
    }));
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden flex flex-col items-center bg-[#020202] text-white selection:bg-amber-500/30">
      
      {/* Floating Minimal Header */}
      <header className="z-50 w-full max-w-6xl px-6 py-4 md:py-6 flex justify-between items-center pointer-events-none shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-3xl font-serif tracking-tighter text-amber-500 leading-none">G21</h1>
          <span className="text-[6px] uppercase tracking-[0.8em] text-zinc-800 mt-1 md:mt-2 font-black">STUDIO</span>
        </div>
        
        <div className="flex items-center gap-6 md:gap-16">
          <div className="flex flex-col items-end">
            <span className="text-[7px] uppercase tracking-[0.3em] text-zinc-600 font-black mb-0.5 md:mb-1">CHIPS</span>
            <span className="text-lg md:text-2xl font-light text-white">${state.chips.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end border-l border-zinc-900/50 pl-6 md:pl-8">
            <span className="text-[7px] uppercase tracking-[0.3em] text-zinc-600 font-black mb-0.5 md:mb-1">RECORD</span>
            <span className="text-xs md:text-sm font-mono text-amber-500/80">{state.stats.wins} : {state.stats.losses}</span>
          </div>
        </div>
      </header>

      {/* Main Play Area */}
      <main className="z-10 flex-grow w-full max-w-5xl flex flex-col items-center justify-between py-4 px-4 min-h-0">
        
        {/* Dealer Hand Area */}
        <div className="relative w-full flex justify-center items-center h-[20vh] md:h-[26vh] mb-4 md:mb-8">
          {state.dealerHand.length > 0 ? (
            state.dealerHand.map((card, i) => (
              <CardUI key={`dealer-${i}`} card={card} index={i} totalCards={state.dealerHand.length} />
            ))
          ) : (
            <div className="w-20 h-28 md:w-32 md:h-44 rounded-xl border border-zinc-900/40 flex items-center justify-center text-zinc-900 text-[8px] uppercase tracking-[0.5em] font-black border-dashed">Dealer</div>
          )}
        </div>

        {/* Dynamic Center Message & Pot */}
        <div className="flex flex-col items-center justify-center py-6 md:py-10 text-center z-20 shrink-0">
           {state.currentBet > 0 && (
             <div className="mb-4 px-4 py-1 border border-amber-500/10 rounded-full animate-in fade-in zoom-in duration-700">
               <span className="text-amber-500/60 text-[9px] md:text-[11px] uppercase tracking-[0.6em] font-black">
                 POT: ${state.currentBet}
               </span>
             </div>
           )}
           <h2 className="text-lg md:text-3xl font-light tracking-[0.8em] md:tracking-[1.2em] uppercase text-zinc-100/80 leading-tight">
             {state.message}
           </h2>
        </div>

        {/* Player Hand Area */}
        <div className="relative w-full flex justify-center items-center h-[20vh] md:h-[26vh] mt-4 md:mt-8">
          {state.playerHand.length > 0 ? (
            state.playerHand.map((card, i) => (
              <CardUI key={`player-${i}`} card={card} index={i} totalCards={state.playerHand.length} />
            ))
          ) : (
            <div className="w-20 h-28 md:w-32 md:h-44 rounded-xl border border-zinc-900/40 flex items-center justify-center text-zinc-900 text-[8px] uppercase tracking-[0.5em] font-black border-dashed">Player</div>
          )}
        </div>
      </main>

      {/* Action Bar */}
      <div className="z-50 w-full max-w-4xl px-8 pb-10 md:pb-16 mt-4 md:mt-8 flex items-center justify-center min-h-[80px] md:min-h-[120px] shrink-0">
        
        {/* Bet Selector */}
        {state.status === GameStatus.BETTING && (
          <div className="w-full flex flex-wrap justify-center gap-4 md:gap-10 animate-in slide-in-from-bottom-8 duration-700">
            {[10, 50, 100, 500].map(amt => (
              <button
                key={amt}
                onClick={() => placeBet(amt)}
                disabled={state.chips < amt}
                className="group relative w-14 h-14 md:w-22 md:h-22 flex items-center justify-center disabled:opacity-5 transition-all active:scale-90"
              >
                <div className="absolute inset-0 border-2 border-zinc-800 rounded-full group-hover:border-amber-500/40 group-hover:scale-110 transition-all" />
                <span className="relative text-xs md:text-xl font-black text-zinc-500 group-hover:text-amber-500 tracking-tighter">
                  ${amt}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Hit / Stand */}
        {state.status === GameStatus.PLAYER_TURN && (
          <div className="w-full max-w-sm flex gap-3 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={handleHit}
              className="flex-1 h-12 md:h-14 bg-transparent border border-zinc-800 text-zinc-500 rounded-xl text-[10px] md:text-sm uppercase tracking-[0.4em] font-black hover:text-white hover:border-zinc-500 transition-all active:scale-95"
            >
              Hit
            </button>
            <button 
              onClick={() => handleStand()}
              className="flex-1 h-12 md:h-14 bg-amber-500 text-black rounded-xl text-[10px] md:text-sm uppercase tracking-[0.4em] font-black hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
            >
              Stand
            </button>
          </div>
        )}

        {/* New Hand Button */}
        {state.status === GameStatus.RESULTS && (
          <div className="w-full max-w-[200px] animate-in zoom-in-95">
             <button 
              onClick={resetGame}
              className="w-full h-12 md:h-14 border border-amber-500/20 text-amber-500/80 rounded-xl text-[10px] md:text-xs uppercase tracking-[0.8em] font-black hover:bg-amber-500/10 transition-all active:scale-95"
            >
              NEW DEAL
            </button>
          </div>
        )}
      </div>

      {/* Explicit Studio Credit Footer */}
      <footer className="fixed bottom-4 w-full flex justify-center px-4 pointer-events-none z-0">
        <span className="text-[7px] md:text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-medium opacity-80">
          G21 – Made by Gajee & Ghub Studio
        </span>
      </footer>
    </div>
  );
};

export default App;
