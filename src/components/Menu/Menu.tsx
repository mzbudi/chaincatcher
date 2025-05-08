import React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLineraStore } from "../../store/useLineraStore";
import { initializeLinera } from "../../api/linera";

interface MenuProps {
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [showModal, setShowModal] = useState(false);
  const initialized = useLineraStore((state) => state.initialized);
  const chain = useLineraStore((state) => state.chain);

  const initialize = async () => {
    if (initialized) {
      return;
    }

    await initializeLinera();
  };
  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Chain Catcher</h1>
      {chain && initialized ? (
        <>
          <div className="space-x-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold"
              onClick={onStart}
            >
              Play
            </button>
            <button
              className="bg-gray-400 text-white px-6 py-2 rounded-xl text-lg font-semibold"
              onClick={() => setShowModal(true)}
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
    </div>
  );
};

export default Menu;
