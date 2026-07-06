import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  {
    groupKey: "nav.pages",
    items: [
      { labelKey: "nav.home", path: "/" },
      { labelKey: "nav.services", path: "/#services", scroll: true },
      { labelKey: "nav.locations", path: "/locations" },
      { labelKey: "nav.industries", path: "/industries" },
      { labelKey: "nav.caseStudies", path: "/case-studies" },
      { labelKey: "nav.pricing", path: "/pricing" },
      { labelKey: "nav.blog", path: "/blog" },
    ],
  },
  {
    groupKey: "nav.resources",
    items: [
      { labelKey: "nav.whyUs", path: "/#why-choose-us", scroll: true },
      { labelKey: "nav.faq", path: "/#faq", scroll: true },
      { labelKey: "nav.methodology", path: "/methodology" },
      { labelKey: "nav.contact", path: "/#contact", scroll: true },
    ],
  },
];

const Navigation = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Track scroll for nav background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Trap focus in mobile menu
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    const firstFocusable = menuRef.current.querySelector<HTMLElement>(
      "a, button, [tabindex]:not([tabindex='-1'])"
    );
    firstFocusable?.focus();
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + id);
    }
  };

  const handleNavAction = (item: { labelKey: string; path: string; scroll?: boolean }) => {
    setIsMenuOpen(false);
    if (item.path.startsWith("/#") && item.scroll) {
      const id = item.path.slice(2);
      scrollToSection(id);
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-primary hover:text-primary/90 transition-colors"
            aria-label="Sipiteno - Home"
          >
            SIPITENO
          </Link>

          {/* Desktop Navigation — cleaner groups */}
          <div
            className="hidden md:flex items-center gap-1"
            role="menubar"
          >
            {navItems.map((group) => (
              <div key={group.groupKey} className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  aria-haspopup="true"
                >
                  {t(group.groupKey)}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 translate-y-1 group-hover:translate-y-0">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-1.5 space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.labelKey}
                        onClick={() => handleNavAction(item)}
                        className="w-full text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        role="menuitem"
                      >
                        {t(item.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="md:hidden relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation — fullscreen overlay panel */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="fixed inset-0 top-16 md:hidden bg-background/98 backdrop-blur-xl z-40 animate-fade-in overflow-y-auto"
            role="menu"
            aria-hidden={!isMenuOpen}
          >
            <div className="container mx-auto py-6 px-4 space-y-6">
              {navItems.map((group) => (
                <div key={group.groupKey}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                    {t(group.groupKey)}
                  </h3>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.labelKey}
                        onClick={() => handleNavAction(item)}
                        className="w-full text-left px-4 py-4 text-base font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-colors min-h-[48px] flex items-center"
                        role="menuitem"
                      >
                        {t(item.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Language Switcher */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                  {t("languageSwitcher.title")}
                </h3>
                <div className="px-2">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Mobile-only CTA */}
              <div className="pt-4 border-t border-border">
                <Button
                  size="lg"
                  className="w-full font-semibold text-base h-12"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/#free-playbook");
                  }}
                >
                  Get the Free Playbook
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
