import { Link } from "react-router-dom";
import { CheckCircle, DollarSign, Clock, FileCheck, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const pricingPlans = [
  {
    name: "Business Development Retainer",
    subtitle: "B2B Lead Generation & Partnerships",
    price: "$3,000 – $10,000",
    period: "/month",
    description: "Ongoing business development support including lead generation, partnership facilitation, and market intelligence.",
    features: [
      "10-30 qualified leads per month",
      "Partnership identification and introductions",
      "Monthly market intelligence reports",
      "CRM integration and pipeline management",
      "Dedicated account manager",
      "Quarterly strategy review"
    ],
    highlighted: false,
  },
  {
    name: "MicroSaaS MVP Development",
    subtitle: "Rapid Product Build",
    price: "$15,000 – $50,000",
    period: "fixed price",
    description: "Full-cycle MVP development from concept to deployment in 4-8 weeks. Includes design, build, and launch.",
    features: [
      "Discovery workshop and scope definition",
      "Design system and UI/UX development",
      "Full-stack development (React + Supabase)",
      "Production deployment and domain setup",
      "Post-launch monitoring (30 days)",
      "Knowledge transfer and handover"
    ],
    highlighted: true,
  },
  {
    name: "AI Consulting Project",
    subtitle: "Strategy Through Implementation",
    price: "$25,000 – $100,000+",
    period: "project",
    description: "End-to-end AI consulting including strategy development, ML model implementation, and system integration.",
    features: [
      "AI readiness assessment",
      "Use case prioritization and roadmap",
      "Custom ML model development",
      "API integration and deployment",
      "Team training and documentation",
      "3-month post-launch optimization"
    ],
    highlighted: false,
  },
  {
    name: "IT Consulting",
    subtitle: "Technology Assessment & Transformation",
    price: "$15,000 – $75,000",
    period: "project",
    description: "Technology stack assessment, cloud migration planning, architecture review, and implementation support.",
    features: [
      "Current state assessment and gap analysis",
      "Architecture design and recommendations",
      "Vendor evaluation and selection support",
      "Implementation roadmap and milestones",
      "Security audit and compliance check",
      "Knowledge transfer and runbooks"
    ],
    highlighted: false,
  },
  {
    name: "Sales Funnel Setup",
    subtitle: "Conversion Architecture",
    price: "$10,000 – $40,000",
    period: "project",
    description: "Complete sales funnel design and implementation including landing pages, email automation, and analytics.",
    features: [
      "Funnel strategy and customer journey mapping",
      "3-5 high-converting landing pages",
      "Email automation sequences setup",
      "CRM and analytics integration",
      "A/B testing framework",
      "30-day optimization support"
    ],
    highlighted: false,
  },
  {
    name: "Project Management",
    subtitle: "Agile Delivery Oversight",
    price: "$5,000 – $20,000",
    period: "/month",
    description: "Dedicated or fractional project management for technology projects across distributed teams.",
    features: [
      "Agile/Scrum methodology implementation",
      "Sprint planning and backlog management",
      "Risk register and mitigation tracking",
      "Stakeholder communication and reporting",
      "Multi-timezone team coordination",
      "Quality assurance and release management"
    ],
    highlighted: false,
  },
  {
    name: "Digital Marketing Retainer",
    subtitle: "SEO, Content & Social Media",
    price: "Custom",
    period: "pricing",
    description: "Comprehensive digital marketing services tailored to B2B technology companies targeting emerging markets.",
    features: [
      "Technical SEO audit and implementation",
      "Content strategy and creation (multilingual)",
      "LinkedIn and social media management",
      "Email marketing and drip campaigns",
      "Monthly performance dashboards",
      "Conversion tracking and optimization"
    ],
    highlighted: false,
  },
  {
    name: "Hourly Consulting",
    subtitle: "Ad-Hoc Expert Advice",
    price: "$150 – $300",
    period: "/hour",
    description: "Access senior expertise for specific challenges — market intelligence, strategy sessions, technology guidance.",
    features: [
      "Senior consultant (15+ years experience)",
      "Flexible engagement (minimum 4 hours)",
      "Same-week availability",
      "Written summary and recommendations",
      "Follow-up support included",
      "Confidentiality agreement included"
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  const title = "Pricing | Sipiteno - Business & Technology Consulting Rates";
  const canonicalUrl = "https://sipiteno.com/pricing";
  const description = "Transparent pricing for Sipiteno services: Business Development $3K-$10K/month, AI Consulting $25K-$100K+, MicroSaaS MVP $15K-$50K fixed price, IT Consulting $15K-$75K. Hourly consulting $150-$300/hr.";

  const schema = servicePageSchema({
    name: "Sipiteno Service Pricing",
    description: "Complete pricing guide for all Sipiteno business and technology consulting services.",
    url: canonicalUrl,
    priceRange: "$150/hr - $100,000+",
    duration: "4 weeks - ongoing"
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
          { name: "Pricing", url: canonicalUrl }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Investment & Pricing</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Transparent Pricing for Every Engagement
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We offer flexible engagement models — fixed-price projects, monthly retainers, or hourly consulting. 
                Every engagement includes a free 30-minute scoping call to determine the right approach for your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <Card key={i} className={`h-full border-2 transition-all duration-300 flex flex-col ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/10 scale-[1.02] relative"
                    : "border-border hover:border-primary/30 hover:shadow-lg"
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={`${plan.highlighted ? "pt-8" : ""}`}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="lg"
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                      asChild
                    >
                      <Link to="/#contact">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Payment terms */}
          <section className="container mx-auto px-6 mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How We Work</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Milestone-Based Billing</h3>
                  <p className="text-sm text-muted-foreground">30-50% upfront, balance upon milestone delivery. Aligns our incentives with your results.</p>
                </div>
                <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Free Scoping Call</h3>
                  <p className="text-sm text-muted-foreground">30-minute discovery call to understand your needs and recommend the right engagement model.</p>
                </div>
                <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Dedicated Team</h3>
                  <p className="text-sm text-muted-foreground">Every engagement includes a dedicated account manager and access to our full team expertise.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Not Sure Which Plan Fits?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a free 30-minute consultation. We'll discuss your goals, scope the work, and recommend the best engagement model.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/#contact">Book a Free Call</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
