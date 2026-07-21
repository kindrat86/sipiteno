import { createRoot } from "react-dom/client";
import { initPostHogDeferred } from "./lib/posthog";
import { initClarityDeferred } from "./lib/clarity";
import { trackAiReferral } from "./lib/analytics";
import { hasConsented, getConsent } from "./lib/consent";
import "./i18n";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Only fire trackers if consent was previously given.
// The CookieConsent banner handles first-time consent + re-init.
if (hasConsented()) {
  const consent = getConsent()!;
  if (consent.analytics) {
    initPostHogDeferred();
    trackAiReferral();
  }
  if (consent.experience) {
    initClarityDeferred();
  }
}
