import { useEffect } from "react";
import CardDisplay from "./components/CardDisplay";
import { useGameStore } from "./store/gameStore";
import { MAX_BET, MIN_BET } from "./types/cards";

function App() {
  const {
    balance,
    bet,
    hand,
    holdCards,
    isActive,
    dealCards,
    selectCard,
    incrementBet,
    decrementBet,
    result,
    creditsWon,
    winningIndices,
  } = useGameStore();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle number keys 1-5 for card selection
      if (/^[1-5]$/.test(event.key)) {
        const index = parseInt(event.key) - 1;
        selectCard(index);
      }
      // Handle spacebar for deal/draw
      if (event.code === "Space") {
        dealCards();
        event.preventDefault(); // Prevent page scroll
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, dealCards, selectCard]);

  return (
    <div className="h-screen w-screen bg-green-900 text-white p-4 md:p-8 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto space-y-4 md:space-y-8">
        {/* Header with title and balance */}
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Video Poker</h1>
          <div className="text-2xl">
            Credits: <span className="font-mono">{balance}</span>
          </div>
        </header>

        {/* Main game area */}
        <main className="space-y-8">
          {/* Cards display area */}
          <div className="w-full grid grid-cols-5 auto-cols-fr place-items-center justify-items-stretch gap-1 sm:gap-2 min-h-[120px] bg-green-800 rounded-xl p-2 sm:p-4 relative h-fit">
            {hand.length > 0
              ? hand.map((card, index) => (
                  <CardDisplay
                    key={`${card.suit}-${card.rank}`}
                    suit={card.suit}
                    rank={card.rank}
                    isSelected={holdCards[index]}
                    isWinning={isActive && winningIndices.includes(index)}
                    isRevealed={true}
                    onClick={() => isActive && selectCard(index)}
                  />
                ))
              : // Empty card slots
                Array.from({ length: 5 }).map((_, index) => (
                  <CardDisplay key={index} isRevealed={false} />
                ))}
          </div>

          {/* Game status */}
          <div className="flex justify-between items-center bg-green-800 rounded-xl p-4">
            <div className="text-xl font-bold">
              Hand: <span className={isActive ? "text-green-300/75" : "text-yellow-400"}>{result || ""}</span>
            </div>
            <div className="text-xl">
              Won: <span className="font-mono text-yellow-400">{creditsWon || 0}</span>
            </div>
          </div>

          {/* Game controls */}
          <div className="flex justify-between items-center bg-green-800 rounded-xl p-4">
            <div className="space-x-4">
              <button
                className={`${
                  isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50`}
                onClick={dealCards}
                disabled={!isActive && (balance < bet || bet < MIN_BET)}
              >
                {isActive ? "Draw" : "Deal"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-lg">Bet:</label>
              <button
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                onClick={decrementBet}
                disabled={isActive || bet <= MIN_BET}
              >
                -
              </button>
              <span className="font-mono text-xl">{bet}</span>
              <button
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                onClick={incrementBet}
                disabled={isActive || bet >= Math.min(balance, MAX_BET)}
              >
                +
              </button>
            </div>
          </div>

          {/* Hand result display */}
          <div className="text-center text-2xl font-bold h-12">
            {!isActive && (balance > 0 ? "Press DEAL to start game" : "No more credits")}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
