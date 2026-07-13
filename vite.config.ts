import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  build: {
    sourcemap: mode !== "production",
    target: "es2020",
    cssMinify: "lightningcss",
    minify: "esbuild",
    // NOTE: do NOT add manualChunks here. It has shipped a white-screen crash
    // twice (React-dependent vendor chunks evaluating before React). Routes are
    // already code-split via React.lazy in App.tsx.
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    legalComments: "none",
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
