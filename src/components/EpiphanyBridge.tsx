import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const EpiphanyBridge = () => {
  const { t } = useTranslation();
  return (
    <section id="our-story" className="py-section-lg bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("epiphanyBridge.eyebrow")}</span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t("epiphanyBridge.title1")}<br /><span className="text-primary">{t("epiphanyBridge.title2")}</span>
            </h2>
          </div>
          <div className="text-muted-foreground space-y-7 md:space-y-8 text-base md:text-lg leading-relaxed">
            <div>
              <p className="text-xs md:text-xs font-bold text-primary uppercase tracking-widest mb-2">{t("epiphanyBridge.backstory")}</p>
              <p>{t("epiphanyBridge.backstoryBody")}</p>
            </div>
            <div>
              <p className="text-xs md:text-xs font-bold text-primary uppercase tracking-widest mb-2">{t("epiphanyBridge.theWall")}</p>
              <p>{t("epiphanyBridge.wallBody")}</p>
              <p>{t("epiphanyBridge.wallBody2")}</p>
            </div>
            <div>
              <p className="text-xs md:text-xs font-bold text-primary uppercase tracking-widest mb-2">{t("epiphanyBridge.theEpiphany")}</p>
              <p>{t("epiphanyBridge.epiphanyBody")}</p>
              <ol className="space-y-2 md:space-y-3 my-4 md:my-6 not-prose">
                {[1,2,3].map((i) => (
                  <li key={i} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border-2 border-primary/10">
                    <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs md:text-sm">{i}</span>
                    <div className="min-w-0">
                      <strong className="text-foreground">{t(`epiphanyBridge.e${i}Title`)}</strong> {t(`epiphanyBridge.e${i}Body`)}
                    </div>
                  </li>
                ))}
              </ol>
              <p>{t("epiphanyBridge.epiphanyConclusion")}</p>
            </div>
            <div>
              <p className="text-xs md:text-xs font-bold text-primary uppercase tracking-widest mb-2">{t("epiphanyBridge.thePlan")}</p>
              <p>{t("epiphanyBridge.planBody")}</p>
            </div>
          </div>
          <div className="mt-10 md:mt-14 p-6 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-center text-white">
            <p className="text-xs md:text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 md:mb-4">{t("epiphanyBridge.bigDominoLabel")}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight max-w-3xl mx-auto">
              {t("epiphanyBridge.bigDomino")}
            </p>
            <p className="text-white/85 mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-lg">{t("epiphanyBridge.bigDominoBody")}</p>
          </div>
          <div className="mt-8 md:mt-10 bg-card rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-primary/20 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{t("epiphanyBridge.ctaTitle")}</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-5 md:mb-6 max-w-2xl mx-auto">{t("epiphanyBridge.ctaBody")}</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button size="lg" className="font-semibold text-base" asChild>
                <a href="#free-playbook">{t("epiphanyBridge.ctaButton")} <ArrowRight className="w-4 h-4 ml-1" /></a>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link to="/case-studies">{t("common.seeCaseStudies")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EpiphanyBridge;
