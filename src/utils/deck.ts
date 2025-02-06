import { type Card, SUITS, RANKS } from "../types/cards";

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  const array = new Uint32Array(shuffled.length);
  crypto.getRandomValues(array);

  // Fisher-Yates shuffle with crypto random values
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function dealNewHand(): { hand: Card[]; remainingCards: Card[] } {
  const shuffled = shuffleDeck(createDeck());
  return {
    hand: shuffled.slice(0, 5),
    remainingCards: shuffled.slice(5, 10),
  };
}

export function replaceCards(
  currentHand: Card[],
  remainingCards: Card[],
  indicesToReplace: number[]
): Card[] {
  const newHand = [...currentHand];
  indicesToReplace.forEach((index, i) => {
    newHand[index] = remainingCards[i];
  });
  return newHand;
}
