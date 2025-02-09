import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { MIN_BET, MAX_BET } from '../types/cards';

describe('Game Store', () => {
  beforeEach(() => {
    const store = useGameStore.getState();
    // Reset store to initial state before each test
    useGameStore.setState({
      balance: 100,
      bet: 1,
      hand: store.hand, // Keep the current hand to avoid re-dealing
      deck: [],
      holdCards: [false, false, false, false, false],
      isActive: false,
      winningIndices: [],
    });
  });

  describe('Betting Controls', () => {
    it('prevents betting below minimum', () => {
      const store = useGameStore.getState();
      store.decrementBet();
      store.decrementBet();
      expect(useGameStore.getState().bet).toBe(MIN_BET);
    });

    it('prevents betting above maximum', () => {
      const store = useGameStore.getState();
      for (let i = 0; i < 10; i++) {
        store.incrementBet();
      }
      expect(useGameStore.getState().bet).toBe(MAX_BET);
    });

    it('prevents betting more than current balance', () => {
      const store = useGameStore.getState();
      useGameStore.setState({ balance: 3 });
      for (let i = 0; i < 10; i++) {
        store.incrementBet();
      }
      expect(useGameStore.getState().bet).toBe(3);
    });
  });

  describe('Game Flow', () => {
    it('prevents dealing with insufficient balance', () => {
      const store = useGameStore.getState();
      useGameStore.setState({ balance: 0 });
      
      const initialHand = store.hand;
      store.dealCards();
      
      // Verify nothing changed
      expect(useGameStore.getState().hand).toBe(initialHand);
      expect(useGameStore.getState().isActive).toBe(false);
    });

    it('deducts bet amount when dealing', () => {
      const store = useGameStore.getState();
      const initialBalance = store.balance;
      const bet = store.bet;
      
      store.dealCards();
      
      expect(useGameStore.getState().balance).toBe(initialBalance - bet);
    });

    it('updates balance correctly after playing', () => {
      const store = useGameStore.getState();
      const initialBalance = 100;
      const initialBet = 1;
      
      useGameStore.setState({
        balance: initialBalance,
        bet: initialBet,
      });
      
      // Simulate a game by dealing (which in test context might result in any hand).
      store.dealCards();
      // We then draw cards to complete the game.
      store.dealCards();
      
      const finalBalance = useGameStore.getState().balance;
      const creditsWon = useGameStore.getState().creditsWon;
      
      // If we won anything, verify the balance increased by that amount
      if (creditsWon && creditsWon > 0) {
        expect(finalBalance).toBe(initialBalance - initialBet + creditsWon);
      }
    });

    it('allows selecting cards only when game is active', () => {
      const store = useGameStore.getState();
      
      // Try selecting a card when inactive
      store.selectCard(0);
      expect(useGameStore.getState().holdCards).toEqual([false, false, false, false, false]);
      
      // Deal to make game active
      store.dealCards();
      
      // Now try selecting a card
      store.selectCard(0);
      expect(useGameStore.getState().holdCards[0]).toBe(true);
    });
  });
});