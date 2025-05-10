import * as linera from "@linera/client";
import { useLineraStore } from "../store/useLineraStore";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const appId =
  "25195a1ec782630a51358c33183ea05d5b8bd927e8ce09274d352d2b7bfdcbbc";

export const initializeLinera = async () => {
  try {
    await linera.default();

    // const faucet = new linera.Faucet(
    //   "https://faucet.testnet-babbage.linera.net"
    // );
    // const wallet = await faucet.createWallet();
    // const client = await new linera.Client(wallet);
    // const chain = await faucet.claimChain(client);

    // await linera.default();

    const faucet = await new linera.Faucet("http://localhost:3000");
    const wallet = await faucet.createWallet();
    const client = await new linera.Client(wallet);
    const chain = await faucet.claimChain(client);

    await client.frontend().application(appId);

    console.log("Linera initialized successfully");
    console.log("Faucet:", faucet);
    console.log("Wallet:", wallet);
    console.log("Client:", client);
    console.log("Chain:", chain);
    // console.log("Counter:", counter);

    const gClient = new ApolloClient({
      uri: `http://localhost:8080/chains/8d031eb15ecc647fc5b4a471fb1cf312ae6686e697603295c71b2a978913a8bf/applications/25195a1ec782630a51358c33183ea05d5b8bd927e8ce09274d352d2b7bfdcbbc`,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
        },
      },
    });

    useLineraStore.getState().setLinera({
      client,
      chain,
      wallet,
      faucet,
      gClient,
      initialized: true,
    });
  } catch (error) {
    console.error("Error initializing Linera:", error);
  }
};

export const getValueGraphQL = async () => {
  const { gClient } = useLineraStore.getState();
  if (!gClient) {
    console.error("GraphQL client not initialized");
    return;
  }
  try {
    const response = await gClient.query({
      query: gql`
        query {
          value
        }
      `,
    });

    console.log("Scores retrieved successfully:", response);
    return response.data.scores;
  } catch (error) {
    console.error("Error retrieving scores:", error);
  }
};

export const getScoreGraphQL = async (name: string) => {
  const { gClient } = useLineraStore.getState();
  if (!gClient) {
    console.error("GraphQL client not initialized");
    return;
  }
  try {
    const response = await gClient.query({
      query: gql`
        query QueryRoot($name: String!) {
          score(name: $name)
        }
      `,
      variables: { name },
    });

    console.log("Score retrieved successfully:", response.data.score);
    return response.data.score;
  } catch (error) {
    console.error("Error retrieving score:", error);
  }
};

export const setScoreGraphQL = async (name: string, score: number) => {
  name = name || "mzbudi"; // Set default name if not provided
  score = score || 500; // Set default score if not provided
  const { gClient } = useLineraStore.getState();
  if (!gClient) {
    console.error("GraphQL client not initialized");
    return;
  }
  try {
    const response = await gClient.mutate({
      mutation: gql`
        mutation OperationMutationRoot($name: String!, $score: Int!) {
          setScore(name: $name, score: $score)
        }
      `,
      variables: { name, score },
    });

    console.log("Score set successfully:", response);
    // return response.data.setScore;
  } catch (error) {
    console.error("Error setting score:", error);
  }
};

// using linera client but keep getting ERROR blob_last_used_by{blob_id=BlobId or such, changing to graphql

// export const submitScore = async (score: number) => {
//   const { client, chain } = useLineraStore.getState();
//   if (!client || !chain) {
//     console.error("Client or chain not initialized");
//     return;
//   }
// console.log("Submitting score:", score);
// console.log("Client:", client);

// try {
//   const backend = await client.frontend().application(appId);

//   const response = await backend.query(
//     JSON.stringify({
//       query: `query { value }`,
//     })
//   );

//     console.log("Score submitted successfully:", response);
//     // return response;
//   } catch (error) {
//     console.error("Error submitting score:", error);
//   }
// };

// export const getScores = async () => {
//   const { client, chain } = useLineraStore.getState();
//   if (!client || !chain) {
//     console.error("Client or chain not initialized");
//     return;
//   }

//   try {
//     const backend = await client.frontend().application(appId);

//     const response = await backend.query(
//       '{ "query": "mutation { increment(value: 1) }" }'
//     );

//     console.log("Scores retrieved successfully:", response);
//     // return response;
//   } catch (error) {
//     console.error("Error retrieving scores:", error);
//   }
// };
