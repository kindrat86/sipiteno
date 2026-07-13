import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Code2, DollarSign, ShoppingCart, Factory, Shield, HeartPulse, Sprout, Zap, Truck, CheckCircle, Globe, Search } from "lucide-react";
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

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const FILTERS = ["All", ...Array.from(new Set(INDUSTRIES.flatMap(i => i.keyServices))).sort()];

  const filtered = INDUSTRIES.filter(ind => {
    if (activeFilter !== "All" && !ind.keyServices.includes(activeFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return ind.name.toLowerCase().includes(q) || ind.description.toLowerCase().includes(q);
    }
    return true;
  });

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
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <Navigation />

        <div className="relative overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
          </div>

          <main className="pt-20 md:pt-24 pb-16">
            {/* Hero */}
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Industry Expertise</span>
                </div>

                <h1 className="text-[clamp(2rem,7vw,3.5rem)] font-black text-foreground mb-4 leading-[1.1] tracking-tight">
                  Industries
                  <span className="block text-primary">
                    We Serve
                  </span>
                </h1>

                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Deep industry knowledge combined with cross-market expertise. We help technology companies expand into emerging markets across {INDUSTRIES.length} sectors.
                </p>
              </div>
            </section>

            {/* Search + Filter — premium mobile-first */}
            <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-10">
              <div className="max-w-5xl mx-auto space-y-3">
                {/* Search */}
                <div className="relative group max-w-xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Search className="absolute z-10 pointer-events-none left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="search"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search industries..."
                      className="w-full pl-14 pr-5 py-4 md:py-5 rounded-2xl bg-card/80 backdrop-blur border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg shadow-lg"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
                {/* Filter pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all min-h-[44px] ${
                        activeFilter === f
                          ? "text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                          : "bg-card/60 backdrop-blur border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card"
                      }`}
                    >
                      {f === "All" ? "All Industries" : serviceLabels[f]?.split(" ")[0] || f}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Industry cards */}
            <section className="container mx-auto px-4 sm:px-6 mb-16">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                {filtered.map((ind, i) => {
                  const IconComp = iconMap[ind.icon] || Code2;
                  return (
                    <Link key={i} to={`/industries/${ind.slug}`}>
                      <Card className="h-full border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group overflow-hidden relative">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <IconComp className="w-7 h-7 text-primary" />
                          </div>
                          <CardTitle className="group-hover:text-primary transition-colors flex items-center justify-between">
                            {ind.name}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{ind.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ind.keyServices.map(s => (
                              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary font-medium">
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

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-5">No industries match your search.</p>
                  <Button variant="outline" onClick={() => { setSearch(""); setActiveFilter("All"); }}>Reset filters</Button>
                </div>
              )}
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative p-8 md:p-12 text-center">
                  <h2 className="text-xl md:text-3xl font-black text-foreground mb-3 md:mb-4">Your Industry Not Listed?</h2>
                  <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto">
                    We work across multiple sectors. Contact us to discuss how we can help in your specific industry.
                  </p>
                  <Button size="lg" className="shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link to="/#contact">Talk to Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default IndustriesPage;
