import { create } from "zustand";

type GameStore = {
  gameOver: boolean;
  gameScore: number;
  nickname: string;
};

export const useGameStore = create<GameStore>((set) => ({
  gameOver: false,
  gameScore: 0,
  nickname: "",
  setGameOver: (gameOver: boolean) => set({ gameOver }),
  setGameScore: (gameScore: number) => set({ gameScore }),
  setNickname: (nickname: string) => set({ nickname }),
}));
