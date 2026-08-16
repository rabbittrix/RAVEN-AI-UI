import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const pagesBase =
  process.env.PAGES_BASE ||
  (process.env.GITHUB_PAGES === "true" ? "/RAVEN-AI-UI/" : "/");

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
        },
      },
    },
  },
});
