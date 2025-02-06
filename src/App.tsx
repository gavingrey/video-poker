import CardDisplay from "./components/CardDisplay";
import { useGameStore } from "./store/gameStore";

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
  } = useGameStore();

  return (
    <div className="min-h-screen bg-green-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
          <div className="flex justify-center gap-4 min-h-[200px] bg-green-800 rounded-xl p-4">
            {hand.length > 0
              ? hand.map((card, index) => (
                  <CardDisplay
                    key={`${card.suit}-${card.rank}`}
                    suit={card.suit}
                    rank={card.rank}
                    isSelected={holdCards[index]}
                    isRevealed={true}
                    onClick={() => isActive && selectCard(index)}
                  />
                ))
              : // Empty card slots
                Array.from({ length: 5 }).map((_, index) => (
                  <CardDisplay key={index} isRevealed={false} />
                ))}
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
                disabled={!isActive && balance < bet}
              >
                {isActive ? "Draw" : "Deal"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-lg">Bet:</label>
              <button
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                onClick={decrementBet}
                disabled={isActive || bet <= 5}
              >
                -
              </button>
              <span className="font-mono text-xl">{bet}</span>
              <button
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                onClick={incrementBet}
                disabled={isActive || bet >= balance}
              >
                +
              </button>
            </div>
          </div>

          {/* Hand result display */}
          <div className="text-center text-2xl font-bold h-12">
            Placeholder
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
