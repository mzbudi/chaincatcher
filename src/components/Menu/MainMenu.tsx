import { useState } from "react";
import Menu from "./Menu";
import GameCanvas from "../Game/GameCanvas";
import { useGameStore } from "../../store/useGameStore";

export default function MainMenu() {
  const [started, setStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const gameOver = useGameStore((state) => state.gameOver);

  const handleStart = () => {
    // playBackgroundMusic();
    setStarted(true);
    useGameStore.getState().setGameOver(false);
  };

  const handleBackToMenu = () => {
    setStarted(false);
    useGameStore.getState().setGameOver(false);
  };

  const handlePlayAgain = () => {
    useGameStore.getState().setGameOver(false);
    setGameKey((prevKey) => prevKey + 1); // Update game key untuk memicu rerender
  };
  return (
    <div className="App min-h-screen flex flex-col items-center justify-center">
      {!started && !gameOver ? (
        <>
          <Menu onStart={handleStart} />
        </>
      ) : (
        <>
          <GameCanvas key={gameKey} />

          {gameOver && (
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
              <button
                className="bg-gray-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
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
