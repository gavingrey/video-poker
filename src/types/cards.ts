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

export interface Card {
  suit: (typeof SUITS)[number];
  rank: (typeof RANKS)[number];
}