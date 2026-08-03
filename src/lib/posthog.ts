import type posthogType from "posthog-js";

// Lazy PostHog loader — keeps posthog-js (~220 KB min, ~30% of the entry
// bundle) off the render-critical path. The library is dynamically imported
// at browser idle after first paint; capture() calls made before it loads
// are buffered and flushed on init. Init config is unchanged from the old
// synchronous bootstrap in main.tsx.

type CaptureArgs = [string, Record<string, string> | undefined];

let client: typeof posthogType | null = null;
let initialized = false;
let cookieless = false;
const queue: CaptureArgs[] = [];

export function capture(name: string, properties?: Record<string, string>) {
  if (client) {
    client.capture(name, properties);
  } else {
    queue.push([name, properties]);
  }
}

function init(persistence: "memory" | "localStorage+cookie"): void {
  if (initialized) return;
  initialized = true;
  cookieless = persistence === "memory";
  const load = () => {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY || "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX", {
        api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
        person_profiles: "identified_only",
        defaults: "2025-05-24",
        persistence,
      });
      client = posthog;
      for (const [name, properties] of queue.splice(0)) {
        posthog.capture(name, properties);
      }
    });
  };
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => load(), { timeout: 4000 });
  } else {
    setTimeout(load, 1500);
  }
}

// Full tracking — only after the visitor accepts the analytics category in
// the consent banner. Uses cookies/localStorage for cross-visit identity.
export function initPostHogDeferred(): void {
  if (initialized) {
    upgradeToFullTracking();
    return;
  }
  init("localStorage+cookie");
}

// Anonymous, cookieless measurement for visitors who have NOT (yet) accepted:
// persistence is in-memory only — no cookies, no localStorage, no cross-visit
// identifier, anonymous events only (person_profiles: identified_only). Added
// 2026-08-03 because consent-gating analytics entirely zeroed the traffic
// numbers (~0% of visitors interact with the banner); pageview counting
// without storing identifiers does not require the storage-consent the
// banner asks for.
export function initPostHogCookieless(): void {
  if (initialized) return;
  init("memory");
}

// Called when a cookieless session accepts the banner mid-visit.
export function upgradeToFullTracking(): void {
  if (client && cookieless) {
    client.set_config({ persistence: "localStorage+cookie" });
    cookieless = false;
  }
}
