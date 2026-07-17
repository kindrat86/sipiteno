import { capture } from "./posthog";
import { trackClarityEvent } from "./clarity";

export function trackEvent(name: string, properties?: Record<string, string>) {
  capture(name, properties);
  trackClarityEvent(name);
}
