/**
 * Generates a single locale file template from the English source.
 * Subagents use this to know exactly what keys need translation.
 */
import en from "./en";

export function getTranslationKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      keys.push(fullKey);
    } else if (typeof value === "object" && value !== null) {
      keys.push(...getTranslationKeys(value as Record<string, unknown>, fullKey));
    }
  }
  return keys;
}

export const ALL_KEYS = getTranslationKeys(en as unknown as Record<string, unknown>);
export { en };
