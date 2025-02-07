import { create } from "zustand";
import { Hand, HandType, MAX_BET, MIN_BET, type Card } from "../types/cards";
import type { HandEvaluation } from "../utils/deck";
import { calculatePayout, dealNewHand, evaluateHand } from "../utils/deck";

// Tuple type for hold cards - always 5 boolean values
type HoldCards = [boolean, boolean, boolean, boolean, boolean];

interface GameState {
  balance: number;
  bet: number;
  hand: Hand;
  deck: Card[];
  holdCards: HoldCards;
  isActive: boolean;
  result?: HandType;
  winningIndices: number[];
  creditsWon?: number;

  // Actions
  incrementBet: () => void;
  decrementBet: () => void;
  dealCards: () => void;
  selectCard: (index: number) => void;
}

function dealCards(state: GameState): Partial<GameState> {
  const { hand, remainingCards } = dealNewHand();
  const { type, winningIndices } = evaluateHand(hand);
  return {
    hand,
    deck: remainingCards,
    isActive: true,
    holdCards: [false, false, false, false, false],
    result: type,
    winningIndices,
    balance: state.balance - state.bet,
    creditsWon: undefined,
  }
}

function drawCards(state: GameState): Partial<GameState> {
  // Create copies of current hand and deck
  const newHand = [...state.hand] as Hand;
  const newDeck = [...state.deck];
  
  // Replace non-held cards with new ones from deck
  state.holdCards.forEach((isHeld, index) => {
    if (!isHeld && newDeck.length > 0) {
      newHand[index] = newDeck.shift()!;
    }
  });

  // Calculate the payout
  const handEvaluation = evaluateHand(newHand);
  const payout = calculatePayout(handEvaluation.type, state.bet);
  const newBalance = state.balance + payout;
  
  return {
    hand: newHand,
    deck: newDeck,
    holdCards: [false, false, false, false, false],
    isActive: false,
    result: handEvaluation.type,
    winningIndices: handEvaluation.winningIndices,
    balance: newBalance,
    creditsWon: payout,
    bet: Math.min(newBalance, state.bet),
  };
}

export const useGameStore = create<GameState>((set) => ({
  balance: 100,
  bet: 1,
  hand: dealNewHand().hand,
  deck: [],
  holdCards: [false, false, false, false, false],
  isActive: false,
  winningIndices: [],

  incrementBet: () =>
    set((state) => ({
      bet: Math.min(state.bet + 1, state.balance, MAX_BET),
    })),

  decrementBet: () =>
    set((state) => ({
      bet: state.balance <= 0 ? 0 : Math.max(MIN_BET, state.bet - 1),
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
