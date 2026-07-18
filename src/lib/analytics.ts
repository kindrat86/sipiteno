import { capture } from "./posthog";
import { trackClarityEvent } from "./clarity";

export function trackEvent(name: string, properties?: Record<string, string>) {
  capture(name, properties);
  trackClarityEvent(name);
}

/**
 * AI referrer detection — the highest-signal AEO measurement.
 * AI assistants strip HTTP referrers ~70% of the time, but when present
 * they identify exactly which engine drove the visit. Captured on every
 * page load so we can correlate AI referral with conversion.
 */
const AI_REFERRERS: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "perplexity.ai": "Perplexity",
  "gemini.google.com": "Gemini",
  "copilot.microsoft.com": "Copilot",
  "you.com": "You.com",
  "claude.ai": "Claude",
  "poe.com": "Poe",
  "phind.com": "Phind",
  "kagi.com": "Kagi",
  "brave.com": "Brave Leo",
  "duckduckgo.com": "DuckAssist",
  "metaso.cn": "Metaso",
  "t3.chat": "T3 Chat",
};

function detectAiReferrer(): string | null {
  if (typeof document === "undefined") return null;
  const ref = document.referrer;
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    for (const [domain, label] of Object.entries(AI_REFERRERS)) {
      if (host === domain || host.endsWith("." + domain)) return label;
    }
  } catch {
    /* malformed referrer — ignore */
  }
  return null;
}

let captured = false;
export function trackAiReferral(): void {
  if (captured || typeof window === "undefined") return;
  captured = true;
  const source = detectAiReferrer();
  if (source) {
    capture("ai_referral_visit", {
      ai_source: source,
      landing_page: window.location.pathname,
    });
    trackClarityEvent("ai_referral_" + source);
  }
}
