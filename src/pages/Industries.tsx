import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Code2, DollarSign, ShoppingCart, Factory, Shield, HeartPulse, Sprout, Zap, Truck, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";
import { INDUSTRIES, getIndustryBySlug } from "@/data/industries";

const iconMap: Record<string, React.ElementType> = {
  Code: Code2, DollarSign, ShoppingCart, Factory, Shield,
  HeartPulse, Sprout, Zap, Truck
};

const serviceLabels: Record<string, string> = {
  "ai-consulting": "AI Consulting",
  "business-development": "Business Development",
  "digital-marketing": "Digital Marketing",
  "it-consulting": "IT Consulting",
  "project-management": "Project Management",
  "sales-funnel": "Sales Funnel Setup",
};

const IndustriesPage = () => {
  const { industry: industrySlug } = useParams<{ industry: string }>();
  const isListing = !industrySlug;

  if (isListing) {
    return <IndustriesListing />;
  }

  const industry = getIndustryBySlug(industrySlug);
  if (!industry) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16 container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Industry Not Found</h1>
          <Link to="/industries" className="text-primary underline">Browse all industries</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComp = iconMap[industry.icon] || Code2;
  const title = `${industry.name} Consulting | Sipiteno - ${industry.description.substring(0, 60)}...`;
  const canonicalUrl = `https://sipiteno.com/industries/${industry.slug}`;
  const description = `Sipiteno provides specialized ${industry.name.toLowerCase()} consulting services. ${industry.description}`;

  const schema = servicePageSchema({
    name: `${industry.name} Consulting Services`,
    description,
    url: canonicalUrl,
    priceRange: "Varies by scope",
    duration: "4-16 weeks"
  });

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        url={canonicalUrl}
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Industries", url: "https://sipiteno.com/industries" },
          { name: industry.name, url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <Link to="/industries" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Industries
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <IconComp className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">{industry.name}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {industry.name} Consulting
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {industry.description}
              </p>

              {/* Key Services */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Relevant Services</h2>
                <div className="flex flex-wrap gap-3">
                  {industry.keyServices.map(s => (
                    <span key={s} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                      {serviceLabels[s] || s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Challenges & Opportunities */}
          <section className="container mx-auto px-6 mb-16">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="bg-card/50 border-2 border-border rounded-xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Challenges We Solve</h3>
                <ul className="space-y-4">
                  {industry.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card/50 border-2 border-border rounded-xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Opportunities We Unlock</h3>
                <ul className="space-y-4">
                  {industry.opportunities.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Active Markets */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Active Markets</h2>
            <div className="flex flex-wrap gap-3">
              {industry.relevantCountries.map(c => (
                <Link
                  key={c}
                  to={`/locations/${c.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {c}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your {industry.name} Business?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a consultation to explore how we can help you grow in emerging markets.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/#contact">Get Started</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

const IndustriesListing = () => {
  const title = "Industries | Sipiteno - Specialized Consulting Across Sectors";
  const canonicalUrl = "https://sipiteno.com/industries";
  const description = "Sipiteno serves technology companies across SaaS, fintech, e-commerce, manufacturing, cybersecurity, healthcare, agtech, energy, and logistics. Industry-specific consulting for emerging markets.";

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        url={canonicalUrl}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Industries", url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Industry Expertise</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Industries We Serve
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Deep industry knowledge combined with cross-market expertise. We help technology companies expand into emerging markets across every major sector.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {INDUSTRIES.map((ind, i) => {
                const IconComp = iconMap[ind.icon] || Code2;
                return (
                  <Link key={i} to={`/industries/${ind.slug}`}>
                    <Card className="h-full border-2 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                      <CardHeader>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <IconComp className="w-7 h-7 text-primary" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{ind.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{ind.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ind.keyServices.map(s => (
                            <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/5 text-primary">
                              {serviceLabels[s]?.split(" ")[0] || s}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Industry Not Listed?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We work across multiple sectors. Contact us to discuss how we can help in your specific industry.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/#contact">Talk to Us</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default IndustriesPage;
