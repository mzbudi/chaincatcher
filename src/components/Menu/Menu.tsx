import React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLineraStore } from "../../store/useLineraStore";
import { initializeLinera } from "../../api/linera";
import { useGameStore } from "../../store/useGameStore";

interface MenuProps {
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [showModal, setShowModal] = useState(false);
  const [showInputNickname, setShowInputNickname] = useState(false);
  const initialized = useLineraStore((state) => state.initialized);
  const chain = useLineraStore((state) => state.chain);
  const nickname = useGameStore((state) => state.nickname);
  const [nicknameInput, setNicknameInput] = useState("");

  const initialize = async () => {
    if (initialized) {
      return;
    }

    await initializeLinera();
  };
  useEffect(() => {
    initialize();
  }, []);

  // useEffect(() => {
  //   const fetchScores = async () => {
  //     const scores = await getScores();
  //     console.log("Scores:", scores);
  //   };

  //   if (initialized) {
  //     fetchScores();
  //   }
  // }, []);

  const checkIfNicknameExists = () => {
    if (!nickname || nickname === "") {
      setShowInputNickname(true);
      return false;
    }
    return true;
  };

  const submitNickname = () => {
    const nickname = nicknameInput
    if (nickname && nickname !== "") {
      useGameStore.setState({ nickname });
      setShowInputNickname(false);
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

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Chain Catcher</h1>
      {chain && initialized ? (
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
              // onClick={testSetScoreGraphQL}
            >
              How to play
            </button>
          </div>
          <p className="mt-4 text-gray-600 p-6 bg-amber-600 rounded-xl">
            Chain ID: <strong>{chain}</strong>
          </p>
        </>
      ) : (
        <button
          className={`bg-gray-400 text-white px-6 py-2 rounded-xl text-lg font-semibold ${
            initialized ? "hidden" : ""
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
                  <strong>chains</strong> give 10, <strong>blue chains</strong>{" "}
                  give 3.
                </li>
                <li>
                  ❌ Avoid <strong>bugs, hackers, and viruses</strong> — they
                  reduce your score!
                </li>
                <li>
                  ⏱️ You have <strong>60 seconds</strong> to catch as many items
                  as you can.
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
  );
};

export default Menu;
