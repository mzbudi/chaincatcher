import React from "react";

interface MenuProps {
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
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
          className="bg-gray-400 text-white px-6 py-2 rounded-xl text-lg font-semibold cursor-not-allowed"
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Menu;
