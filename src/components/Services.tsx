import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Globe, Users, Monitor, Rocket } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Consulting",
    description: "AI implementation, strategy development, and intelligent automation solutions. Leverage cutting-edge artificial intelligence to drive innovation and competitive advantage.",
    features: ["AI Strategy", "Machine Learning", "Intelligent Automation", "AI Implementation"]
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
    description: "Talent acquisition, team building, and HR consulting for tech companies expanding in Eastern Europe. Access top talent and build high-performing teams.",
    features: ["Talent Sourcing", "Technical Recruiting", "Team Building", "HR Compliance"]
  },
  {
    icon: Monitor,
    title: "IT Consulting",
    description: "Technology assessment, digital transformation, and IT infrastructure optimization. Expert guidance to modernize your technology stack and operations.",
    features: ["Digital Transformation", "Technology Stack Assessment", "Infrastructure Optimization", "Implementation Support"]
  },
  {
    icon: Rocket,
    title: "MVP Micro SaaS Development",
    description: "Rapid prototyping, market validation, and technical architecture for MicroSaaS solutions. From concept to launch in weeks, not months.",
    features: ["Rapid Prototyping", "Market Validation", "Scalable Architecture", "Technical Advisory"]
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
