import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, Trophy, Target, ArrowRight } from "lucide-react";

/**
 * Russell Brunson — Traffic Secrets: "Dream 100"
 *
 * The Dream 100 is the list of people who already have the attention of
 * your dream customers. Instead of competing for cold traffic, you build
 * relationships with the people who already serve your audience.
 *
 * For Sipiteno, the Dream 100 = the partners, associations, and gatekeepers
 * across 28 markets that took us 15 years to build.
 */
const Dream100 = () => {
  const { t } = useTranslation();

  return (
    <section id="dream-100" className="py-section-lg bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="text-secondary font-semibold text-xs md:text-sm tracking-wide uppercase">
                {t("dream100.eyebrow")}
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t("dream100.title1")}{" "}
              <span className="text-secondary">{t("dream100.title2")}</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t("dream100.subtitle")}
            </p>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
            <div className="bg-card rounded-2xl md:rounded-3xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t("dream100.step1Label")}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2">
                {t("dream100.step1Title")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("dream100.step1Body")}
              </p>
            </div>

            <div className="bg-card rounded-2xl md:rounded-3xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t("dream100.step2Label")}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2">
                {t("dream100.step2Title")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("dream100.step2Body")}
              </p>
            </div>

            <div className="bg-card rounded-2xl md:rounded-3xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t("dream100.step3Label")}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2">
                {t("dream100.step3Title")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("dream100.step3Body")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] rounded-2xl md:rounded-3xl p-6 md:p-10 text-center text-white">
            <p className="text-xl md:text-2xl font-bold mb-3 md:mb-4 max-w-2xl mx-auto">
              {t("dream100.ctaTitle")}
            </p>
            <p className="text-white/80 mb-5 md:mb-6 max-w-xl mx-auto text-sm md:text-base">
              {t("dream100.ctaBody")}
            </p>
            <Link
              to="/#free-playbook"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:gap-3 transition-all"
            >
              {t("dream100.cta")} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dream100;
