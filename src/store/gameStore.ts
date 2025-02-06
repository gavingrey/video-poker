import { create } from "zustand";
import { type Card } from "../types/cards";
import { dealNewHand } from "../utils/deck";

// Tuple type for hold cards - always 5 boolean values
type HoldCards = [boolean, boolean, boolean, boolean, boolean];

interface GameState {
  balance: number;
  bet: number;
  hand: Card[];
  deck: Card[];
  holdCards: HoldCards;
  isActive: boolean;

  // Actions
  incrementBet: () => void;
  decrementBet: () => void;
  dealCards: () => void;
  selectCard: (index: number) => void;
}

function dealCards(state: GameState): Partial<GameState> {
  const { hand, remainingCards } = dealNewHand();
  return {
    hand,
    deck: remainingCards,
    isActive: true,
    holdCards: [false, false, false, false, false]
  }
}

function drawCards(state: GameState): Partial<GameState> {
  // Create copies of current hand and deck
  const newHand = [...state.hand];
  const newDeck = [...state.deck];
  
  // Replace non-held cards with new ones from deck
  state.holdCards.forEach((isHeld, index) => {
    if (!isHeld && newDeck.length > 0) {
      newHand[index] = newDeck.shift()!;
    }
  });
  
  return {
    hand: newHand,
    deck: newDeck,
    holdCards: [false, false, false, false, false],
    isActive: false
  };
}

export const useGameStore = create<GameState>((set) => ({
  balance: 1000,
  bet: 5,
  hand: [],
  deck: [],
  holdCards: [false, false, false, false, false],
  isActive: false,

  incrementBet: () =>
    set((state) => ({
      bet: Math.min(state.bet + 5, state.balance),
    })),

  decrementBet: () =>
    set((state) => ({
      bet: Math.max(5, state.bet - 5),
    })),

  dealCards: () => {
    set((state) => state.isActive ? drawCards(state) : dealCards(state));
  },

  selectCard: (index) =>
    set((state) => {
      const newHoldCards = [...state.holdCards] as HoldCards;
      newHoldCards[index] = !newHoldCards[index];
      return { holdCards: newHoldCards };
    }),

}));
