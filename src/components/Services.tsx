import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain, Rocket, Users, Smartphone, Shield, Monitor, Globe } from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    title: "Business Development Services",
    description: "Market entry strategy, partnership facilitation, and regulatory navigation for Eastern European markets. We help you establish and grow your presence in the region.",
    features: ["Market Analysis", "Partnership Development", "Regulatory Compliance", "Go-to-Market Strategy"]
  },
  {
    icon: Brain,
    title: "AI & IT Technology Consulting",
    description: "AI implementation, digital transformation, and technology assessment. Leverage cutting-edge technologies to drive innovation and competitive advantage.",
    features: ["AI Strategy", "Digital Transformation", "Technology Stack Assessment", "Implementation Support"]
  },
  {
    icon: Rocket,
    title: "MicroSaaS MVP Development",
    description: "Rapid prototyping, market validation, and technical architecture for MicroSaaS solutions. From concept to launch in weeks, not months.",
    features: ["Rapid Prototyping", "Market Validation", "Scalable Architecture", "Technical Advisory"]
  },
  {
    icon: Users,
    title: "HR / Recruitment Services",
    description: "Talent acquisition, team building, and HR consulting for tech companies expanding in Eastern Europe. Access top talent and build high-performing teams.",
    features: ["Talent Sourcing", "Technical Recruiting", "Team Building", "HR Compliance"]
  },
  {
    icon: Smartphone,
    title: "Mobile Application Development",
    description: "Native and cross-platform mobile app development for iOS and Android. Create engaging mobile experiences that drive user growth and retention.",
    features: ["iOS Development", "Android Development", "Cross-Platform Solutions", "UI/UX Design"]
  },
  {
    icon: Shield,
    title: "Cyber Security Services",
    description: "Comprehensive security audits, vulnerability assessments, and security strategy implementation. Protect your business and customer data from evolving threats.",
    features: ["Security Audits", "Vulnerability Testing", "Compliance Management", "Security Training"]
  },
  {
    icon: Monitor,
    title: "Mobile Marketing",
    description: "Mobile-first marketing strategies, app store optimization, and mobile advertising campaigns. Reach and engage your audience on mobile devices effectively.",
    features: ["App Store Optimization", "Mobile Ad Campaigns", "In-App Marketing", "Mobile Analytics"]
  },
  {
    icon: Globe,
    title: "Digital Marketing Services",
    description: "Comprehensive digital marketing solutions including SEO, content marketing, and social media management. Drive traffic and convert visitors into customers.",
    features: ["SEO & SEM", "Content Marketing", "Social Media Management", "Email Marketing"]
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
            Comprehensive solutions to accelerate your business growth in Eastern European tech markets
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
