const STORAGE_KEY = "sipiteno_consent_v1";

export interface ConsentState {
  analytics: boolean; // PostHog
  experience: boolean; // Microsoft Clarity
  timestamp: number;
}

export function getConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.experience !== "boolean"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(state: Omit<ConsentState, "timestamp">): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, timestamp: Date.now() }),
  );
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}

export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}
