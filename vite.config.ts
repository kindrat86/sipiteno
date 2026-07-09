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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split large vendor libs into separate chunks
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@radix-ui") || id.includes("node_modules/@shadcn") || id.includes("node_modules/lucide")) {
            return "vendor-ui";
          }
          if (id.includes("node_modules/@supabase")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run")) {
            return "vendor-router";
          }
          if (id.includes("node_modules")) {
            return "vendor-libs";
          }
          // Split page-level code
          if (id.includes("/src/pages/") || id.includes("/src/components/")) {
            const parts = id.split("/");
            const dir = parts[parts.indexOf("src") + 2] || "app";
            return `page-${dir}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    legalComments: "none",
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
