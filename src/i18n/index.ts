import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import { DEFAULT_LANGUAGE, RTL_LANGUAGES } from "./languages";

// Import all available translations (dynamically loaded)
const translations: Record<string, typeof en> = { en };

// Eagerly import all locale files (Vite handles bundling)
const modules = import.meta.glob("./locales/*.ts", { eager: true });
for (const [path, mod] of Object.entries(modules)) {
  const code = path.match(/\/locales\/(.+)\.ts$/)?.[1];
  if (code && mod && typeof mod === "object") {
    translations[code] = (mod as { default: typeof en }).default;
  }
}

export function detectLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem("sipiteno-lang");
  if (stored && translations[stored]) return stored;
  const browser = navigator.language.split("-")[0];
  if (translations[browser]) return browser;
  // Check zh-CN mapping
  if (navigator.language === "zh-CN" || navigator.language.startsWith("zh")) return "zh-CN";
  return DEFAULT_LANGUAGE;
}

export function setLanguage(code: string) {
  if (!translations[code]) return;
  localStorage.setItem("sipiteno-lang", code);
  i18n.changeLanguage(code);
  applyRTL(code);
}

export function applyRTL(code: string) {
  if (typeof document === "undefined") return;
  const isRTL = RTL_LANGUAGES.includes(code);
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = code;
}

const detected = detectLanguage();

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    Object.entries(translations).map(([code, t]) => [code, { translation: t }])
  ),
  lng: detected,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

applyRTL(detected);

export default i18n;
