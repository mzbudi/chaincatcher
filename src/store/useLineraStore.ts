import { create } from "zustand";
import { Client, Wallet, Faucet } from "@linera/client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

type LineraStore = {
  client: Client | null;
  chain: string | null;
  wallet: Wallet | null;
  faucet: Faucet | null;
  gClient: ApolloClient<NormalizedCacheObject> | null;
  initialized: boolean;
  setLinera: (data: {
    client: Client;
    chain: string;
    wallet: Wallet;
    faucet: Faucet;
    gClient: ApolloClient<NormalizedCacheObject> | null;
    initialized?: boolean;
  }) => void;
  setChainId: (chainId: string, initialized: boolean) => void;
};

export const useLineraStore = create<LineraStore>((set) => ({
  client: null,
  chain: null,
  wallet: null,
  faucet: null,
  gClient: null,
  initialized: false,
  setLinera: ({ client, chain, wallet, faucet, gClient, initialized }) =>
    set({ client, chain, wallet, faucet, gClient, initialized }),
  setChainId: (chainId, initialized) =>
    set({ chain: chainId, initialized: initialized }),
}));
