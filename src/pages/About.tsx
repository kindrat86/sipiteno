import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Target, Lightbulb, Globe, Users, Award, CheckCircle, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  const { t } = useTranslation();
  const canonicalUrl = "https://sipiteno.com/about";

  const stats = [
    { statKey: "about.stat1", labelKey: "about.stat1Label" },
    { statKey: "about.stat2", labelKey: "about.stat2Label" },
    { statKey: "about.stat3", labelKey: "about.stat3Label" },
    { statKey: "about.stat4", labelKey: "about.stat4Label" },
  ];

  const values = [
    { icon: Target, titleKey: "about.v1Title", descKey: "about.v1Desc" },
    { icon: Lightbulb, titleKey: "about.v2Title", descKey: "about.v2Desc" },
    { icon: Users, titleKey: "about.v3Title", descKey: "about.v3Desc" },
  ];

  return (
    <>
      <SEOHead title={t("about.title")} description={t("about.description")} url={canonicalUrl}
        breadcrumbs={[{ name: "Home", url: "https://sipiteno.com/" }, { name: "About", url: canonicalUrl }]}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("common.backToHome")}
            </Link>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Quote className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">{t("about.eyebrow")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t("about.heroTitle1")} <span className="text-primary">{t("about.heroTitle2")}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("about.heroBody")}</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((item, i) => (
                <div key={i} className="bg-card/50 border border-border rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{t(item.statKey)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t(item.labelKey)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4 text-center">{t("about.backstoryLabel")}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">{t("about.backstoryTitle")}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                  <p>{t("about.backstory1")}</p>
                  <p><strong className="text-foreground">{t("about.backstory2")}</strong></p>
                  <p>{t("about.backstory3")}</p>
                  <p>{t("about.backstory4")}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4 text-center">{t("about.epiphanyLabel")}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">{t("about.epiphanyTitle")}</h2>
                <p className="text-lg text-muted-foreground mb-10 text-center max-w-3xl mx-auto">{t("about.epiphanyBody")}</p>
                <div className="space-y-6">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-start gap-5 p-6 rounded-2xl bg-card border-2 border-primary/10 hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg flex-shrink-0">{i}</div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{t(`about.e${i}Title`)}</h3>
                        <p className="text-muted-foreground leading-relaxed">{t(`about.e${i}Desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-white text-center">
                  <p className="text-xl md:text-2xl font-bold leading-tight">{t("about.epiphanyQuote")}</p>
                  <p className="text-white/80 mt-4">{t("about.epiphanyQuote2")}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4 text-center">{t("about.planLabel")}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">{t("about.planTitle")}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                  <p>{t("about.plan1")}</p>
                  <p>{t("about.plan2")}</p>
                  <p>{t("about.plan3")}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center">
                <div className="relative p-8 md:p-12 rounded-3xl border-2 border-primary/20 bg-card/50">
                  <Quote className="w-12 h-12 text-primary/20 absolute top-6 left-6" />
                  <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-6 italic">{t("about.testimonial")}</blockquote>
                  <div className="font-semibold text-foreground">{t("about.testimonialName")}</div>
                  <div className="text-sm text-muted-foreground">{t("about.testimonialCompany")}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-10 text-center">{t("about.valuesTitle")}</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {values.map((v, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <v.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{t(v.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 py-16">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-14 max-w-4xl mx-auto text-center border-2 border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("about.ctaTitle")}</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t("about.ctaBody")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="font-semibold text-lg h-14 px-8" asChild>
                  <a href="/#free-playbook">{t("common.getFreePlaybook")} <ArrowRight className="w-5 h-5 ml-2" /></a>
                </Button>
                <Button size="lg" variant="outline" className="h-14" asChild>
                  <Link to="/case-studies">{t("common.seeCaseStudies")}</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
