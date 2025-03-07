import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    build: {
      outDir: path.resolve(__dirname, "backend/dist"),
      emptyOutDir: true,
    },
    base: "./",
    server: {
      port: 5173,
      proxy: {
        "/app": env.VITE_API_BASE_URL, // Proxy dynamically set based on mode
      },
    },
  };
});
