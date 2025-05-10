import { create } from "zustand";

type GameStore = {
  gameOver: boolean;
  gameScore: number;
  nickname: string;
  highScore: number;
  setHighScore: (highScore: number) => void;
  setGameOver: (gameOver: boolean) => void;
  setGameScore: (gameScore: number) => void;
  setNickname: (nickname: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  gameOver: false,
  gameScore: 0,
  nickname: "",
  highScore: 0,
  setHighScore: (highScore: number) => set({ highScore }),
  setGameOver: (gameOver: boolean) => set({ gameOver }),
  setGameScore: (gameScore: number) => set({ gameScore }),
  setNickname: (nickname: string) => set({ nickname }),
}));
