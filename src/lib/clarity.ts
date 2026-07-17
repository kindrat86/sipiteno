import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "vy4p3a5qdz";

let initialized = false;

export function initClarity(): void {
  if (initialized) return;
  Clarity.init(CLARITY_PROJECT_ID);
  initialized = true;
}

// Deferred variant: initialize at browser idle so the Clarity bootstrap stays
// off the render-critical path (called from main.tsx after first render).
export function initClarityDeferred(): void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => initClarity(), { timeout: 4000 });
  } else {
    setTimeout(initClarity, 1500);
  }
}

export function trackClarityEvent(name: string): void {
  if (!initialized) return;
  Clarity.event(name);
}

export function setClarityTag(key: string, value: string | string[]): void {
  if (!initialized) return;
  Clarity.setTag(key, value);
}

export function identifyClarityUser(
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string,
): void {
  if (!initialized) return;
  Clarity.identify(userId, sessionId, pageId, friendlyName);
}
