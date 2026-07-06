import { Link } from "react-router-dom";
import { ArrowLeft, Monitor, CheckCircle, Cloud, Shield, Settings, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const ITConsulting = () => {
  const schema = servicePageSchema({
    name: "IT Consulting Services",
    description: "Sipiteno provides IT consulting services including digital transformation, technology assessment, and infrastructure optimization across Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/it-consulting",
    priceRange: "$15,000 - $75,000+",
    duration: "4-12 weeks"
  });

  return (
    <>
      <SEOHead
        title="IT Consulting Services | Sipiteno - Digital Transformation & Technology Assessment"
        description="Sipiteno delivers IT consulting services including digital transformation, technology stack assessment, and infrastructure optimization. Projects from $15,000-$75,000 across 28 countries."
        url="https://sipiteno.com/services/it-consulting"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "IT Consulting", url: "https://sipiteno.com/services/it-consulting" }
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
                <Monitor className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">IT Consulting Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Digital Transformation & Technology Optimization
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno provides expert IT consulting that helps businesses modernize their technology stack, optimize infrastructure, and drive digital transformation. We bridge the gap between business objectives and technical implementation across emerging markets.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment Range:</strong> $15,000 - $75,000+ depending on scope</li>
                  <li><strong>Typical Timeline:</strong> 4-12 weeks from assessment to implementation</li>
                  <li><strong>Delivery Model:</strong> Fixed-price assessments or ongoing advisory</li>
                  <li><strong>Focus Areas:</strong> Cloud migration, architecture review, DevOps, security</li>
                  <li><strong>Geographic Coverage:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">IT Consulting Services</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <RefreshCw className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Digital Transformation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">End-to-end digital transformation strategy and execution to modernize business processes and systems.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Digital maturity assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Process automation and workflow optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Change management and adoption support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Technology Stack Assessment</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Comprehensive evaluation of your current technology landscape with actionable modernization recommendations.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Architecture review and technical debt analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Vendor evaluation and selection support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Technology roadmap development</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Cloud className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Cloud Migration</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Strategic cloud migration planning and execution to reduce costs and improve scalability.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Cloud readiness assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>AWS, Azure, GCP architecture design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Migration execution and validation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Infrastructure Optimization</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Optimize your infrastructure for performance, cost-efficiency, and reliability.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Performance monitoring and bottleneck analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Cost optimization and right-sizing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>DevOps and CI/CD pipeline setup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Ensure your systems meet security standards and regional compliance requirements.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Security audit and vulnerability assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>GDPR and local data protection compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Incident response planning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Modernize Your Technology?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a free technology assessment to identify opportunities for improvement and develop a roadmap for your digital transformation.
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

export default ITConsulting;
