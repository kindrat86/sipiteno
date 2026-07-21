import type posthogType from "posthog-js";

// Lazy PostHog loader — keeps posthog-js (~220 KB min, ~30% of the entry
// bundle) off the render-critical path. The library is dynamically imported
// at browser idle after first paint; capture() calls made before it loads
// are buffered and flushed on init. Init config is unchanged from the old
// synchronous bootstrap in main.tsx.

type CaptureArgs = [string, Record<string, string> | undefined];

let client: typeof posthogType | null = null;
let initialized = false;
const queue: CaptureArgs[] = [];

export function capture(name: string, properties?: Record<string, string>) {
  if (client) {
    client.capture(name, properties);
  } else {
    queue.push([name, properties]);
  }
}

export function initPostHogDeferred(): void {
  if (initialized) return;
  initialized = true;
  const load = () => {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY || "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX", {
        api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
        person_profiles: "identified_only",
        defaults: "2025-05-24",
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
