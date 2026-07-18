import { createRoot } from "react-dom/client";
import { initPostHogDeferred } from "./lib/posthog";
import { initClarityDeferred } from "./lib/clarity";
import "./i18n";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Analytics load at idle, after first paint — posthog-js alone was ~30% of
// the render-critical bundle when imported synchronously here.
initPostHogDeferred();
initClarityDeferred();
