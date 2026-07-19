import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Users, CheckCircle, Target, Zap } from "lucide-react";

interface CaseStudy {
  title: string;
  industry: string;
  problem: string;
  constraints: string;
  solution: string;
  tools: string[];
  results: string[];
  timeline: string;
}

const caseStudies: CaseStudy[] = [
  {
    title: "Fintech Market Entry: Kazakhstan & Uzbekistan",
    industry: "Financial Technology",
    problem: "A European payment processing company needed to expand into Central Asian markets but lacked local regulatory knowledge, banking relationships, and market understanding.",
    constraints: "Strict 6-month timeline before competitor entry. Complex licensing requirements in both jurisdictions. Limited local team presence.",
    solution: "Sipiteno provided end-to-end market entry support: regulatory landscape mapping, partnership identification with local banks, licensing application coordination, and initial customer acquisition strategy. We leveraged our existing relationships with central bank officials and fintech associations in both countries.",
    tools: ["Regulatory mapping", "Partnership development", "Licensing coordination", "Local team recruitment"],
    results: [
      "Operating licenses secured in both countries within 5 months",
      "3 strategic banking partnerships established",
      "First 50 merchant clients onboarded within 8 months",
      "$2.1M in transaction volume in first quarter post-launch"
    ],
    timeline: "8 months"
  },
  {
    title: "B2B Lead Generation: Eastern European Expansion",
    industry: "Enterprise Software",
    problem: "A US-based CRM software company wanted to establish presence in Eastern European markets but had no regional sales infrastructure, brand recognition, or local partnerships.",
    constraints: "Monthly budget of $8,000. Required qualified SQL leads, not just marketing contacts. Target: mid-market companies with 50-500 employees.",
    solution: "Sipiteno implemented a multi-channel lead generation program: LinkedIn outreach sequences, partnership with local IT associations for event sponsorship, content localization for Polish, Ukrainian, and Serbian markets, and direct introductions to our network of IT directors and CIOs.",
    tools: ["LinkedIn Sales Navigator", "HubSpot CRM integration", "Localized landing pages", "Event marketing"],
    results: [
      "147 qualified leads delivered over 12 months",
      "23 closed deals worth $890,000 ARR",
      "2 strategic reseller partnerships established",
      "Cost per qualified lead: $653 (vs $1,200 industry average)"
    ],
    timeline: "12 months ongoing"
  },
  {
    title: "SaaS Platform Scaling: Technical Recruitment",
    industry: "HR Technology",
    problem: "A rapidly growing HR tech startup needed to scale their engineering team from 8 to 25 developers within 6 months to meet product roadmap commitments, but struggled with competitive talent markets in Western Europe.",
    constraints: "Salary budget 40% below Western European rates. Required senior full-stack and DevOps engineers. Cultural fit critical for remote-first team.",
    solution: "Sipiteno sourced and screened candidates across Ukraine, Poland, and Serbia. We managed the entire recruitment pipeline: job description optimization for local markets, technical screening with real coding challenges, cultural fit assessment, offer negotiation, and onboarding coordination across time zones.",
    tools: ["Technical assessments", "Video interviews", "Reference checks", "Onboarding playbook"],
    results: [
      "17 engineers hired within 6 months",
      "Average time-to-hire: 23 days",
      "92% retention rate after 12 months",
      "35% cost savings vs Western European hires"
    ],
    timeline: "6 months"
  }
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-section-lg bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" role="presentation" aria-hidden="true"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">
              Proven Results
            </span>
          </div>

          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            Case Studies
          </h2>

          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real projects demonstrating Sipiteno's methodology and measurable outcomes across different industries and service types.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          {caseStudies.map((study, index) => (
            <Card key={index} className="border-2 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">{study.industry}</div>
                    <CardTitle className="text-2xl font-bold text-foreground">{study.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{study.timeline}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Problem & Constraints */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Problem
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{study.problem}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Constraints
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{study.constraints}</p>
                    </div>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Solution
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{study.solution}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {study.tools.map((tool, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Results
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
