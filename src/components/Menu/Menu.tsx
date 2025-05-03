import React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MenuProps {
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Chain Catcher</h1>
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
                  <strong>chains</strong> give 10, <strong>blocks</strong> give
                  3.
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
