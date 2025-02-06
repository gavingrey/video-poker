export const SUITS = ["hearts", "diamonds", "clubs", "spades"] as const;
export const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export const HAND_TYPES = {
  NOTHING: "",
  JACKS_OR_BETTER: "Jacks or Better",
  TWO_PAIR: "Two Pair",
  THREE_OF_A_KIND: "Three of a Kind",
  STRAIGHT: "Straight",
  FLUSH: "Flush",
  FULL_HOUSE: "Full House",
  FOUR_OF_A_KIND: "Four of a Kind",
  STRAIGHT_FLUSH: "Straight Flush",
  ROYAL_FLUSH: "Royal Flush",
} as const;

export const MIN_BET = 1;
export const MAX_BET = 5;

export const PAY_TABLE = {
  [HAND_TYPES.NOTHING]: 0,
  [HAND_TYPES.JACKS_OR_BETTER]: 1,
  [HAND_TYPES.TWO_PAIR]: 2,
  [HAND_TYPES.THREE_OF_A_KIND]: 3,
  [HAND_TYPES.STRAIGHT]: 4,
  [HAND_TYPES.FLUSH]: 6,
  [HAND_TYPES.FULL_HOUSE]: 9,
  [HAND_TYPES.FOUR_OF_A_KIND]: 25,
  [HAND_TYPES.STRAIGHT_FLUSH]: 50,
  [HAND_TYPES.ROYAL_FLUSH]: 800,
}

export type HandType = typeof HAND_TYPES[keyof typeof HAND_TYPES];

export interface Card {
  suit: (typeof SUITS)[number];
  rank: (typeof RANKS)[number];
}

export type Hand = [Card, Card, Card, Card, Card];