import { playBackgroundMusic } from "../Bgm/audio";

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    playBackgroundMusic();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-300 text-white text-center p-6">
      <h1 className="text-5xl font-extrabold drop-shadow-md mb-6">
        ⛓️ Chain Catcher
      </h1>
      <p className="text-lg mb-8 max-w-md text-orange-100">
        Help Microbot collect chains and coins while avoiding bugs and hackers in the lab!
      </p>
      <button
        onClick={handleStart}
        className="bg-white text-orange-300 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-orange-100 hover:scale-105 transition transform duration-300"
      >
        Start Game
      </button>
    </div>
  );
}
