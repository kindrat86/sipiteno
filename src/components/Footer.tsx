import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

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
    { label: t("footer.blog"), to: "/blog" },
    { label: t("footer.faq"), to: "/#faq" },
    { label: t("footer.contactLink"), to: "/#contact" },
  ];

  return (
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
                    className="text-white/60 hover:text-white text-sm transition-colors"
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
                    className="text-white/60 hover:text-white text-sm transition-colors"
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
                  href="https://www.linkedin.com/company/34765968"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors"
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
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/60 hover:text-white text-sm transition-colors"
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
  );
};

export default Footer;
