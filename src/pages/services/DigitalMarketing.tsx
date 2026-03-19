import { Link } from "react-router-dom";
import { ArrowLeft, Globe, CheckCircle, Search, Share2, Mail, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const DigitalMarketing = () => {
  const schema = servicePageSchema({
    name: "Digital Marketing Services",
    description: "Sipiteno delivers B2B digital marketing services including SEO, SEM, content marketing, and social media management for technology companies across Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/digital-marketing",
    priceRange: "Custom pricing based on scope",
    duration: "Ongoing retainer"
  });

  return (
    <>
      <SEOHead
        title="Digital Marketing Services | Sipiteno - SEO, Content Marketing, Social Media"
        description="Sipiteno provides B2B digital marketing services including SEO, SEM, content marketing, and social media management for technology companies across 28 countries."
        canonicalUrl="https://sipiteno.com/services/digital-marketing"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "Digital Marketing", url: "https://sipiteno.com/services/digital-marketing" }
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
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Digital Marketing Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                B2B Digital Marketing for Technology Companies
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno delivers comprehensive digital marketing services optimized for B2B technology companies targeting European and Central Asian markets. Our strategies combine technical SEO expertise with localized content marketing to drive qualified leads and brand visibility.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment:</strong> Custom pricing based on scope and market coverage</li>
                  <li><strong>Engagement Model:</strong> Monthly retainer with performance reporting</li>
                  <li><strong>Key Services:</strong> SEO, SEM, content marketing, social media, email marketing</li>
                  <li><strong>Markets:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                  <li><strong>Languages:</strong> Content in English, Russian, and 4+ regional languages</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Digital Marketing Services</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>SEO & SEM</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Technical and on-page SEO optimization combined with targeted search advertising to capture high-intent B2B traffic.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Technical SEO audit and implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Keyword research for regional markets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Google Ads and LinkedIn Ads management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Content Marketing</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Strategic content creation that positions your brand as a thought leader in target markets and drives organic growth.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Blog posts, whitepapers, and case studies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Multilingual content localization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Content calendar and editorial strategy</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Social Media Management</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Build brand presence and engage decision-makers on LinkedIn, Twitter, and regional platforms.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>LinkedIn thought leadership campaigns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Community building and engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Social listening and competitor analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Email Marketing</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Nurture leads and drive conversions with targeted email campaigns tailored for B2B audiences.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Drip campaign design and automation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Newsletter strategy and execution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>A/B testing and performance optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Analytics & Reporting</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Data-driven insights to measure ROI and continuously optimize your marketing spend.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Google Analytics and attribution setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Monthly performance dashboards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Conversion tracking and funnel analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Grow Your Digital Presence?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a consultation to discuss your target markets and develop a digital marketing strategy that drives measurable results.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
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

export default DigitalMarketing;
