import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "vy4p3a5qdz";

let initialized = false;

export function initClarity(): void {
  if (initialized) return;
  Clarity.init(CLARITY_PROJECT_ID);
  initialized = true;
}

export function trackClarityEvent(name: string): void {
  Clarity.event(name);
}

export function setClarityTag(key: string, value: string | string[]): void {
  Clarity.setTag(key, value);
}

export function identifyClarityUser(
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string,
): void {
  Clarity.identify(userId, sessionId, pageId, friendlyName);
}
