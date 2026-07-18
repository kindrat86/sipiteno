import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES } from "@/i18n/languages";
import { setLanguage, availableCodes } from "@/i18n";

// Only offer languages that have a real translation bundle on disk —
// the rest silently no-op in setLanguage and confuse users.
const AVAILABLE_LANGUAGES = LANGUAGES.filter((l) => availableCodes.has(l.code));

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const current = i18n.language || "en";
  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.code === current) || AVAILABLE_LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search
    ? AVAILABLE_LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
          l.code.toLowerCase().includes(search.toLowerCase())
      )
    : AVAILABLE_LANGUAGES;

  const handleSelect = (code: string) => {
    setLanguage(code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages..."
              className="w-full px-3 py-2 text-sm bg-muted/50 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-1">
            {filtered.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  current === lang.code
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="flex flex-col items-start">
                  <span>{lang.name}</span>
                  <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                </span>
                {current === lang.code && <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
