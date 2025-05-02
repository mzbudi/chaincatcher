import { useEffect } from "react";
import Phaser from "phaser";
import PhaserGame from "./PhaserGame"; // class Scene kamu

export default function GameCanvas() {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#ffa500",
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

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="w-full h-screen" />;
}
