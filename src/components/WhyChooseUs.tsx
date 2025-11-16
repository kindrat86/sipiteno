import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Target, Users2, TrendingUp, Globe2, Zap } from "lucide-react";

const reasons = [
  {
    icon: Target,
    title: "Proven Regional Expertise",
    description: "With over 15 years of hands-on experience across 28 countries in Eastern Europe, the Caucasus, and Central Asia, we possess deep market intelligence that goes beyond surface-level research. We understand the cultural nuances, regulatory environments, business practices, and local partnership ecosystems that are critical for success in these emerging tech markets. Our established networks include government agencies, technology associations, venture capital firms, and industry leaders across the region."
  },
  {
    icon: Zap,
    title: "Rapid Execution & Delivery",
    description: "We specialize in rapid prototyping and agile execution methodologies that deliver results in weeks, not months. Our MicroSaaS MVP development process can take your concept from ideation to market-ready product in 4-8 weeks. For business development initiatives, we leverage our existing regional networks to accelerate partnership formation, lead generation, and market entry strategies. Time-to-market is critical in competitive tech sectors, and our streamlined processes ensure you don't miss opportunities."
  },
  {
    icon: Users2,
    title: "End-to-End Technical Capabilities",
    description: "Unlike traditional business consultancies that only provide strategic advice, we offer complete technical implementation capabilities. Our multidisciplinary team includes AI/ML engineers, full-stack developers, UX designers, digital marketers, and business strategists. This means we can take you from strategic planning through technical architecture, product development, market launch, and ongoing optimization—all under one roof. No need to coordinate between multiple vendors or lose momentum during handoffs."
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Decision Making",
    description: "Every recommendation we make is backed by comprehensive market research, competitive analysis, and data-driven insights. We use advanced analytics, market intelligence platforms, and our proprietary regional databases to validate opportunities before committing resources. Our approach includes thorough market validation, customer development interviews, MVP testing, and iterative optimization based on real user feedback and performance metrics. This significantly reduces risk and maximizes ROI for your market expansion initiatives."
  },
  {
    icon: Globe2,
    title: "Cross-Border Experience",
    description: "International expansion involves complex challenges including regulatory compliance, payment processing, localization, cultural adaptation, and legal frameworks that vary significantly across jurisdictions. We have successfully navigated these complexities across dozens of countries and can help you avoid costly mistakes. Our experience spans working with Fortune 500 enterprises entering emerging markets, as well as regional startups expanding internationally. We understand both perspectives and can structure partnerships and operations for mutual success."
  },
  {
    icon: CheckCircle2,
    title: "Flexible Engagement Models",
    description: "We understand that different projects require different engagement approaches. Whether you need a fixed-price MVP development project, ongoing monthly retainer for business development, hourly consulting for strategic advisory, or a hybrid model combining multiple services—we adapt to your needs and budget. We can scale our involvement up or down as your requirements evolve, from initial market research through full-scale regional expansion. Our goal is long-term partnership, not just transactional project delivery."
  }
];

const WhyChooseUs = () => {
  return (
    <section 
      id="why-choose-us" 
      className="py-32 bg-background relative overflow-hidden"
      itemScope 
      itemType="https://schema.org/AboutPage"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" role="presentation" aria-hidden="true"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              Our Competitive Advantage
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Why Companies Choose Sipiteno
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" itemProp="description">
            When expanding into emerging tech markets across Europe, the Caucasus, and Central Asia, choosing the right partner is critical. Here's what sets Sipiteno apart from traditional consulting firms and why leading technology companies trust us with their most strategic initiatives.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {reason.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 backdrop-blur-sm rounded-3xl p-10 border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">
              Trusted by Leading Organizations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">28</div>
                <div className="text-sm text-muted-foreground">Countries with Active Operations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Projects Successfully Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years of Regional Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
