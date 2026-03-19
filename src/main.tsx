import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { initClarity } from "./lib/clarity";
import App from "./App.tsx";
import "./index.css";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: false,
});

initClarity();

createRoot(document.getElementById("root")!).render(<App />);
