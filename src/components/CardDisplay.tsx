import { type FC } from "react";
import { SUITS, RANKS } from "../types/cards";

interface CardDisplayProps {
  suit?: (typeof SUITS)[number];
  rank?: (typeof RANKS)[number];
  isSelected?: boolean;
  isWinning?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
}

const CardDisplay: FC<CardDisplayProps> = ({
  suit,
  rank,
  isSelected = false,
  isWinning = false,
  isRevealed = true,
  onClick,
}) => {
  // Colors for suits
  const suitColor =
    suit === "hearts" || suit === "diamonds" ? "text-red-500" : "text-black";

  return (
    <div className="relative w-full flex justify-center">
      {isSelected && (
        <div className="absolute -top-6 left-0 right-0 text-center font-bold text-white">
          HOLD
        </div>
      )}
      <div
        onClick={onClick}
        className={`
          w-full aspect-[2/3] max-w-[min(18vw,140px)] min-w-[60px] rounded-lg cursor-pointer transition-all transform scale-100 hover:scale-105
          ${isRevealed ? "bg-white" : "bg-blue-800"}
          ${isWinning ? "ring-4 ring-yellow-400" : "hover:ring-2 hover:ring-white/50"}
          flex items-center justify-center select-none
          relative
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
    </div>
  );
};

export default CardDisplay;