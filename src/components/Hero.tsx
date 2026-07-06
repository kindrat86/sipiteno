import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      itemScope
      itemType="https://schema.org/Organization"
      className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--hero-gradient-to))]"
    >
      {/* Decorative background elements */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5ub2RkIj48cGF0aCBkPSJNMzYgMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"
        role="presentation"
        aria-hidden="true"
      />

      <div className="container mx-auto relative z-10 py-12 md:py-16">
        <header className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 flex-wrap">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-secondary animate-pulse" aria-hidden="true" />
            <span className="text-secondary font-semibold tracking-wide uppercase text-xs md:text-sm">
              {t("hero.eyebrow")}
            </span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span className="text-white/50 font-medium tracking-wide uppercase text-[10px] md:text-xs">
              {t("hero.eyebrowSub")}
            </span>
          </div>

          {/* THE HOOK */}
          <h1
            itemProp="name"
            className="text-[clamp(2rem,5vw+1rem,4.5rem)] md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-[1.08] tracking-tight"
          >
            {t("hero.title1")}{" "}
            <span className="text-secondary">{t("hero.titleNot")}</span> {t("hero.title1b")}
            <br />
            {t("hero.title2")}{" "}
            <span className="text-secondary">{t("hero.titleSystem")}</span> {t("hero.title2b")}
          </h1>

          {/* Subhead */}
          <p
            itemProp="description"
            className="text-base md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-2"
          >
            {t("hero.subhead")}{" "}
            <strong className="text-secondary">{t("hero.subheadBold")}</strong>
          </p>

          {/* Proof bullets */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 md:mb-8 text-white/80 text-xs md:text-sm">
            <li className="flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" aria-hidden="true" />
              {t("hero.bullet1")}
            </li>
            <li className="flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" aria-hidden="true" />
              {t("hero.bullet2")}
            </li>
            <li className="flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary flex-shrink-0" aria-hidden="true" />
              {t("hero.bullet3")}
            </li>
          </ul>

          {/* ONE dominant CTA */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              onClick={() => scrollToSection("free-playbook")}
            >
              {t("hero.cta")}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" aria-hidden="true" />
            </Button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white/70 hover:text-white underline underline-offset-4 text-sm font-medium py-3 min-h-[44px] flex items-center transition-colors"
            >
              {t("hero.ctaSecondary")}
            </button>
          </div>

          <p className="text-white/60 text-xs md:text-sm mt-3 md:mt-4">
            {t("hero.noCreditCard")}
          </p>

          {/* Cost-of-delay counter */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-amber-300 text-[10px] md:text-xs font-semibold">
              {t("hero.costDelay")}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center" itemProp="areaServed" itemScope itemType="https://schema.org/Place">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2" itemProp="name">
                {t("hero.stat1")}
              </div>
              <div className="text-white/70 text-sm md:text-base">{t("hero.stat1Label")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">{t("hero.stat2")}</div>
              <div className="text-white/70 text-sm md:text-base">{t("hero.stat2Label")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">{t("hero.stat3")}</div>
              <div className="text-white/70 text-sm md:text-base">{t("hero.stat3Label")}</div>
            </div>
          </div>
        </header>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
