import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quoteKey: "t1Quote", nameKey: "t1Name", companyKey: "t1Company",
      locationKey: "t1Location", metricKey: "t1Metric",
    },
    {
      quoteKey: "t2Quote", nameKey: "t2Name", companyKey: "t2Company",
      locationKey: "t2Location", metricKey: "t2Metric",
    },
    {
      quoteKey: "t3Quote", nameKey: "t3Name", companyKey: "t3Company",
      locationKey: "t3Location", metricKey: "t3Metric",
    },
    {
      quoteKey: "t4Quote", nameKey: "t4Name", companyKey: "t4Company",
      locationKey: "t4Location", metricKey: "t4Metric",
    },
  ];

  const stats = [
    { valueKey: "testimonials.stat1", labelKey: "testimonials.stat1Label" },
    { valueKey: "testimonials.stat2", labelKey: "testimonials.stat2Label" },
    { valueKey: "testimonials.stat3", labelKey: "testimonials.stat3Label" },
    { valueKey: "testimonials.stat4", labelKey: "testimonials.stat4Label" },
  ];

  return (
    <section id="testimonials" className="py-section-lg bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">
              {t("testimonials.eyebrow")}
            </span>
          </div>
          <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            {t("testimonials.title")}
          </h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 max-w-5xl mx-auto">
            {stats
              // A stat with an empty value is intentionally omitted, not broken:
              // this is how an unsubstantiated figure is retired without leaving
              // a hole in the grid (and without inventing a replacement number).
              .filter((s) => t(s.valueKey).trim() !== "")
              .map((s, i) => (
                <div key={i} className="text-center p-3">
                  <div className="text-3xl md:text-5xl font-bold text-primary mb-1 md:mb-2">{t(s.valueKey)}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{t(s.labelKey)}</div>
                </div>
              ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.map((tItem, i) => (
              <div
                key={i}
                className="relative p-6 md:p-8 rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl transition-all duration-300 gpu-accelerated"
              >
                <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/20 absolute top-4 md:top-6 right-4 md:right-6" />
                <div className="flex gap-1 mb-3 md:mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 md:w-5 md:h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg leading-relaxed mb-5 md:mb-6">
                  &ldquo;{t(`testimonials.${tItem.quoteKey}`)}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="font-semibold text-sm md:text-base">{t(`testimonials.${tItem.nameKey}`)}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{t(`testimonials.${tItem.companyKey}`)}</div>
                    <div className="text-xs text-muted-foreground">{t(`testimonials.${tItem.locationKey}`)}</div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                    <span className="text-xs md:text-sm font-bold text-primary">{t(`testimonials.${tItem.metricKey}`)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs md:text-sm text-muted-foreground mt-6 md:mt-8 max-w-2xl mx-auto">
            {t("testimonials.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
