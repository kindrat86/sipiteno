import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, Building2, DollarSign, CheckCircle, TrendingUp, Lightbulb, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { getCountryBySlug } from "@/data/countries";
import { COUNTRIES, REGIONS } from "@/data/countries";
import { ALL_SERVICE_SLUGS } from "@/data/countryServices";

const serviceLabels: Record<string, string> = {
  "ai-consulting": "AI Consulting",
  "business-development": "Business Development",
  "digital-marketing": "Digital Marketing",
  "it-consulting": "IT Consulting",
  "project-management": "Project Management",
  "sales-funnel": "Sales Funnel Setup",
};

const LocationPage = () => {
  const { country: countrySlug } = useParams<{ country: string }>();
  const country = getCountryBySlug(countrySlug || "");
  const isListingPage = !countrySlug;

  // If it's the listing page
  if (isListingPage) {
    return <LocationsListing />;
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16 container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground mb-6">We don't have a page for this country yet.</p>
          <Link to="/locations" className="text-primary underline">Browse all locations</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `Business Consulting in ${country.name} | Sipiteno - ${country.capital}`;
  const canonicalUrl = `https://sipiteno.com/locations/${country.slug}`;
  const description = `Sipiteno provides business development, AI consulting, IT solutions, and digital marketing services in ${country.name}. Local presence in ${country.capital} with expertise across ${country.region}. ${country.techHub} is our operational hub.`;

  const regionCountries = COUNTRIES.filter(c => c.region === country.region && c.slug !== country.slug).slice(0, 4);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        url={canonicalUrl}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Locations", url: "https://sipiteno.com/locations" },
          { name: country.name, url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero */}
          <section className="container mx-auto px-6 mb-16">
            <Link to="/locations" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Locations
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-2xl">{country.flag}</span>
                <span className="text-primary font-semibold text-sm">{country.region}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Business Services in {country.name}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                Sipiteno offers comprehensive business development, AI consulting, IT solutions, and digital marketing in {country.name}. Our local team in {country.capital} provides on-the-ground support for companies expanding into {country.region}.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-4">{country.name} Market Overview</h2>
                <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                  <div>
                    <p className="mb-2"><MapPin className="w-4 h-4 inline text-primary mr-2" /><strong>Capital:</strong> {country.capital}</p>
                    <p className="mb-2"><Building2 className="w-4 h-4 inline text-primary mr-2" /><strong>Tech Hub:</strong> {country.techHub}</p>
                    <p className="mb-2"><Globe className="w-4 h-4 inline text-primary mr-2" /><strong>Languages:</strong> {country.languages.join(", ")}</p>
                  </div>
                  <div>
                    <p className="mb-2"><DollarSign className="w-4 h-4 inline text-primary mr-2" /><strong>Economy:</strong> {country.economicContext.substring(0, 80)}...</p>
                    <p className="mb-2"><TrendingUp className="w-4 h-4 inline text-primary mr-2" /><strong>Key Industries:</strong> {country.keyIndustries.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Available Services */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Services in {country.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_SERVICE_SLUGS.map(s => {
                const label = serviceLabels[s] || s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <Link key={s} to={`/locations/${country.slug}/${s}`}>
                    <Card className="h-full border-2 hover:border-primary/30 transition-colors group">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{label}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground">
                        <p className="text-sm">Learn about our {label} services in {country.name} →</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Business Context */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Business Context</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Market Opportunity
                </h3>
                <p className="text-muted-foreground leading-relaxed">{country.opportunity}</p>
              </div>
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Key Challenge
                </h3>
                <p className="text-muted-foreground leading-relaxed">{country.challenge}</p>
              </div>
            </div>
            <div className="mt-6 bg-card/50 border-2 border-border rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Business Culture
              </h3>
              <p className="text-muted-foreground leading-relaxed">{country.businessCulture}</p>
            </div>
          </section>

          {/* Nearby countries */}
          {regionCountries.length > 0 && (
            <section className="container mx-auto px-6 mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8">Other Markets in {country.region}</h2>
              <div className="flex flex-wrap gap-3">
                {COUNTRIES.filter(c => c.region === country.region).map(c => (
                  <Link
                    key={c.slug}
                    to={`/locations/${c.slug}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                      c.slug === country.slug
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Expand to {country.name}</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to explore opportunities in {country.name}? Our local team is ready to help.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/#contact">Start the Conversation</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

// Locations listing page
const LocationsListing = () => {
  const groupedMap: Record<string, typeof COUNTRIES> = {};
  REGIONS.forEach(r => {
    groupedMap[r.name] = COUNTRIES.filter(c => c.region === r.name);
  });

  const title = "Locations | Sipiteno - Business Services Across 28 Countries";
  const canonicalUrl = "https://sipiteno.com/locations";
  const description = "Sipiteno publishes market-entry research for 28 countries in Europe, the Caucasus, Central Asia, and beyond. Local presence in each market for business development, AI consulting, IT, and digital marketing services.";

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        url={canonicalUrl}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Locations", url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">28 Countries • 6 Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Our Locations
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Sipiteno delivers business services across 28 countries in Europe, Caucasus, Central Asia, and beyond. Each location page covers local market intelligence, business culture, and available services.
              </p>
            </div>

            {REGIONS.map(region => {
              const countries = groupedMap[region.name] || [];
              if (countries.length === 0) return null;
              return (
                <div key={region.name} className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">{region.name}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {countries.map(c => (
                      <Link
                        key={c.slug}
                        to={`/locations/${c.slug}`}
                        className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group hover:-translate-y-1"
                      >
                        <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">{c.flag}</span>
                        <span className="text-xs font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">
                          {c.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Not Sure Where to Start?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tell us your target markets and we'll help you build an expansion strategy.
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

export default LocationPage;
