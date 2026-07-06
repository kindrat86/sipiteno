import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { initClarity } from "./lib/clarity";
import "./i18n";
import App from "./App.tsx";
import "./index.css";

posthog.init(import.meta.env.VITE_POSTHOG_KEY || "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX", {
  api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
  person_profiles: "identified_only",
  defaults: "2025-05-24",
});

initClarity();

createRoot(document.getElementById("root")!).render(<App />);
