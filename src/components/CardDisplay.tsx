import { type FC } from "react";
import { SUITS, RANKS } from "../types/cards";

interface CardDisplayProps {
  suit?: (typeof SUITS)[number];
  rank?: (typeof RANKS)[number];
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
}

const CardDisplay: FC<CardDisplayProps> = ({
  suit,
  rank,
  isSelected = false,
  isRevealed = true,
  onClick,
}) => {
  // Colors for suits
  const suitColor =
    suit === "hearts" || suit === "diamonds" ? "text-red-500" : "text-black";

  return (
    <div
      onClick={onClick}
      className={`
        w-32 h-48 rounded-lg cursor-pointer transition-all
        ${isRevealed ? "bg-white" : "bg-blue-800"}
        ${
          isSelected ? "ring-4 ring-yellow-400" : "hover:ring-2 hover:ring-white/50"
        }
        flex items-center justify-center select-none
      `}
    >
      {isRevealed && suit && rank ? (
        <div className={`${suitColor} text-2xl font-bold text-center`}>
          <div>{rank}</div>
          <div className="mt-2">
            {suit === "hearts" && "♥"}
            {suit === "diamonds" && "♦"}
            {suit === "clubs" && "♣"}
            {suit === "spades" && "♠"}
          </div>
        </div>
      ) : (
        <div className="text-white/80">{isRevealed ? "" : "🎴"}</div>
      )}
    </div>
  );
};

export default CardDisplay;