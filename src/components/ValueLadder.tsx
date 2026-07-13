import { useTranslation } from "react-i18next";
import { Gift, Phone, Rocket, Repeat, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ValueLadder = () => {
  const { t } = useTranslation();

  const rungs = [
    { tierKey: "valueLadder.tier1", icon: Gift, priceKey: "valueLadder.tier1Price", priceNoteKey: "valueLadder.tier1Note",
      titleKey: "valueLadder.tier1Title", descKey: "valueLadder.tier1Desc", ctaKey: "valueLadder.tier1Cta", href: "#free-playbook", highlight: false },
    { tierKey: "valueLadder.tier2", icon: Phone, priceKey: "valueLadder.tier2Price", priceNoteKey: "valueLadder.tier2Note",
      titleKey: "valueLadder.tier2Title", descKey: "valueLadder.tier2Desc", ctaKey: "valueLadder.tier2Cta", href: "/#contact", highlight: true },
    { tierKey: "valueLadder.tier3", icon: Rocket, priceKey: "valueLadder.tier3Price", priceNoteKey: "valueLadder.tier3Note",
      titleKey: "valueLadder.tier3Title", descKey: "valueLadder.tier3Desc", ctaKey: "valueLadder.tier3Cta", href: "/pricing", highlight: false },
    { tierKey: "valueLadder.tier4", icon: Repeat, priceKey: "valueLadder.tier4Price", priceNoteKey: "valueLadder.tier4Note",
      titleKey: "valueLadder.tier4Title", descKey: "valueLadder.tier4Desc", ctaKey: "valueLadder.tier4Cta", href: "/pricing", highlight: false },
    { tierKey: "valueLadder.tier5", icon: Crown, priceKey: "valueLadder.tier5Price", priceNoteKey: "valueLadder.tier5Note",
      titleKey: "valueLadder.tier5Title", descKey: "valueLadder.tier5Desc", ctaKey: "valueLadder.tier5Cta", href: "/pricing", highlight: false },
  ];

  return (
    <section id="value-ladder" className="py-section-lg bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("valueLadder.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">{t("valueLadder.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{t("valueLadder.subtitle")}</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {rungs.map((rung, i) => (
              <div key={i} className={`relative flex flex-col p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 gpu-accelerated ${rung.highlight ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-border bg-card/50 hover:border-primary/30 hover:shadow-lg"}`}>
                {rung.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs md:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{t("valueLadder.mostStartHere")}</div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <rung.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-wide">{t(rung.tierKey)}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1">{t(rung.titleKey)}</h3>
                <div className="mb-2 md:mb-3">
                  <span className="text-xl md:text-2xl font-bold text-primary">{t(rung.priceKey)}</span>
                  <span className="text-xs md:text-xs text-muted-foreground ml-1">{t(rung.priceNoteKey)}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">{t(rung.descKey)}</p>
                <Link to={rung.href} className="mt-4 md:mt-5 inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-primary hover:gap-2 transition-all">
                  {t(rung.ctaKey)} <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueLadder;
