import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Clock, ShieldCheck, ArrowRight, BookOpen, Map, FileText, Users2, Star, Gift } from "lucide-react";

const OrderBump = () => {
  const { t } = useTranslation();

  return (
    <section id="free-call" className="py-section-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl md:rounded-3xl border-2 border-primary/20 shadow-xl md:shadow-2xl overflow-hidden">
            <div className="bg-primary text-white px-6 md:px-12 py-5 md:py-6 text-center">
              <div className="inline-flex items-center gap-2 mb-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary" />
                <span className="text-secondary font-semibold text-xs md:text-xs uppercase tracking-wide">{t("orderBump.urgencyBadge")}</span>
              </div>
              <div className="max-w-xs mx-auto mt-2 md:mt-3">
                <div className="flex justify-between text-xs md:text-xs text-white/70 mb-1">
                  <span>{t("orderBump.spotsFilled")}</span><span>{t("orderBump.spotsRemaining")}</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: "50%" }}></div>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-4xl font-bold leading-tight mt-3 md:mt-4">{t("orderBump.title")}</h2>
            </div>
            <div className="p-6 md:p-12">
              <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed text-center max-w-3xl mx-auto">{t("orderBump.body")}</p>
              <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm mb-6 md:mb-8">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
                <span className="text-amber-600 font-semibold">{t("orderBump.slotCounter")}</span>
                <span className="text-muted-foreground hidden sm:inline">{t("orderBump.firstCall")}</span>
              </div>
              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {[Phone, BookOpen, Map, FileText, Users2][i-1] && <span className="text-primary">{/* icon handled by CSS */}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-sm md:text-base">{t(`orderBump.item${i}Title`)}</h3>
                        <span className="text-xs md:text-sm font-bold text-muted-foreground line-through">{t(`orderBump.item${i}Value`)}</span>
                      </div>
                      <p className="text-xs md:text-xs text-primary font-semibold uppercase tracking-wide mb-0.5">{t(`orderBump.item${i}Sub`)}</p>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{t(`orderBump.item${i}Desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl md:rounded-2xl p-5 md:p-6 mb-6 md:mb-8 text-center border-2 border-primary/20">
                <div className="flex items-center justify-center gap-1 mb-1 md:mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 md:w-5 md:h-5 fill-secondary text-secondary" />)}
                </div>
                <div className="text-xs md:text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{t("orderBump.totalValueLabel")}</div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <span className="line-through text-muted-foreground/50 text-xl md:text-2xl">$1,497</span>{" "}
                  <span className="text-secondary">{t("common.free")}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">{t("orderBump.noCreditCard")}</p>
              </div>
              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3">
                    <span className="text-primary mt-0.5 flex-shrink-0">{i === 1 ? <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> : i === 2 ? <Clock className="w-4 h-4 md:w-5 md:h-5" /> : <Gift className="w-4 h-4 md:w-5 md:h-5" />}</span>
                    <span className="text-xs md:text-base">{t(`orderBump.rr${i}`)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="font-semibold text-base md:text-lg h-12 md:h-14 px-6 md:px-8" asChild>
                  <Link to="/#contact">{t("orderBump.cta")} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 md:h-14 text-base" asChild>
                  <a href="#free-playbook">{t("orderBump.ctaSecondary")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderBump;
