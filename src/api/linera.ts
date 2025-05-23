// This file is shutdown due to webclient-zustand issue. now all of init move to provider.

// import * as linera from "@linera/client";
// import { useLineraStore } from "../store/useLineraStore";

// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { gql } from "@apollo/client";

/**
 * Hosted Counter AppId
 */
// const appId =
//   "2b1a0df8868206a4b7d6c2fdda911e4355d6c0115b896d4947ef8e535ee3c6b8";

/**
 * My deployed App Id
 */
// const appId =
//   "24afe51575e6bd6add94f3dd45a2d6eaded5fbc29f538404af6dc3273219a3b6";

// export const initializeLinera = async () => {
//   try {
//     await linera.default();

//     const faucet = new linera.Faucet(
//       "https://faucet.testnet-babbage.linera.net"
//     );
    // const faucet = await new linera.Faucet("http://localhost:3000");
    // const wallet = await faucet.createWallet();
    // const client = await new linera.Client(wallet);
    // const chain = await faucet.claimChain(client);

    // console.log("Linera initialized successfully");
    // console.log("Faucet:", faucet);
    // console.log("Wallet:", wallet);
    // console.log("Client:", client);
    // console.log("Chain:", chain);

    // const gClient = new ApolloClient({
    //   uri: `http://localhost:8080/chains/0b41858cc4b27876eef3f676d99f9e9b2e64ac428ee1cebd78c90c5beb7b73cc/applications/24afe51575e6bd6add94f3dd45a2d6eaded5fbc29f538404af6dc3273219a3b6`,
    //   cache: new InMemoryCache(),
    //   defaultOptions: {
    //     watchQuery: {
    //       fetchPolicy: "no-cache",
    //     },
    //   },
    // });

//     useLineraStore.getState().setLinera({
//       client,
//       chain,
//       wallet,
//       faucet,
//       // gClient,
//       initialized: true,
//     });
//   } catch (error) {
//     console.error("Error initializing Linera:", error);
//   }
// };

/**
 * GraphQL Section, turned off and using web client.
 */

// export const getValueGraphQL = async () => {
//   const { gClient } = useLineraStore.getState();
//   if (!gClient) {
//     console.error("GraphQL client not initialized");
//     return;
//   }
//   try {
//     const response = await gClient.query({
//       query: gql`
//         query QueryRoot {
//           value
//         }
//       `,
//     });

//     console.log("Scores retrieved successfully:", response);
//     return response.data.scores;
//   } catch (error) {
//     console.error("Error retrieving scores:", error);
//   }
// };

// export const getScoreGraphQL = async (name: string) => {
//   const { gClient } = useLineraStore.getState();
//   if (!gClient) {
//     console.error("GraphQL client not initialized");
//     return;
//   }
//   try {
//     const response = await gClient.query({
//       query: gql`
//         query QueryRoot($name: String!) {
//           score(name: $name)
//         }
//       `,
//       variables: { name },
//     });

//     console.log("Score retrieved successfully:", response.data.score);
//     return response.data.score;
//   } catch (error) {
//     console.error("Error retrieving score:", error);
//   }
// };

// export const setScoreGraphQL = async (name: string, score: number) => {
//   name = name || "mzbudi"; // Set default name if not provided
//   score = score || 500; // Set default score if not provided
//   const { gClient } = useLineraStore.getState();
//   if (!gClient) {
//     console.error("GraphQL client not initialized");
//     return;
//   }
//   try {
//     const response = await gClient.mutate({
//       mutation: gql`
//         mutation OperationMutationRoot($name: String!, $score: Int!) {
//           setScore(name: $name, score: $score)
//         }
//       `,
//       variables: { name, score },
//     });

//     console.log("Score set successfully:", response);
//     // return response.data.setScore;
//   } catch (error) {
//     console.error("Error setting score:", error);
//   }
// };

// using linera client but keep getting ERROR blob_last_used_by{blob_id=BlobId or such, changing to graphql

// export const setScoreWebClient = async (name: string, score: number) => {
//   const { client, chain } = useLineraStore.getState();
//   if (!client || !chain) {
//     console.error("Client or chain not initialized");
//     return;
//   }
//   console.log("Submitting score:", score);
//   console.log("Client:", client);

//   try {
//     const backend = await client.frontend().application(appId);

//     const response = await backend.query(
//       JSON.stringify({
//         query: `
//       mutation SetScore($name: String!, $score: Int!) {
//         setScore(name: $name, score: $score)
//       }
//     `,
//         variables: {
//           name: name,
//           score: score,
//         },
//       })
//     );

//     // Jika kamu ingin mengambil hasilnya:
//     const result = JSON.parse(response);
//     console.log(result.data.setScore);

//     console.log("Score submitted successfully:", response);
//     return;
//   } catch (error) {
//     console.error("Error submitting score:", error);
//   }
// };

// export const getScoreWebClient = async (nickname: string) => {
//   const { client, chain } = useLineraStore.getState();
//   if (!client || !chain) {
//     console.error("Client or chain not initialized");
//     return;
//   }

//   try {
//     const backend = await client.frontend().application(appId);

//     const response = await backend.query(
//       JSON.stringify({
//         query: `
//       query QueryRoot($name: String!) {
//         score(name: $name)
//       }
//     `,
//         variables: {
//           name: nickname,
//         },
//       })
//     );

//     console.log("Scores retrieved successfully:", response);
//     const result = JSON.parse(response);
//     console.log(result.data.score);
//     return result.data.score;
//   } catch (error) {
//     console.error("Error retrieving scores:", error);
//   }
// };

// export const getValueWebClient = async () => {
//   const { client, chain } = useLineraStore.getState();
//   if (!client || !chain) {
//     console.error("Client or chain not initialized");
//     return;
//   }
//   try {
//     const backend = await client.frontend().application(appId);

//     const response = await backend.query('{ "query": "query { value }" }');

//     console.log("Value :", response);
//   } catch (error) {
//     console.error("Error retrieving scores:", error);
//   }
// };
