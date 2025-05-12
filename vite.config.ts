import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        linera: "@linera/client",
      },
      preserveEntrySignatures: "strict",
    },
  },
  optimizeDeps: {
    exclude: ["@linera/client"],
  },
  assetsInclude: ["**/*.wasm"],
  server: {
    port: 3000,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    proxy: {
      "/rpc.v1": {
        target: "https://linera-testnet.chainbase.online",
        changeOrigin: true,
        secure: true,
      },
      "/faucet.v1": {
        target: "https://faucet.testnet-babbage.linera.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
