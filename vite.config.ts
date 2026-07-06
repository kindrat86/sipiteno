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
  },
  esbuild: {
    legalComments: "none",
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
