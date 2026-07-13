import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const location = useLocation();
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Show sticky CTA after scrolling 600px, hide on pages that already convert
  useEffect(() => {
    const isConversionPage =
      location.pathname === "/contact" ||
      location.pathname === "/pricing" ||
      location.hash === "#contact";
    const onScroll = () => {
      setShowStickyCTA(window.scrollY > 600 && !isConversionPage);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  const serviceLinks = [
    { label: t("services.s1Title"), to: "/services/ai-consulting" },
    { label: t("services.s2Title"), to: "/services/business-development" },
    { label: t("services.s4Title"), to: "/services/it-consulting" },
    { label: t("services.s3Title"), to: "/services/digital-marketing" },
    { label: t("services.s5Title"), to: "/services/sales-funnel" },
    { label: t("services.s6Title"), to: "/services/project-management" },
  ];

  const companyLinks = [
    { label: t("footer.whyChooseUs"), to: "/#why-choose-us" },
    { label: t("footer.locations"), to: "/locations" },
    { label: t("footer.industries"), to: "/industries" },
    { label: t("footer.markets"), to: "/#markets" },
    { label: t("footer.caseStudies"), to: "/case-studies" },
    { label: t("footer.pricing"), to: "/pricing" },
    { label: t("footer.methodology"), to: "/methodology" },
    { label: t("nav.glossary"), to: "/glossary" },
    { label: t("nav.alternatives"), to: "/alternatives" },
    { label: t("footer.blog"), to: "/blog" },
    { label: t("footer.faq"), to: "/#faq" },
    { label: t("footer.contactLink"), to: "/contact" },
  ];

  return (
    <>
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg mb-3">{t("footer.company")}</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {t("footer.companyDesc")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              {t("footer.companyLinks")}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:sales@sipiteno.com"
                  className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                >
                  sales@sipiteno.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/34765968"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                >
                  {t("footer.linkedin")}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <h4 className="font-semibold mt-6 mb-3 text-sm uppercase tracking-wider text-white/80">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="inline-block py-1.5 text-white/60 hover:text-white text-sm transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 text-center text-sm text-white/50">
          <p>&copy; {year} {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>

    {/* Mobile sticky CTA bar — appears after scroll on non-home pages */}
    {showStickyCTA && (
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-3"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
                 background: "hsl(var(--background))",
                 borderTop: "1px solid hsl(var(--border))",
                 boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.08)" }}
      >
        <Link
          to="/#contact"
          className="flex items-center justify-center w-full gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-lg active:scale-95 transition-transform"
        >
          {t("hero.cta")}
        </Link>
      </div>
    )}
    </>
  );
};

export default Footer;
