// Reusable country service page template factory
// This is used at build time to create individual country pages

import { Link } from "react-router-dom";
import { ArrowLeft, Target, Handshake, Globe, TrendingUp, CheckCircle, Building2, MapPin, DollarSign, Brain, Zap, BarChart3, Users, Search, FileText, Share2, Mail, RefreshCw, Settings, Cloud, Shield, ClipboardList, AlertTriangle, Layout, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";
import { CountryInfo } from "@/data/countries";
import { CountryServiceInfo } from "@/data/countryServices";

interface CountryServicePageProps {
  country: CountryInfo;
  service: CountryServiceInfo;
  serviceLabel: string;
}

const iconMap: Record<string, React.ElementType> = {
  Target, Handshake, Globe, TrendingUp,
  Brain, Zap, BarChart3, Users, Search, FileText, Share2, Mail, RefreshCw, Settings, Cloud, Shield, ClipboardList, AlertTriangle, Layout, MousePointerClick,
};

const CountryServicePage = ({ country, service, serviceLabel }: CountryServicePageProps) => {
  const title = `${serviceLabel} in ${country.name} | Sipiteno - ${country.techHub}`;
  const canonicalUrl = `https://sipiteno.com/locations/${country.slug}/${service.serviceSlug}`;
  const description = `Sipiteno provides ${service.serviceName.toLowerCase()} services in ${country.name} through remote delivery for clients across ${country.region}.`;

  const schema = servicePageSchema({
    name: `${serviceLabel} in ${country.name}`,
    description,
    url: canonicalUrl,
    priceRange: "$3,000 - $100,000+",
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
          { name: "Locations", url: "https://sipiteno.com/locations" },
          { name: country.name, url: `https://sipiteno.com/locations/${country.slug}` },
          { name: serviceLabel, url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 mb-16">
            <Link to={`/locations/${country.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to {country.name}
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-2xl">{country.flag}</span>
                <span className="text-primary font-semibold text-sm">{country.name}</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-primary font-semibold text-sm">{serviceLabel}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {serviceLabel} in {country.name}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno delivers {service.serviceName.toLowerCase()} services in {country.name} with deep local knowledge and on-the-ground presence. {country.opportunity}
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Why {country.name}?</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><MapPin className="w-4 h-4 inline text-primary mr-2" /><strong>Capital:</strong> {country.capital}</li>
                  <li><Building2 className="w-4 h-4 inline text-primary mr-2" /><strong>Tech Hub:</strong> {country.techHub}</li>
                  <li><Globe className="w-4 h-4 inline text-primary mr-2" /><strong>Key Industries:</strong> {country.keyIndustries.join(", ")}</li>
                  <li><DollarSign className="w-4 h-4 inline text-primary mr-2" /><strong>Economic Context:</strong> {country.economicContext}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Highlights */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {serviceLabel} Services in {country.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {service.highlights.map((item, i) => {
                const IconComponent = iconMap[item.icon] || Target;
                return (
                  <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Business Culture & Approach */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Doing Business in {country.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Business Culture</h3>
                <p className="text-muted-foreground leading-relaxed">{country.businessCulture}</p>
              </div>
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Key Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">{country.challenge}</p>
              </div>
            </div>

            <div className="mt-6 bg-card/50 border-2 border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Our Approach</h3>
              <ul className="space-y-3 text-muted-foreground">
                {service.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Related Services */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Other Services in {country.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["ai-consulting", "business-development", "digital-marketing", "it-consulting", "project-management", "sales-funnel"]
                .filter(s => s !== service.serviceSlug)
                .slice(0, 3)
                .map(s => (
                  <Link key={s} to={`/locations/${country.slug}/${s}`} className="group p-5 rounded-xl border-2 border-border hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <ArrowLeft className="w-5 h-5 text-primary rotate-180" />
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                      {s.replace(/-/g, " ")}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Learn more</p>
                  </Link>
                ))}
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Start in {country.name}?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a consultation to discuss your {serviceLabel.toLowerCase()} needs in {country.name}. We'll share relevant case studies and outline our approach.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/#contact">Discuss Your Project</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CountryServicePage;
