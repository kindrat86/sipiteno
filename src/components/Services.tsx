import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, Monitor, ClipboardList, TrendingUp, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const { t } = useTranslation();

  const services = [
    { icon: Brain, titleKey: "services.s1Title", descKey: "services.s1Desc", features: ["services.s1F1","services.s1F2","services.s1F3","services.s1F4"], href: "/services/ai-consulting" },
    { icon: Briefcase, titleKey: "services.s2Title", descKey: "services.s2Desc", features: ["services.s2F1","services.s2F2","services.s2F3","services.s2F4"], href: "/services/business-development" },
    { icon: Globe, titleKey: "services.s3Title", descKey: "services.s3Desc", features: ["services.s3F1","services.s3F2","services.s3F3","services.s3F4"], href: "/services/digital-marketing" },
    { icon: Monitor, titleKey: "services.s4Title", descKey: "services.s4Desc", features: ["services.s4F1","services.s4F2","services.s4F3","services.s4F4"], href: "/services/it-consulting" },
    { icon: TrendingUp, titleKey: "services.s5Title", descKey: "services.s5Desc", features: ["services.s5F1","services.s5F2","services.s5F3","services.s5F4"], href: "/services/sales-funnel" },
    { icon: ClipboardList, titleKey: "services.s6Title", descKey: "services.s6Desc", features: ["services.s6F1","services.s6F2","services.s6F3","services.s6F4"], href: "/services/project-management" },
  ];

  return (
    <section id="services" className="py-section-lg bg-background relative">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("services.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">{t("services.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed px-2">{t("services.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Link key={index} to={service.href} className="group block focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-2xl">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 ease-out border-2 hover:border-primary/30 hover:-translate-y-1 bg-card/50 backdrop-blur-sm gpu-accelerated">
                <CardHeader className="pb-3 md:pb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110 gpu-accelerated">
                    <service.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl mb-2 md:mb-3 leading-tight group-hover:text-primary transition-colors">{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4 md:mb-6 leading-relaxed">{t(service.descKey)}</CardDescription>
                  <ul className="space-y-2 md:space-y-2.5" aria-label={`${t(service.titleKey)} ${t("services.featuresLabel")}`}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2.5 md:mr-3 flex-shrink-0" />
                        <span>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
