import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

type MvpProject = {
  name: string;
  description: string;
  tagline: string;
  link: string;
  tags: string[];
};

const mvpProjects: MvpProject[] = [
  {
    name: "FunnelFixer",
    tagline: "AI-Powered Sales Funnel Analyzer",
    description: "AI-powered funnel analyzer that audits sales funnels against Russell Brunson's proven frameworks in 60 seconds. Built to help funnel builders identify and fix conversion-killing issues.",
    link: "https://funnelfixer.site/",
    tags: ["AI", "Sales", "Analytics", "SaaS"]
  },
  {
    name: "VoiceLogPro",
    tagline: "Voice-to-PDF Daily Reports for Trades",
    description: "Turn voice notes into job-ready PDFs in 30 seconds. Built for construction crews who need to document work fast — with timestamps, weather, and safety notes included automatically.",
    link: "https://voicelogpro.com/",
    tags: ["AI", "Construction", "Productivity", "Voice"]
  }
];

const MvpShowcase = () => {
  return (
    <section id="mvp-showcase" className="py-32 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              Our MicroSaaS MVPs
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Built & Launched
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real-world MicroSaaS solutions we've developed from concept to launch. 
            Each MVP validates our rapid prototyping and market validation expertise.
          </p>
        </div>

        {/* MVP Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-1 gap-8">
          {mvpProjects.map((project, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Left side - Content */}
                  <div className="md:col-span-3 p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-lg font-medium text-primary mb-4">
                            {project.tagline}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="group/btn font-semibold"
                      >
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Visit Project
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Right side - Visual */}
                  <div className="md:col-span-2 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center p-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
                        <Rocket className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-card border-2 border-border">
            <p className="text-muted-foreground mb-4 text-lg">
              Want to see your idea become the next MVP?
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-semibold"
            >
              Start Your Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MvpShowcase;
