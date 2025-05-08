import * as linera from "@linera/client";
import { useLineraStore } from "../store/useLineraStore";

export const initializeLinera = async () => {
  try {
    await linera.default();

    // const faucet = new linera.Faucet(
    //   "https://faucet.testnet-babbage.linera.net"
    // );
    // const wallet = await faucet.createWallet();
    // const client = await new linera.Client(wallet);
    // const chain = await faucet.claimChain(client);

    await linera.default();
    const faucet = await new linera.Faucet(
      "https://faucet.testnet-babbage.linera.net"
    );
    const wallet = await faucet.createWallet();
    const client = await new linera.Client(wallet);
    const chain = await faucet.claimChain(client);
    // const counter = await client
    //   .frontend()
    //   .application(
    //     "cd57a3fcf3139773e4d891f889ba3c7cab0a6ae100b3c68eb1221806bd2a2420"
    //   );

    console.log("Linera initialized successfully");
    console.log("Faucet:", faucet);
    console.log("Wallet:", wallet);
    console.log("Client:", client);
    console.log("Chain:", chain);
    // console.log("Counter:", counter);

    useLineraStore.getState().setLinera({
      client,
      chain,
      wallet,
      faucet,
      initialized: true,
    });
  } catch (error) {
    console.error("Error initializing Linera:", error);
  }
};
