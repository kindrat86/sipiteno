import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

const markets = [
  { country: "Albania", flag: "🇦🇱" }, { country: "Armenia", flag: "🇦🇲" }, { country: "Azerbaijan", flag: "🇦🇿" },
  { country: "Bosnia", flag: "🇧🇦" }, { country: "Bulgaria", flag: "🇧🇬" }, { country: "Croatia", flag: "🇭🇷" },
  { country: "Cyprus", flag: "🇨🇾" }, { country: "Czech Republic", flag: "🇨🇿" }, { country: "Estonia", flag: "🇪🇪" },
  { country: "Ethiopia", flag: "🇪🇹" }, { country: "Georgia", flag: "🇬🇪" }, { country: "Greece", flag: "🇬🇷" },
  { country: "Hungary", flag: "🇭🇺" }, { country: "India", flag: "🇮🇳" }, { country: "Kazakhstan", flag: "🇰🇿" },
  { country: "Kyrgyzstan", flag: "🇰🇬" }, { country: "Latvia", flag: "🇱🇻" }, { country: "Lithuania", flag: "🇱🇹" },
  { country: "Moldova", flag: "🇲🇩" }, { country: "Montenegro", flag: "🇲🇪" }, { country: "North Macedonia", flag: "🇲🇰" },
  { country: "Poland", flag: "🇵🇱" }, { country: "Romania", flag: "🇷🇴" }, { country: "Serbia", flag: "🇷🇸" },
  { country: "Slovakia", flag: "🇸🇰" }, { country: "Slovenia", flag: "🇸🇮" }, { country: "Ukraine", flag: "🇺🇦" },
  { country: "Uzbekistan", flag: "🇺🇿" },
];

const Markets = () => {
  const { t } = useTranslation();

  const regionalItems = [
    { labelKey: "markets.r1Label", textKey: "markets.r1Text" },
    { labelKey: "markets.r2Label", textKey: "markets.r2Text" },
    { labelKey: "markets.r3Label", textKey: "markets.r3Text" },
    { labelKey: "markets.r4Label", textKey: "markets.r4Text" },
  ];

  return (
    <section id="markets" className="py-section-lg bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <Globe2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("markets.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">{t("markets.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{t("markets.subtitle")}</p>
        </div>

        <div className="max-w-6xl mx-auto mb-12 md:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {markets.map((market, index) => (
              <div key={index} className="flex flex-col items-center p-4 md:p-5 bg-card/50 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group hover:-translate-y-1 gpu-accelerated">
                <div className="text-3xl md:text-4xl mb-1.5 md:mb-2 group-hover:scale-125 transition-transform duration-300" role="img" aria-label={`${t("markets.flagOf")} ${market.country}`}>{market.flag}</div>
                <div className="text-xs md:text-xs font-medium text-center text-foreground/80 group-hover:text-primary transition-colors leading-tight">{market.country}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-border shadow-xl">
            <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-center">{t("markets.regionalTitle")}</h3>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-8">
              {regionalItems.map((item, i) => (
                <div key={i} className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="mb-2 md:mb-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 md:px-4 py-1 text-xs">{t(item.labelKey)}</Badge>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t(item.textKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
