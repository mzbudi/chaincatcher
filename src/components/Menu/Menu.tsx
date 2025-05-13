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

  const getValueWebClient = async () => {
    console.log("hit");
    
    if (application && client) {
      try {
        const response = await application.query(
          '{ "query": "query { value }" }'
        );

        console.log("Value :", response);
      } catch (error) {
        console.error("Error retrieving scores:", error);
      }
    }
  };

  return (
    <>
      {nickname && (
        <div className="absolute top-4 left-4 text-2xl font-bold">
          Welcome, {nickname}
        </div>
      )}
      {(() => {
        if (highScore > 0) {
          return (
            <div className="absolute top-12 left-4 text-2xl font-bold">
              Highest Score: {highScore}
            </div>
          );
        }
        return null;
      })()}

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Chain Catcher</h1>
        <p className="text-lg mb-4">Catch the falling chains!</p>

        {chain !== null && status === "Ready" ? (
          <>
            <div className="space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
                onClick={validateStart}
              >
                Play
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-xl text-lg font-semibold"
                onClick={() => setShowModal(true)}
              >
                How to play
              </button>

              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
                onClick={getValueWebClient}
              >
                test hit
              </button>
            </div>
            <p className="mt-4 text-gray-600 p-6 bg-amber-600 rounded-xl">
              Chain ID: <strong>{chain}</strong>
            </p>
          </>
        ) : (
          <button
            className={`bg-gray-400 text-white px-6 py-2 rounded-xl text-lg font-semibold ${
              status === "Ready" ? "hidden" : ""
            }`}
            disabled
          >
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="none"
                  d="M4 12a8 8 0 1 1 16 0A8 8 0 1 1 4 12z"
                />
              </svg>
              Requesting Chain ID...
            </span>
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
