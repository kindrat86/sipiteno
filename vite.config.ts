import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

async function getPrerenderPlugin(): Promise<PluginOption | null> {
  try {
    const { default: vitePrerender } = await import("vite-plugin-prerender");
    return vitePrerender({
      staticDir: path.resolve(__dirname, "dist"),
      routes: [
        "/",
        "/blog",
        "/services/ai-consulting",
        "/services/business-development",
        "/terms",
        "/privacy",
      ],
    });
  } catch {
    console.warn("[prerender] vite-plugin-prerender not available, skipping prerendering.");
    return null;
  }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const prerenderPlugin = mode === "production" ? await getPrerenderPlugin() : null;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      sourcemap: mode !== "production",
    },
    plugins: [react(), prerenderPlugin].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
