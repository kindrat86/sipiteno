import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, Monitor, ClipboardList, TrendingUp, Briefcase } from "lucide-react";

type Service = {
  icon: typeof Brain;
  title: string;
  description: string;
  features: string[];
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
    icon: ClipboardList,
    title: "Project Management",
    description: "End-to-end project management services using agile methodologies. Ensure on-time delivery, budget control, and stakeholder alignment throughout your project lifecycle.",
    features: ["Agile & Scrum", "Resource Planning", "Risk Management", "Stakeholder Communication"]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-32 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              What We Offer
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Our Services
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions to accelerate your business growth in emerging tech markets
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3 leading-tight group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-6 leading-relaxed">
                  {service.description}
                </CardDescription>
                <ul className="space-y-2.5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
