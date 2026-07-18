import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import { DEFAULT_LANGUAGE, RTL_LANGUAGES } from "./languages";

// Locale files are loaded on demand — eagerly bundling all ~94 of them
// added ~3.5MB to the entry chunk and made mobile first-load unusable.
const localeLoaders = import.meta.glob("./locales/*.ts") as Record<
  string,
  () => Promise<{ default: typeof en }>
>;

export const availableCodes = new Set<string>(["en"]);
for (const path of Object.keys(localeLoaders)) {
  const code = path.match(/\/locales\/(.+)\.ts$/)?.[1];
  if (code) availableCodes.add(code);
}

export function detectLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem("sipiteno-lang");
  if (stored && availableCodes.has(stored)) return stored;
  const browser = navigator.language.split("-")[0];
  if (availableCodes.has(browser)) return browser;
  // Check zh-CN mapping
  if (navigator.language === "zh-CN" || navigator.language.startsWith("zh")) return "zh-CN";
  return DEFAULT_LANGUAGE;
}

async function loadLocale(code: string): Promise<boolean> {
  if (code === "en" || i18n.hasResourceBundle(code, "translation")) return true;
  const loader = localeLoaders[`./locales/${code}.ts`];
  if (!loader) return false;
  try {
    const mod = await loader();
    i18n.addResourceBundle(code, "translation", mod.default, true, true);
    return true;
  } catch {
    return false;
  }
}

export function setLanguage(code: string) {
  if (!availableCodes.has(code)) return;
  localStorage.setItem("sipiteno-lang", code);
  loadLocale(code).then((ok) => {
    if (!ok && code !== DEFAULT_LANGUAGE) return;
    i18n.changeLanguage(code);
    applyRTL(code);
  });
}

export function applyRTL(code: string) {
  if (typeof document === "undefined") return;
  const isRTL = RTL_LANGUAGES.includes(code);
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = code;
}

const detected = detectLanguage();

i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

if (detected !== DEFAULT_LANGUAGE) {
  loadLocale(detected).then((ok) => {
    if (ok) i18n.changeLanguage(detected);
  });
}

applyRTL(detected);

export default i18n;
