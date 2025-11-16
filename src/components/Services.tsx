import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, Users, Monitor, Rocket, ClipboardList, TrendingUp, Briefcase } from "lucide-react";

type Service = {
  icon: typeof Brain;
  title: string;
  description: string;
  features: string[];
  showcase?: {
    title: string;
    name: string;
    description: string;
    link: string;
  };
};

const services: Service[] = [
  {
    icon: Brain,
    title: "AI Consulting",
    description: "AI implementation, strategy development, and intelligent automation solutions. Leverage cutting-edge artificial intelligence to drive innovation and competitive advantage.",
    features: ["AI Strategy", "Machine Learning", "Intelligent Automation", "AI Implementation"]
  },
  {
    icon: Briefcase,
    title: "Business Development B2B",
    description: "Strategic B2B partnerships, lead generation, and business growth strategies. Expand your enterprise client base and build lasting business relationships.",
    features: ["Partnership Development", "Lead Generation", "Market Entry Strategy", "Deal Structuring"]
  },
  {
    icon: Globe,
    title: "Digital Marketing",
    description: "Comprehensive digital marketing solutions including SEO, content marketing, and social media management. Drive traffic and convert visitors into customers.",
    features: ["SEO & SEM", "Content Marketing", "Social Media Management", "Email Marketing"]
  },
  {
    icon: Users,
    title: "HR / Recruitment",
    description: "Talent acquisition, team building, and HR consulting for tech companies expanding across Europe, Caucasus, and Central Asia. Access top talent and build high-performing teams.",
    features: ["Talent Sourcing", "Technical Recruiting", "Team Building", "HR Compliance"]
  },
  {
    icon: Monitor,
    title: "IT Consulting",
    description: "Technology assessment, digital transformation, and IT infrastructure optimization. Expert guidance to modernize your technology stack and operations.",
    features: ["Digital Transformation", "Technology Stack Assessment", "Infrastructure Optimization", "Implementation Support"]
  },
  {
    icon: TrendingUp,
    title: "Marketing Sales Funnel Setup",
    description: "Design and implement high-converting sales funnels that guide prospects from awareness to conversion. Optimize every stage of your customer journey.",
    features: ["Funnel Strategy", "Landing Page Design", "Conversion Optimization", "Analytics & Tracking"]
  },
  {
    icon: Rocket,
    title: "MVP Micro SaaS Development",
    description: "Rapid prototyping, market validation, and technical architecture for MicroSaaS solutions. From concept to launch in weeks, not months.",
    features: ["Rapid Prototyping", "Market Validation", "Scalable Architecture", "Technical Advisory"],
    showcase: {
      title: "Our MicroSaaS MVP",
      name: "FunnelFixer",
      description: "AI-powered funnel analyzer that audits sales funnels against Russell Brunson's proven frameworks in 60 seconds. Built to help funnel builders identify and fix conversion-killing issues.",
      link: "https://funnelfixer.site/"
    }
  },
  {
    icon: ClipboardList,
    title: "Project Management",
    description: "End-to-end project management services using agile methodologies. Ensure on-time delivery, budget control, and stakeholder alignment throughout your project lifecycle.",
    features: ["Agile & Scrum", "Resource Planning", "Risk Management", "Stakeholder Communication"]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions to accelerate your business growth in emerging tech markets
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-2"
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.showcase && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold text-primary mb-2">{service.showcase.title}</h4>
                    <a 
                      href={service.showcase.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <p className="font-semibold text-foreground mb-1">{service.showcase.name}</p>
                      <p className="text-sm text-muted-foreground">{service.showcase.description}</p>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
