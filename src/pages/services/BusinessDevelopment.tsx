import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, CheckCircle, Target, Users, Globe, Handshake, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const BusinessDevelopment = () => {
  const schema = servicePageSchema({
    name: "B2B Business Development Services",
    description: "Sipiteno provides B2B business development services including strategic partnerships, lead generation, and market entry across 28 countries in Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/business-development",
    priceRange: "$3,000 - $10,000/month",
    duration: "Ongoing retainer"
  });

  return (
    <>
      <SEOHead
        title="B2B Business Development | Sipiteno - Partnerships & Lead Generation"
        description="Sipiteno delivers B2B business development services including strategic partnerships, lead generation, and market entry across 28 countries. Monthly retainers from $3,000-$10,000."
        canonicalUrl="https://sipiteno.com/services/business-development"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "Business Development", url: "https://sipiteno.com/services/business-development" }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">B2B Business Development</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Strategic Partnerships & Market Expansion Across 28 Countries
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno accelerates B2B growth through established networks, strategic partnerships, and proven lead generation methodologies across Europe, Caucasus, and Central Asia. With 15+ years of regional experience, we open doors that would otherwise take years to access.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment:</strong> $3,000 - $10,000/month retainer (scope dependent)</li>
                  <li><strong>Engagement Model:</strong> Monthly retainer with performance metrics</li>
                  <li><strong>Geographic Coverage:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                  <li><strong>Key Services:</strong> Lead generation, partnership development, market entry</li>
                  <li><strong>Typical Results:</strong> 10-30 qualified leads/month depending on market</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Business Development Services</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Lead Generation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Systematic identification and qualification of potential customers in your target markets. We combine database research, LinkedIn outreach, and warm introductions from our network.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Target account identification and prioritization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Multi-channel outreach campaigns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Lead qualification and scoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>CRM integration and pipeline management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Handshake className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Strategic Partnerships</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Identify, negotiate, and structure partnerships that accelerate your market position. We leverage our existing relationships with technology companies, distributors, and industry associations.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Partner identification and vetting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Relationship facilitation and introductions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Deal structuring and negotiation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Partnership agreement review</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Market Entry Strategy</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Comprehensive market research and entry planning for companies expanding into Eastern Europe, Caucasus, and Central Asia. We reduce risk through local knowledge and established presence.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Market sizing and opportunity assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Competitive landscape analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Regulatory and compliance guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Go-to-market strategy development</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Sales Enablement</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Support your sales team with local market intelligence, cultural guidance, and meeting facilitation. We help close deals that require regional expertise.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Sales meeting preparation and briefings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Cultural and business etiquette guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Translation and localization support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>In-person meeting facilitation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Network Section */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Regional Network</h2>
            
            <div className="bg-card/50 border-2 border-border rounded-xl p-8">
              <p className="text-lg text-muted-foreground mb-6">
                Sipiteno maintains active relationships with key stakeholders across 28 countries, built over 15+ years of regional operations:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Government & Institutions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Trade promotion agencies</li>
                    <li>• Investment attraction offices</li>
                    <li>• Technology ministry contacts</li>
                    <li>• Economic development bodies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Business Community</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Technology associations</li>
                    <li>• Chambers of commerce</li>
                    <li>• Industry-specific groups</li>
                    <li>• Startup ecosystems</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Investment & Advisory</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Venture capital firms</li>
                    <li>• Private equity groups</li>
                    <li>• Legal and tax advisors</li>
                    <li>• M&A specialists</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Expand Your Market Reach?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a call to discuss your target markets and growth objectives. We'll share relevant case studies and outline how we can accelerate your expansion.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/#contact">Discuss Your Goals</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BusinessDevelopment;
