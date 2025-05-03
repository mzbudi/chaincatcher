import { useState } from "react";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import MainMenu from "./components/Menu/MainMenu";

function App() {
  const [screen, setScreen] = useState<"splash" | "menu">("splash");

  return (
    <>
      {screen === "splash" && (
        <SplashScreen onStart={() => setScreen("menu")} />
      )}
      {screen === "menu" && <MainMenu />}
    </>
  );
}

export default App;
