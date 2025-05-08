import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        linera: "@linera/client", // Tambahkan @linera/client sebagai entri terpisah
      },
      preserveEntrySignatures: "strict", // Menjaga signature entri tetap utuh
    },
  },
  optimizeDeps: {
    exclude: [
      "@linera/client", // Mengecualikan @linera/client dari optimisasi dependensi
    ],
  },
});
