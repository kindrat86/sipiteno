import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Car, Brain, Eye, X, Check, ArrowRight } from "lucide-react";

/**
 * Russell Brunson — Expert Secrets: "The 3 Secrets"
 *
 * Every false belief falls into one of three buckets:
 *   1. The Vehicle — "I don't believe this new opportunity can take me where I want to go"
 *   2. Internal Belief — "I don't believe I can do this (skill, time, ability)"
 *   3. External Belief — "I don't believe outside forces will let me (market, resources, timing)"
 *
 * This component breaks down all three false belief patterns,
 * crushing each one with the epiphany bridge pattern.
 */
const ThreeSecrets = () => {
  const { t } = useTranslation();

  return (
    <section id="three-secrets" className="py-section-lg bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">
                {t("threeSecrets.eyebrow")}
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t("threeSecrets.title1")}{" "}
              <span className="text-primary">{t("threeSecrets.title2")}</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t("threeSecrets.subtitle")}
            </p>
          </div>

          {/* The 3 Secrets breakdown */}
          <div className="space-y-6 md:space-y-8">
            {/* Secret 1: The Vehicle */}
            <div className="bg-card rounded-2xl md:rounded-3xl border-2 border-primary/20 overflow-hidden shadow-lg">
              <div className="bg-primary/5 px-6 md:px-10 py-5 md:py-6 border-b border-primary/10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                      {t("threeSecrets.secret1Label")}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold leading-tight">
                      {t("threeSecrets.secret1Title")}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-destructive">
                    <X className="w-4 h-4" /> {t("threeSecrets.falseBelief")}
                  </span>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                    {t("threeSecrets.secret1False")}
                  </p>
                </div>
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-green-600">
                    <Check className="w-4 h-4" /> {t("threeSecrets.theEpiphany")}
                  </span>
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    {t("threeSecrets.secret1Truth")}
                  </p>
                </div>
              </div>
            </div>

            {/* Secret 2: Internal Belief */}
            <div className="bg-card rounded-2xl md:rounded-3xl border-2 border-secondary/30 overflow-hidden shadow-lg">
              <div className="bg-secondary/5 px-6 md:px-10 py-5 md:py-6 border-b border-secondary/10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest">
                      {t("threeSecrets.secret2Label")}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold leading-tight">
                      {t("threeSecrets.secret2Title")}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-destructive">
                    <X className="w-4 h-4" /> {t("threeSecrets.falseBelief")}
                  </span>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                    {t("threeSecrets.secret2False")}
                  </p>
                </div>
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-green-600">
                    <Check className="w-4 h-4" /> {t("threeSecrets.theEpiphany")}
                  </span>
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    {t("threeSecrets.secret2Truth")}
                  </p>
                </div>
              </div>
            </div>

            {/* Secret 3: External Belief */}
            <div className="bg-card rounded-2xl md:rounded-3xl border-2 border-accent/30 overflow-hidden shadow-lg">
              <div className="bg-accent/5 px-6 md:px-10 py-5 md:py-6 border-b border-accent/10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] md:text-xs font-bold text-accent-foreground uppercase tracking-widest">
                      {t("threeSecrets.secret3Label")}
                    </span>
                    <h3 className="text-lg md:text-2xl font-bold leading-tight">
                      {t("threeSecrets.secret3Title")}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-destructive">
                    <X className="w-4 h-4" /> {t("threeSecrets.falseBelief")}
                  </span>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                    {t("threeSecrets.secret3False")}
                  </p>
                </div>
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-green-600">
                    <Check className="w-4 h-4" /> {t("threeSecrets.theEpiphany")}
                  </span>
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    {t("threeSecrets.secret3Truth")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion CTA */}
          <div className="mt-10 md:mt-14 p-6 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-center text-white">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight max-w-3xl mx-auto mb-4 md:mb-6">
              {t("threeSecrets.conclusion")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                to="/#free-playbook"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:gap-3 transition-all"
              >
                {t("threeSecrets.cta")} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeSecrets;
