import { describe, it, expect } from 'vitest';
import { SUITS, RANKS, HAND_TYPES, type Card, type Hand } from '../types/cards';
import { dealNewHand, evaluateHand, calculatePayout } from '../utils/deck';

describe('Deck Operations', () => {
  it('deals unique cards in new hands', () => {
    // Test multiple hands to ensure consistent uniqueness
    for (let i = 0; i < 100; i++) {
      const { hand, remainingCards } = dealNewHand();
      const allCards = [...hand, ...remainingCards];
      
      // Check for duplicates
      const seen = new Set<string>();
      for (const card of allCards) {
        const cardString = `${card.rank}-${card.suit}`;
        expect(seen.has(cardString)).toBe(false);
        seen.add(cardString);
      }

      // Verify hand size
      expect(hand.length).toBe(5);
      expect(remainingCards.length).toBe(5);
    }
  });

  it('correctly evaluates royal flush', () => {
    const royalFlush: Hand = [
      { suit: 'hearts', rank: '10' },
      { suit: 'hearts', rank: 'J' },
      { suit: 'hearts', rank: 'Q' },
      { suit: 'hearts', rank: 'K' },
      { suit: 'hearts', rank: 'A' },
    ] as Hand;

    const result = evaluateHand(royalFlush);
    expect(result.type).toBe(HAND_TYPES.ROYAL_FLUSH);
    expect(result.winningIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('correctly evaluates straight flush', () => {
    const straightFlush: Hand = [
      { suit: 'clubs', rank: '5' },
      { suit: 'clubs', rank: '6' },
      { suit: 'clubs', rank: '7' },
      { suit: 'clubs', rank: '8' },
      { suit: 'clubs', rank: '9' },
    ] as Hand;

    const result = evaluateHand(straightFlush);
    expect(result.type).toBe(HAND_TYPES.STRAIGHT_FLUSH);
    expect(result.winningIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('correctly evaluates four of a kind', () => {
    const fourOfAKind: Hand = [
      { suit: 'hearts', rank: 'K' },
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: 'K' },
      { suit: 'spades', rank: 'K' },
      { suit: 'hearts', rank: '2' },
    ] as Hand;

    const result = evaluateHand(fourOfAKind);
    expect(result.type).toBe(HAND_TYPES.FOUR_OF_A_KIND);
    expect(result.winningIndices).toEqual([0, 1, 2, 3]);
  });

  it('correctly evaluates full house', () => {
    const fullHouse: Hand = [
      { suit: 'hearts', rank: 'J' },
      { suit: 'diamonds', rank: 'J' },
      { suit: 'clubs', rank: 'J' },
      { suit: 'spades', rank: '4' },
      { suit: 'hearts', rank: '4' },
    ] as Hand;

    const result = evaluateHand(fullHouse);
    expect(result.type).toBe(HAND_TYPES.FULL_HOUSE);
    expect(result.winningIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('correctly evaluates ace-low straight', () => {
    const aceLowStraight: Hand = [
      { suit: 'hearts', rank: '2' },
      { suit: 'diamonds', rank: '3' },
      { suit: 'clubs', rank: '4' },
      { suit: 'spades', rank: '5' },
      { suit: 'hearts', rank: 'A' },
    ] as Hand;

    const result = evaluateHand(aceLowStraight);
    expect(result.type).toBe(HAND_TYPES.STRAIGHT);
    expect(result.winningIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('correctly calculates payouts', () => {
    // Test a few key hand types with different bet amounts
    expect(calculatePayout(HAND_TYPES.ROYAL_FLUSH, 5)).toBe(4000); // 800 * 5
    expect(calculatePayout(HAND_TYPES.STRAIGHT_FLUSH, 3)).toBe(150); // 50 * 3
    expect(calculatePayout(HAND_TYPES.FOUR_OF_A_KIND, 2)).toBe(50); // 25 * 2
    expect(calculatePayout(HAND_TYPES.FULL_HOUSE, 4)).toBe(36); // 9 * 4
    expect(calculatePayout(HAND_TYPES.NOTHING, 5)).toBe(0); // 0 * 5
  });
});