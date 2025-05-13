// src/components/Game/GameCanvas.tsx
import { useEffect } from "react";
import Phaser from "phaser";
import PhaserGame from "./PhaserGame";
// import { setScoreWebClient } from "../../api/linera";

import { useGameStore } from "../../store/useGameStore";
import { useLinera } from "../../Provider/LineraWebClientProvider";

const configPcCanvas: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: window.innerHeight,
  parent: "game-container",
  scene: [PhaserGame],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
};

const configMobileCanvas: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  scene: [PhaserGame],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: Math.min(window.innerWidth, 800),
    height: window.innerHeight,
  },
};

export default function GameCanvas() {
  const nickname = useGameStore((state) => state.nickname);
  const { client, application } = useLinera();

  useEffect(() => {
    const isMobile = window.innerWidth < 800;
    const config = isMobile ? configMobileCanvas : configPcCanvas;

    const setScoreWebClient = async (name: string, score: number) => {
      if (application && client) {
        console.log("Submitting score:", score);
        console.log("Client:", client);

        try {
          const response = await application.query(
            JSON.stringify({
              query: `
        mutation SetScore($name: String!, $score: Int!) {
          setScore(name: $name, score: $score)
        }
      `,
              variables: {
                name: name,
                score: score,
              },
            })
          );

          // Jika kamu ingin mengambil hasilnya:
          const result = JSON.parse(response);
          console.log(result.data.setScore);

          console.log("Score submitted successfully:", response);
          return result;
        } catch (error) {
          console.error("Error submitting score:", error);
        }
      }
    };

    const game = new Phaser.Game(config);

    game.events.once("ready", () => {
      const scene = game.scene.getScene("chain-catcher");
      scene.events.on("gameover", async (payload: { score: number }) => {
        const { score } = payload;
        console.log("Game Over, Score: ", score);

        // await setScoreGraphQL(nickname, score);
        // console.log("Score submitted successfully");

        const response = await setScoreWebClient(nickname, score);
        console.log("Score submitted successfully", response);

        useGameStore.getState().setGameScore(score);
        useGameStore.getState().setGameOver(true);
      });
    });

    const handleResize = () => {
      game.scale.resize(Math.max(window.innerWidth, 800), window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
    };
  }, [nickname, application, client]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        id="game-container"
        className="flex items-center justify-center
        w-full h-full"
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      />
    </div>
  );
}
