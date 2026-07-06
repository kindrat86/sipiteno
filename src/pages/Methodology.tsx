import { Link } from "react-router-dom";
import { ArrowLeft, Target, Lightbulb, Zap, BarChart3, Users, Brain, CheckCircle, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const phases = [
  {
    number: "01",
    icon: Target,
    title: "Discovery & Assessment",
    duration: "Week 1",
    description: "We start by understanding your business, market, and objectives. This phase establishes the foundation for everything that follows.",
    items: [
      "Stakeholder interviews and business goals alignment",
      "Market opportunity sizing and competitive analysis",
      "Technical readiness assessment (if applicable)",
      "Risk identification and mitigation planning",
      "Success criteria definition and KPI baseline"
    ],
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/20"
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Strategy & Roadmap",
    duration: "Week 2",
    description: "We develop a clear, actionable strategy with phased milestones, resource requirements, and expected outcomes.",
    items: [
      "Strategic option analysis and recommendation",
      "Detailed project scope and deliverables",
      "Technology stack and vendor recommendations",
      "Phased implementation roadmap with milestones",
      "Budget refinement and resource allocation"
    ],
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/20"
  },
  {
    number: "03",
    icon: Zap,
    title: "Rapid Implementation",
    duration: "Weeks 3-6",
    description: "We execute in short, high-velocity sprints with regular checkpoints. This is where ideas become working solutions.",
    items: [
      "Agile sprint planning and daily standups",
      "Weekly progress reviews with stakeholders",
      "Continuous integration and testing",
      "Mid-sprint checkpoints for course correction",
      "Regular demo and feedback sessions"
    ],
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/20"
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Testing & Launch",
    duration: "Week 7",
    description: "Rigorous testing, user acceptance validation, and production deployment. We don't ship until it's ready.",
    items: [
      "User acceptance testing (UAT)",
      "Performance and security testing",
      "Production deployment and DNS setup",
      "Monitoring and alerting configuration",
      "Go-live checklist sign-off"
    ],
    color: "from-green-500/20 to-green-500/5 border-green-500/20"
  },
  {
    number: "05",
    icon: Users,
    title: "Knowledge Transfer",
    duration: "Week 8",
    description: "We ensure your team can operate, maintain, and build on what we've delivered. No vendor lock-in, ever.",
    items: [
      "Comprehensive documentation and runbooks",
      "Hands-on training sessions for your team",
      "Admin dashboard walkthrough",
      "Ongoing support transition planning",
      "SLA definition and escalation paths"
    ],
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/20"
  },
  {
    number: "06",
    icon: Brain,
    title: "Continuous Optimization",
    duration: "Ongoing",
    description: "Post-launch monitoring, performance tracking, and iterative improvements to maximize long-term value.",
    items: [
      "Monthly performance reporting",
      "Data-driven optimization recommendations",
      "Feature enhancement planning",
      "Market adaptation and localization updates",
      "Quarterly strategic alignment reviews"
    ],
    color: "from-teal-500/20 to-teal-500/5 border-teal-500/20"
  }
];

const Methodology = () => {
  const title = "How We Work | Sipiteno Methodology - 6-Phase Delivery Process";
  const canonicalUrl = "https://sipiteno.com/methodology";
  const description = "Sipiteno's 6-phase delivery methodology: Discovery, Strategy, Implementation, Testing, Knowledge Transfer, and Continuous Optimization. We deliver projects in 4-8 weeks with weekly transparency.";

  const schema = servicePageSchema({
    name: "Sipiteno 6-Phase Delivery Methodology",
    description,
    url: canonicalUrl,
    priceRange: "Varies by project",
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
          { name: "Methodology", url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero */}
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Our Process</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                How We Deliver: The Sipiteno Method
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We combine strategic thinking with hands-on implementation. Every engagement follows a proven 6-phase methodology 
                designed to deliver measurable results in weeks, not months. Weekly transparency is built into our process.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { number: "4-8", label: "Weeks to ship", icon: Clock },
                { number: "6", label: "Phases", icon: Brain },
                { number: "50+", label: "Projects delivered", icon: CheckCircle },
                { number: "100%", label: "Weekly transparency", icon: BarChart3 },
              ].map((stat, i) => (
                <div key={i} className="bg-card/50 border border-border rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Phases */}
          <section className="container mx-auto px-6 mb-16">
            <div className="max-w-5xl mx-auto space-y-8">
              {phases.map((phase, i) => (
                <div key={i} className={`bg-gradient-to-br ${phase.color} border-2 rounded-2xl p-8 md:p-10`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Phase number and icon */}
                    <div className="flex-shrink-0 text-center md:text-left">
                      <div className="text-5xl font-bold text-foreground/10 -mt-2">{phase.number}</div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mt-2 mx-auto md:mx-0">
                        <phase.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    
                    {/* Middle: Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-foreground">{phase.title}</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{phase.description}</p>
                      <ul className="space-y-2.5">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Right: Arrow connector (except last) */}
                    {i < phases.length - 1 && (
                      <div className="hidden md:flex items-center">
                        <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Principles */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <CardTitle>Weekly Transparency</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  You get a written weekly update with progress, blockers, and next steps. No surprises, no black boxes.
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <CardTitle>No Vendor Lock-In</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  All code, documentation, and IP belongs to you. We build for your team to take over day one.
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <CardTitle>Outcome Orientation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  We measure success by business outcomes, not hours billed or lines of code. Every phase has defined KPIs.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Ship?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a free 30-minute call. We'll walk through your project using our methodology and show you what's possible.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href="https://calendly.com/sipiteno" target="_blank" rel="noopener noreferrer">Book a Free Call</a>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Methodology;
