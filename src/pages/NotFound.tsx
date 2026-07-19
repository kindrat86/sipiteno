import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const suggestedLinks = [
  { to: "/", labelKey: "notFound.home" },
  { to: "/case-studies", labelKey: "notFound.caseStudies" },
  { to: "/pricing", labelKey: "notFound.pricing" },
  { to: "/methodology", labelKey: "notFound.methodology" },
  { to: "/industries", labelKey: "notFound.industries" },
  { to: "/locations", labelKey: "notFound.locations" },
];

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 pt-24 pb-16">
        <div className="max-w-2xl w-full text-center">
          <div className="text-primary font-bold text-7xl md:text-8xl mb-4 tracking-tight">404</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{t("notFound.title")}</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            {t("notFound.subtitle")}
          </p>

          <Button asChild size="lg" className="mb-10 font-semibold">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              {t("notFound.link")}
            </Link>
          </Button>

          <div className="border-t border-border pt-8">
            <h2 className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              <Search className="w-4 h-4" aria-hidden="true" />
              {t("notFound.suggestedTitle")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {suggestedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 min-h-[44px] flex items-center justify-center rounded-xl border border-border bg-card/50 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-muted/50 transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
