import React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { useLineraStore } from "../../store/useLineraStore";
import { useGameStore } from "../../store/useGameStore";
import { useLinera } from "../../Provider/LineraWebClientProvider";

interface MenuProps {
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [showModal, setShowModal] = useState(false);
  const [showInputNickname, setShowInputNickname] = useState(false);
  // const initialized = useLineraStore((state) => state.initialized);
  // const chain = useLineraStore((state) => state.chain);
  const nickname = useGameStore((state) => state.nickname);
  const gameScore = useGameStore((state) => state.gameScore);
  const highScore = useGameStore((state) => state.highScore);
  const [nicknameInput, setNicknameInput] = useState("");
  // const [nicknameSubmitted, setNicknameSubmitted] = useState(false);

  const { client, application, chain, status } = useLinera();

  useEffect(() => {
    const getScoreWebClient = async (nickname: string) => {
      if (application && client) {
        try {
          const response = await application.query(
            JSON.stringify({
              query: `
        query QueryRoot($name: String!) {
          score(name: $name)
        }
      `,
              variables: {
                name: nickname,
              },
            })
          );

          console.log("Scores retrieved successfully:", response);
          const result = JSON.parse(response);
          console.log(result.data.score);
          return result.data.score;
        } catch (error) {
          console.error("Error retrieving scores:", error);
        }
      }
    };

    const fetchScores = async () => {
      const scores = await getScoreWebClient(nickname);
      if (scores) {
        useGameStore.getState().setHighScore(scores);
      } else {
        console.log("No score found for this nickname");
      }
    };

    if (nickname || gameScore) {
      fetchScores();
    }
  }, [nickname, gameScore, application, client]);

  const checkIfNicknameExists = () => {
    if (!nickname || nickname === "") {
      setShowInputNickname(true);
      return false;
    }
    return true;
  };

  const submitNickname = () => {
    const nickname = nicknameInput;
    if (nickname && nickname !== "") {
      useGameStore.setState({ nickname });
      setShowInputNickname(false);
      // setNicknameSubmitted(true);
      onStart();
    } else {
      alert("Please enter a nickname");
    }
  };

  const validateStart = () => {
    const nicknameExists = checkIfNicknameExists();
    if (nicknameExists) {
      onStart();
    }
  };

  // const getValueWebClient = async () => {
  //   console.log("hit");

  //   if (application && client) {
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

  return (
    <>
      {nickname && (
        <div className="absolute top-4 left-4 text-2xl font-bold bg-amber-400 rounded-xl p-1.5">
          Welcome, {nickname}
        </div>
      )}
      {(() => {
        if (highScore > 0) {
          return (
            <div className="absolute top-12 left-4 text-2xl font-bold bg-amber-400 rounded-xl p-1.5">
              Highest Score: {highScore}
            </div>
          );
        }
        return null;
      })()}

      <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto mt-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-md">
          Chain Catcher
        </h1>

        <p className="text-lg mb-4 text-gray-700 drop-shadow-sm">
          Catch the falling chains!
        </p>

        {chain !== null && status === "Ready" ? (
          <>
            <div className="space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold cursor-pointer"
                onClick={validateStart}
              >
                Play
              </button>
              <button
                className="bg-blue-400 text-white px-6 py-2 rounded-xl text-lg font-semibold hover:bg-blue-600 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                How to play
              </button>

              {/* <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
                onClick={getValueWebClient}
              >
                test hit
              </button> */}
            </div>
            <p className="mt-4 text-gray-900 p-4 bg-amber-400 rounded-xl max-w-md mx-auto text-center font-semibold break-words whitespace-normal">
              Chain ID: <strong>{chain}</strong>
            </p>
          </>
        ) : (
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-base transition-all duration-300 bg-red-600 cursor-not-allowed opacity-80"
            disabled
            aria-busy="true"
            role="status"
          >
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span>Requesting Chain ID...</span>
          </button>
        )}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />
              <motion.div
                className="fixed bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-md w-[90%] z-50 text-left"
                initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ top: "50%", left: "50%", position: "fixed" }}
              >
                <h2 className="text-2xl font-bold text-center mb-4">
                  How to Play
                </h2>
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                  <li>
                    🎮 Use the <strong>left</strong> and <strong>right</strong>{" "}
                    arrow keys to move your basket.
                  </li>
                  <li>
                    🎯 Help Microbot catch <strong>coins, chains</strong>, and
                    other items falling in the lab.
                  </li>
                  <li>
                    🪙 <strong>Coins</strong> give 5 points,{" "}
                    <strong>chains</strong> give 10,{" "}
                    <strong>blue chains</strong> give 3.
                  </li>
                  <li>
                    ❌ Avoid <strong>bugs, hackers, and viruses</strong> — they
                    reduce your score!
                  </li>
                  <li>
                    ⏱️ You have <strong>60 seconds</strong> to catch as many
                    items as you can.
                  </li>
                </ul>
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showInputNickname && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInputNickname(false)}
              />
              <motion.div
                className="fixed bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-md w-[90%] z-50 text-left"
                initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ top: "50%", left: "50%", position: "fixed" }}
              >
                <h2 className="text-2xl font-bold text-center mb-4">
                  Enter Your Nickname
                </h2>
                <input
                  type="text"
                  placeholder="Nickname"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  onChange={(e) => {
                    setNicknameInput(e.target.value);
                  }}
                  required
                />
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      submitNickname();
                    }}
                    className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Menu;
