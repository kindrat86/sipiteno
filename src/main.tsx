import { createRoot } from "react-dom/client";
import { initPostHogDeferred, initPostHogCookieless } from "./lib/posthog";
import { initClarityDeferred } from "./lib/clarity";
import { trackAiReferral } from "./lib/analytics";
import { hasConsented, getConsent } from "./lib/consent";
import "./i18n";
import App from "./App.tsx";
import "./index.css";

// Detect locale from URL path (e.g., /de/about -> set language to "de")
// This enables crawlable localized URLs for search engines.
import i18n from "./i18n";
import { availableCodes } from "./i18n";
function detectLocaleFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/^\/([a-z]{2}(-[a-zA-Z]{2})?)\//);
  if (match && availableCodes.has(match[1])) {
    const locale = match[1];
    if (locale !== i18n.language) {
      i18n.changeLanguage(locale);
    }
  }
}
detectLocaleFromUrl();

createRoot(document.getElementById("root")!).render(<App />);

// Consent gates FULL tracking (cookies, cross-visit identity, Clarity).
// Without analytics consent we still count anonymous pageviews via PostHog's
// cookieless mode (in-memory persistence, no identifiers) — see lib/posthog.ts.
// The CookieConsent banner handles first-time consent + upgrade.
const consent = getConsent();
if (consent?.analytics) {
  initPostHogDeferred();
  trackAiReferral();
} else {
  initPostHogCookieless();
}
if (hasConsented() && consent?.experience) {
  initClarityDeferred();
}
