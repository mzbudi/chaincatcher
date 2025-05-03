// src/components/Game/GameCanvas.tsx
import { useEffect } from "react";
import Phaser from "phaser";
import PhaserGame from "./PhaserGame"; // class Scene kamu

interface GameCanvasProps {
  setGameOver: (gameOver: boolean) => void;
}

export default function GameCanvas({ setGameOver }: GameCanvasProps) {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: [PhaserGame],
      physics: {
        default: "arcade",
        arcade: {
          debug: true, // sementara true agar kita bisa lihat bounding box
        },
      },
    };

    const game = new Phaser.Game(config);
    game.events.once("ready", () => {
      const scene = game.scene.getScene("chain-catcher"); // scene key kamu
      scene.events.on("gameover", () => {
        console.log("Game Over");
        setGameOver(true);
      });
    });

    return () => {
      game.destroy(true);
    };
  }, [setGameOver]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        id="game-container"
        className="flex items-center justify-center w-[800px] h-[600px]"
      />
    </div>
  );
}
