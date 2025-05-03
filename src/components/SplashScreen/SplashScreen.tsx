import { playBackgroundMusic } from "../Bgm/audio";

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    playBackgroundMusic();
    onStart();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#222",
        color: "white",
      }}
    >
      <h1>Welcome to Chain Catcher</h1>
      <button
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          marginTop: "20px",
          cursor: "pointer",
        }}
        onClick={handleStart}
      >
        Start Game
      </button>
    </div>
  );
}
