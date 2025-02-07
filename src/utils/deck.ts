import { type Card, type Hand, SUITS, RANKS, HandType, HAND_TYPES, PAY_TABLE } from "../types/cards";

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

export function dealNewHand(): { hand: Hand; remainingCards: Card[] } {
  const shuffled = shuffleDeck(createDeck());
  const hand = shuffled.slice(0, 5) as Hand; // We know this is safe since the deck has enough cards
  return {
    hand,
    remainingCards: shuffled.slice(5, 10),
  };
}

export interface HandEvaluation {
  type: HandType;
  winningIndices: number[];
}

export function evaluateHand(hand: Hand): HandEvaluation {
  // Sort by rank index for easier sequential checks
  const sortedHand = [...hand].sort(
    (a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank)
  );

  // Check for flush (all same suit)
  const isFlush = hand.every(card => card.suit === hand[0].suit);

  // Check for straight (sequential ranks)
  let isStraight = false;
  // Handle Ace-low straight (A,2,3,4,5) special case
  if (
    sortedHand[0].rank === "2" &&
    sortedHand[1].rank === "3" &&
    sortedHand[2].rank === "4" &&
    sortedHand[3].rank === "5" &&
    sortedHand[4].rank === "A"
  ) {
    isStraight = true;
  } else {
    // Normal straight check
    isStraight = sortedHand.every((card, i) => {
      if (i === 0) return true;
      return RANKS.indexOf(card.rank) === RANKS.indexOf(sortedHand[i - 1].rank) + 1;
    });
  }

  // Check for royal flush
  if (isFlush && isStraight && sortedHand[4].rank === "A" && sortedHand[0].rank === "10") {
    return { type: HAND_TYPES.ROYAL_FLUSH, winningIndices: [0, 1, 2, 3, 4] };
  }

  // Check for straight flush
  if (isFlush && isStraight) {
    return { type: HAND_TYPES.STRAIGHT_FLUSH, winningIndices: [0, 1, 2, 3, 4] };
  }

  // Count rank frequencies
  const rankFreq = new Map<string, number>();
  for (const card of hand) {
    rankFreq.set(card.rank, (rankFreq.get(card.rank) || 0) + 1);
  }
  const frequencies = Array.from(rankFreq.values());

  // Check for four of a kind
  if (frequencies.includes(4)) {
    const fourOfAKindRank = Array.from(rankFreq.entries()).find(([_, freq]) => freq === 4)![0];
    const winningIndices = hand.reduce<number[]>((indices, card, index) => {
      if (card.rank === fourOfAKindRank) indices.push(index);
      return indices;
    }, []);
    return { type: HAND_TYPES.FOUR_OF_A_KIND, winningIndices };
  }

  // Check for full house
  if (frequencies.includes(3) && frequencies.includes(2)) {
    return { type: HAND_TYPES.FULL_HOUSE, winningIndices: [0, 1, 2, 3, 4] };
  }

  // Check for flush
  if (isFlush) {
    return { type: HAND_TYPES.FLUSH, winningIndices: [0, 1, 2, 3, 4] };
  }

  // Check for straight
  if (isStraight) {
    return { type: HAND_TYPES.STRAIGHT, winningIndices: [0, 1, 2, 3, 4] };
  }

  // Check for three of a kind
  if (frequencies.includes(3)) {
    const threeOfAKindRank = Array.from(rankFreq.entries()).find(([_, freq]) => freq === 3)![0];
    const winningIndices = hand.reduce<number[]>((indices, card, index) => {
      if (card.rank === threeOfAKindRank) indices.push(index);
      return indices;
    }, []);
    return { type: HAND_TYPES.THREE_OF_A_KIND, winningIndices };
  }

  // Check for two pair
  if (frequencies.filter(f => f === 2).length === 2) {
    const pairRanks = Array.from(rankFreq.entries())
      .filter(([_, freq]) => freq === 2)
      .map(([rank]) => rank);
    const winningIndices = hand.reduce<number[]>((indices, card, index) => {
      if (pairRanks.includes(card.rank)) indices.push(index);
      return indices;
    }, []);
    return { type: HAND_TYPES.TWO_PAIR, winningIndices };
  }

  // Check for jacks or better
  const pairEntry = Array.from(rankFreq.entries()).find(
    ([rank, freq]) => freq === 2 && ["J", "Q", "K", "A"].includes(rank)
  );
  
  if (pairEntry) {
    const winningIndices = hand.reduce<number[]>((indices, card, index) => {
      if (card.rank === pairEntry[0]) indices.push(index);
      return indices;
    }, []);
    return { type: HAND_TYPES.JACKS_OR_BETTER, winningIndices };
  }

  return { type: HAND_TYPES.NOTHING, winningIndices: [] };
}

export function calculatePayout(handType: HandType, bet: number): number {
  return PAY_TABLE[handType] * bet;
}

export function replaceCards(
  currentHand: Hand,
  remainingCards: Card[],
  indicesToReplace: number[]
): Hand {
  const newHand = [...currentHand];
  indicesToReplace.forEach((index, i) => {
    newHand[index] = remainingCards[i];
  });
  return newHand as Hand;
}
