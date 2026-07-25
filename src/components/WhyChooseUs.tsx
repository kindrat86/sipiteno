import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Target, Users2, TrendingUp, Globe2, Zap } from "lucide-react";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const reasons = [
    { icon: Target, titleKey: "whyChooseUs.r1Title", descKey: "whyChooseUs.r1Desc" },
    { icon: Zap, titleKey: "whyChooseUs.r2Title", descKey: "whyChooseUs.r2Desc" },
    { icon: Users2, titleKey: "whyChooseUs.r3Title", descKey: "whyChooseUs.r3Desc" },
    { icon: TrendingUp, titleKey: "whyChooseUs.r4Title", descKey: "whyChooseUs.r4Desc" },
    { icon: Globe2, titleKey: "whyChooseUs.r5Title", descKey: "whyChooseUs.r5Desc" },
    { icon: CheckCircle2, titleKey: "whyChooseUs.r6Title", descKey: "whyChooseUs.r6Desc" },
  ];

  const stats = [
    { key: "stat1", labelKey: "whyChooseUs.stat1Label" },
    { key: "stat2", labelKey: "whyChooseUs.stat2Label" },
    { key: "stat3", labelKey: "whyChooseUs.stat3Label" },
    { key: "stat4", labelKey: "whyChooseUs.stat4Label" },
  ];

  return (
    <section id="why-choose-us" className="py-section-lg bg-background relative overflow-hidden" itemScope itemType="https://schema.org/AboutPage">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("whyChooseUs.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">{t("whyChooseUs.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed" itemProp="description">{t("whyChooseUs.subtitle")}</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4 md:gap-8 mb-12 md:mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm gpu-accelerated">
                <CardHeader>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg md:text-2xl font-bold group-hover:text-primary transition-colors">{t(reason.titleKey)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t(reason.descKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-primary/20">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{t("whyChooseUs.statsTitle")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              {stats
                // Empty value = intentionally retired stat, not a bug. See Hero.tsx.
                .filter((s) => t(`whyChooseUs.${s.key}`).trim() !== "")
                .map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{t(`whyChooseUs.${s.key}`)}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{t(s.labelKey)}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
