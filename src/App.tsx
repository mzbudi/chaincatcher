import { useState } from "react";
import Menu from "./components/Menu/Menu";
import GameCanvas from "./components/Game/GameCanvas";

function App() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = () => {
    setStarted(true);
    setGameOver(false); // Reset game over state jika mulai permainan baru
  };

  const handleBackToMenu = () => {
    setStarted(false);
    setGameOver(false); // Reset game over state jika kembali ke menu
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setGameKey((prevKey) => prevKey + 1); // Update game key untuk memicu rerender
  };

  return (
    <div className="App min-h-screen bg-orange-200 flex flex-col items-center justify-center">
      {!started && !gameOver ? (
        <Menu onStart={handleStart} />
      ) : (
        <>
          <GameCanvas key={gameKey} setGameOver={setGameOver} />

          {gameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <button
                className="bg-blue-500 text-white p-4 rounded"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
              <button
                className="bg-gray-500 text-white p-4 rounded ml-2"
                onClick={handleBackToMenu}
              >
                Back to Menu
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
