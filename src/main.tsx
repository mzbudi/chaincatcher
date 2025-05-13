import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { LineraProvider } from "./Provider/LineraWebClientProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LineraProvider>
      <App />
    </LineraProvider>
  </StrictMode>
);
