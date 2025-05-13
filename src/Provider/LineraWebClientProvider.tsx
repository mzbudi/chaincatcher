import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as linera from "@linera/client";
import { Client, Wallet, Faucet, Application } from "@linera/client";

interface LineraCtx {
  client?: Client | null;
  chain?: string | null;
  wallet?: Wallet | null;
  faucet?: Faucet | null;
  application?: Application | null;
  status?: "Loading" | "Ready" | "Error";
  error?: Error;
}

let lineraInitialized = false;

const LineraContext = createContext<LineraCtx>({});

export const useLinera = () => useContext(LineraContext);

export const LineraProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<LineraCtx>({
    status: "Loading",
  });

  useEffect(() => {
    if (lineraInitialized) return;
    lineraInitialized = true;
    async function initLinera() {
      try {
        await linera.default();

        // const faucet = new linera.Faucet("http://localhost:8080");
        const faucet = new linera.Faucet(
          "https://faucet.testnet-babbage.linera.net"
        );
        const wallet = await faucet.createWallet();
        const client = await new linera.Client(wallet);
        const chain = await faucet.claimChain(client);
        console.log("Chain Id:", chain);

        const application = await client
          .frontend()
          .application(
            "24afe51575e6bd6add94f3dd45a2d6eaded5fbc29f538404af6dc3273219a3b6"
          );

        setState((prevState) => ({
          ...prevState,
          client,
          wallet,
          chain,
          application,
          status: "Ready",
        }));

        // const getValueWebClient = async () => {
        //   if (application && clientInstance) {
        //     try {
        //       const response = await application.query(
        //         '{ "query": "query { value }" }'
        //       );

        //       console.log("Value :", response);
        //     } catch (error) {
        //       console.error("Error retrieving scores:", error);
        //     }
        //   }
        // };

        // getValueWebClient();
      } catch (err) {
        console.error("Linera init error", err);
        setState((prevState) => ({
          ...prevState,
          status: "Error",
          error: err as Error,
        }));
      }
    }
    initLinera();
  }, []);

  return (
    <LineraContext.Provider value={state}>{children}</LineraContext.Provider>
  );
};
