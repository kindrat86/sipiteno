import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fish, BookOpen, Gift, ArrowRight } from "lucide-react";

/**
 * Russell Brunson — Traffic Secrets: "Hook, Story, Offer"
 *
 * Every piece of content — every social post, every ad, every email — must contain:
 *   1. HOOK — Grab attention (the bait)
 *   2. STORY — Keep attention (the line)
 *   3. OFFER — Convert attention (the catch)
 *
 * This component visualizes how every Sipiteno content piece is structured.
 */
const HookStoryOffer = () => {
  const { t } = useTranslation();

  return (
    <section id="hook-story-offer" className="py-section-lg bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">
                {t("hso.eyebrow")}
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t("hso.title1")}{" "}
              <span className="text-primary">{t("hso.title2")}</span>
            </h2>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
              {t("hso.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Hook */}
            <div className="relative bg-card rounded-2xl md:rounded-3xl border-2 border-blue-500/30 p-6 md:p-8 text-center shadow-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-blue-500 text-white flex items-center justify-center">
                <Fish className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest">
                {t("hso.hookLabel")}
              </span>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                {t("hso.hookTitle")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("hso.hookBody")}
              </p>
            </div>

            {/* Story */}
            <div className="relative bg-card rounded-2xl md:rounded-3xl border-2 border-primary/30 p-6 md:p-8 text-center shadow-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                {t("hso.storyLabel")}
              </span>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                {t("hso.storyTitle")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("hso.storyBody")}
              </p>
            </div>

            {/* Offer */}
            <div className="relative bg-card rounded-2xl md:rounded-3xl border-2 border-green-500/30 p-6 md:p-8 text-center shadow-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-2xl bg-green-500 text-white flex items-center justify-center">
                <Gift className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-widest">
                {t("hso.offerLabel")}
              </span>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                {t("hso.offerTitle")}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("hso.offerBody")}
              </p>
            </div>
          </div>

          <div className="mt-10 md:mt-12 text-center">
            <Link
              to="/#free-playbook"
              className="inline-flex items-center gap-2 text-primary font-bold text-base md:text-lg hover:gap-3 transition-all"
            >
              {t("hso.cta")} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HookStoryOffer;
