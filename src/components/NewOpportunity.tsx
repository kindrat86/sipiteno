import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Check, Users2, Map, Rocket } from "lucide-react";

const NewOpportunity = () => {
  const { t } = useTranslation();

  const pillars = [
    { icon: Users2, titleKey: "newOpportunity.pillar1Title", descKey: "newOpportunity.pillar1Body" },
    { icon: Map, titleKey: "newOpportunity.pillar2Title", descKey: "newOpportunity.pillar2Body" },
    { icon: Rocket, titleKey: "newOpportunity.pillar3Title", descKey: "newOpportunity.pillar3Body" },
  ];

  return (
    <section id="new-opportunity" className="py-section-lg bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="text-amber-700 font-semibold text-xs md:text-sm tracking-wide uppercase">{t("newOpportunity.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            {t("newOpportunity.title1")}<br />
            {t("newOpportunity.title2")} <span className="text-primary">{t("newOpportunity.title3")}</span>{t("newOpportunity.title4")}
          </h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{t("newOpportunity.subtitle")}</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-20">
          <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0"><X className="w-5 h-5 text-destructive" /></div>
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold">{t("newOpportunity.oldWayTitle")}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{t("newOpportunity.oldWaySubtitle")}</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[1,2,3,4,5,6].map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                  <X className="w-4 h-4 md:w-5 md:h-5 text-destructive/60 mt-0.5 flex-shrink-0" />
                  <span className="line-through decoration-destructive/30">{t(`newOpportunity.oldWay${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl border-2 border-secondary/40 bg-secondary/5 relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs md:text-xs font-bold px-3 md:px-4 py-1.5 rounded-full whitespace-nowrap">{t("newOpportunity.newWayBadge")}</div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0"><Check className="w-5 h-5 text-secondary" /></div>
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold">{t("newOpportunity.newWayTitle")}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{t("newOpportunity.newWaySubtitle")}</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[1,2,3,4,5,6].map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{t(`newOpportunity.newWay${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12">
            {t("newOpportunity.pillarsTitle")}<br />
            <span className="text-muted-foreground text-lg md:text-xl font-normal">{t("newOpportunity.pillarsSubtitle")}</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {pillars.map((pillar, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl border-2 border-primary/10 bg-card/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 gpu-accelerated">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5">
                  <pillar.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <div className="text-xs md:text-xs font-bold text-primary uppercase tracking-widest mb-2">{t("newOpportunity.part")} {i + 1}</div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{t(pillar.titleKey)}</h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t(pillar.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <p className="text-base md:text-lg text-muted-foreground mb-5 md:mb-6 max-w-2xl mx-auto px-2">{t("newOpportunity.ctaBody")}</p>
          <Button size="lg" className="font-semibold text-base md:text-lg h-12 md:h-14 px-6 md:px-8" asChild>
            <Link to="/#free-playbook">{t("common.getFreePlaybook")} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewOpportunity;
