import { Link } from "react-router-dom";
import { ArrowLeft, Rocket, CheckCircle, Code, Layers, TestTube, Gauge, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const MicroSaaSMVP = () => {
  const schema = servicePageSchema({
    name: "MicroSaaS MVP Development",
    description: "Sipiteno delivers market-ready MicroSaaS MVPs in 4-8 weeks for $15,000-$50,000. Fixed-price engagement includes discovery, prototyping, development, testing, and deployment.",
    url: "https://sipiteno.com/services/microsaas-mvp",
    priceRange: "$15,000 - $50,000",
    duration: "4-8 weeks"
  });

  return (
    <>
      <SEOHead
        title="MicroSaaS MVP Development | Sipiteno - 4-8 Week Delivery"
        description="Sipiteno delivers market-ready MicroSaaS MVPs in 4-8 weeks for $15,000-$50,000. Fixed-price engagement includes discovery, rapid prototyping, agile development, and production deployment."
        canonicalUrl="https://sipiteno.com/services/microsaas-mvp"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "MicroSaaS MVP", url: "https://sipiteno.com/services/microsaas-mvp" }
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
                <Rocket className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">MicroSaaS MVP Development</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                From Concept to Market-Ready MVP in 4-8 Weeks
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno specializes in rapid MVP development for MicroSaaS products. Our fixed-price engagements deliver production-ready software with validated market fit, enabling founders and product teams to test hypotheses and acquire customers faster than traditional development approaches.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment:</strong> $15,000 - $50,000 fixed price (complexity dependent)</li>
                  <li><strong>Timeline:</strong> 4-8 weeks from kickoff to production deployment</li>
                  <li><strong>Tech Stack:</strong> React, Node.js, PostgreSQL, cloud-native architecture</li>
                  <li><strong>Deliverables:</strong> Production-ready application, documentation, source code ownership</li>
                  <li><strong>Post-Launch:</strong> Optional maintenance and feature development retainers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our MVP Development Process</h2>
            
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
                    <div>
                      <CardTitle className="text-xl">Discovery & Market Validation (Week 1)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Duration: 3-5 days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    We begin with intensive discovery workshops to understand your target market, validate assumptions, and define the minimum feature set that delivers core value. This phase prevents scope creep and ensures we build what matters.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Activities:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Customer persona development</li>
                        <li>• Competitive landscape analysis</li>
                        <li>• Feature prioritization (MoSCoW)</li>
                        <li>• User journey mapping</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Deliverables:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Product requirements document</li>
                        <li>• Technical architecture diagram</li>
                        <li>• Prioritized feature backlog</li>
                        <li>• Project timeline with milestones</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</div>
                    <div>
                      <CardTitle className="text-xl">UX Design & Prototyping (Week 1-2)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Duration: 5-7 days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    We create interactive prototypes that let you experience the product before development begins. This catches usability issues early and ensures alignment on user experience expectations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Activities:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Wireframe development</li>
                        <li>• UI design in Figma</li>
                        <li>• Interactive prototype creation</li>
                        <li>• Stakeholder review sessions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Deliverables:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Clickable Figma prototype</li>
                        <li>• Design system and components</li>
                        <li>• Mobile responsive layouts</li>
                        <li>• Approved visual direction</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</div>
                    <div>
                      <CardTitle className="text-xl">Agile Development Sprints (Weeks 2-6)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Duration: 3-4 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Our development team works in 1-week sprints with weekly demos and feedback sessions. You see progress continuously and can provide input that shapes the final product.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Activities:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Frontend development (React/Next.js)</li>
                        <li>• Backend API development</li>
                        <li>• Database design and implementation</li>
                        <li>• Third-party integrations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Cadence:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Daily standups (15 min async)</li>
                        <li>• Weekly demo sessions</li>
                        <li>• Continuous deployment to staging</li>
                        <li>• Real-time progress in project board</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">4</div>
                    <div>
                      <CardTitle className="text-xl">Testing & Quality Assurance (Week 6-7)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Duration: 5-7 days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Comprehensive testing ensures your MVP launches without critical bugs. We conduct functional testing, security review, and performance optimization.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Testing Types:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• End-to-end functional testing</li>
                        <li>• Cross-browser compatibility</li>
                        <li>• Mobile responsiveness</li>
                        <li>• Security vulnerability scan</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Deliverables:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Test report with coverage metrics</li>
                        <li>• Performance benchmark results</li>
                        <li>• Bug-free release candidate</li>
                        <li>• Security audit summary</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">5</div>
                    <div>
                      <CardTitle className="text-xl">Deployment & Launch (Week 7-8)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Duration: 3-5 days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    We deploy your MVP to production infrastructure with monitoring, backups, and analytics in place. You're ready to onboard customers from day one.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Activities:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Production environment setup</li>
                        <li>• CI/CD pipeline configuration</li>
                        <li>• Domain and SSL configuration</li>
                        <li>• Analytics and monitoring setup</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Deliverables:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Live production application</li>
                        <li>• Complete source code repository</li>
                        <li>• Technical documentation</li>
                        <li>• Admin dashboard and credentials</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Technology Stack</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <Code className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Frontend</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• React or Next.js</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <Layers className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Backend</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Node.js or Supabase</li>
                  <li>• PostgreSQL database</li>
                  <li>• REST or GraphQL APIs</li>
                  <li>• Authentication (OAuth, JWT)</li>
                </ul>
              </div>

              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <Gauge className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Infrastructure</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• AWS, Vercel, or similar</li>
                  <li>• CDN for static assets</li>
                  <li>• Automated backups</li>
                  <li>• SSL/TLS encryption</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build Your MicroSaaS MVP?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a free discovery call to discuss your product idea. We'll help you define scope, estimate timeline, and determine if we're the right fit.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/#contact">Start Your Project</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MicroSaaSMVP;
