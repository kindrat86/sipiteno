import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, CheckCircle, Target, Layout, BarChart3, Zap, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const SalesFunnel = () => {
  const schema = servicePageSchema({
    name: "Marketing Sales Funnel Setup",
    description: "Sipiteno designs and implements high-converting B2B sales funnels including landing pages, email sequences, conversion optimization, and analytics across Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/sales-funnel",
    priceRange: "$10,000 - $40,000",
    duration: "4-8 weeks"
  });

  return (
    <>
      <SEOHead
        title="Sales Funnel Setup | Sipiteno - Landing Pages, Conversion Optimization, Analytics"
        description="Sipiteno designs and implements high-converting B2B sales funnels including landing pages, conversion optimization, and analytics tracking. Projects from $10,000-$40,000 in 4-8 weeks."
        url="https://sipiteno.com/services/sales-funnel"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "Sales Funnel Setup", url: "https://sipiteno.com/services/sales-funnel" }
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
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Marketing Sales Funnel Setup</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                High-Converting Sales Funnels for B2B Growth
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno designs and implements complete sales funnels that guide B2B prospects from awareness to conversion. Every stage is optimized with data-driven insights to maximize your customer acquisition and revenue growth across emerging markets.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment Range:</strong> $10,000 - $40,000 per funnel implementation</li>
                  <li><strong>Typical Timeline:</strong> 4-8 weeks from strategy to launch</li>
                  <li><strong>Delivery Model:</strong> Fixed-price with milestone-based payments</li>
                  <li><strong>Components:</strong> Landing pages, email sequences, CRM setup, analytics</li>
                  <li><strong>Geographic Coverage:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Funnel Development Process</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>1. Funnel Strategy</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Map your customer journey and design a funnel architecture that aligns with your sales process.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Customer journey mapping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Buyer persona development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Funnel architecture and flow design</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Layout className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>2. Landing Page Design</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Create high-converting landing pages with compelling copy and UX optimized for your target audience.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Conversion-focused design and copywriting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Mobile-responsive implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Lead capture form optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <MousePointerClick className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>3. Conversion Optimization</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Continuously test and optimize every touchpoint to maximize conversion rates throughout the funnel.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>A/B testing for headlines, CTAs, and layouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Heatmap analysis and user behavior insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Form and checkout flow optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>4. Email Automation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Build automated email sequences that nurture leads and drive them toward conversion.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Welcome and onboarding sequences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Lead nurturing drip campaigns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Re-engagement and win-back flows</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>5. Analytics & Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Full-funnel analytics to measure performance and identify optimization opportunities.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Conversion tracking and attribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Revenue and ROI reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Funnel drop-off analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build Your Sales Funnel?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's design a funnel that converts your target audience into paying customers. Schedule a consultation to discuss your goals.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/#contact">Start Your Funnel</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SalesFunnel;
