import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "backend/dist"), // Ensures build goes to backend/dist
    emptyOutDir: true,
  },
  base: "./",
  server: {
    port: 5173,
    proxy: {
      "/app": "http://localhost:5000",
    },
  },
});
