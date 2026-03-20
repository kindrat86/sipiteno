import posthog from "posthog-js";
import { trackClarityEvent } from "./clarity";

export function trackEvent(name: string, properties?: Record<string, string>) {
  posthog.capture(name, properties);
  trackClarityEvent(name);
}
