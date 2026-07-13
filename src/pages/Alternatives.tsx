import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Users, Globe, TrendingUp, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Competitor {
  name: string;
  type: string;
  description: string;
  bestFor: string;
  limitations: string[];
  sipitenoAdvantage: string[];
  startingCost: string;
}

const COMPETITORS: Competitor[] = [
  {
    name: "Big 4 Consulting (Deloitte, PwC, EY, KPMG)",
    type: "Global Consultancies",
    description: "Full-service professional services firms with dedicated emerging markets practices. High credibility, large teams, comprehensive coverage.",
    bestFor: "Enterprise companies needing audit, tax, and compliance alongside market entry.",
    limitations: [
      "$50K+ minimum engagement, often $200K+",
      "Junior associates do the work, partners pitch",
      "3-6 month timelines minimum",
      "Generalist approach — not specialized in tech",
    ],
    sipitenoAdvantage: [
      "5-10x lower cost for the same market entry work",
      "Senior consultant (15+ years) on every project",
      "4-16 week timelines, not 6 months",
      "Specialized in technology & SaaS expansion",
    ],
    startingCost: "$50,000+",
  },
  {
    name: "Boutique Market Entry Firms",
    type: "Regional Specialists",
    description: "Small consultancies focused on specific regions (CEE, MENA, LatAm). Good local knowledge but limited service depth.",
    bestFor: "Companies that only need market research, not execution.",
    limitations: [
      "Research-only — no sales or BD execution",
      "Single-region focus limits scaling",
      "Often lack technology expertise",
      "No ongoing relationship management",
    ],
    sipitenoAdvantage: [
      "Full execution — not just research, but actual deal closing",
      "28 markets across CEE, MENA, and Asia",
      "Deep technology and SaaS specialization",
      "Ongoing BD retainers for continuous pipeline",
    ],
    startingCost: "$15,000+",
  },
  {
    name: "DIY / In-House Expansion",
    type: "Self-Managed",
    description: "Hiring local representatives or sending existing team members to build the market from scratch.",
    bestFor: "Companies with large teams willing to invest 12-18 months learning the market.",
    limitations: [
      "12-18 month learning curve",
      "Expensive mistakes from cultural/regulatory ignorance",
      "No existing partner network to leverage",
      "Opportunity cost of lost deals during ramp",
    ],
    sipitenoAdvantage: [
      "15 years of existing relationships from day one",
      "Avoid costly market-entry mistakes",
      "Instant access to established partner network",
      "Pipeline within weeks, not 18 months",
    ],
    startingCost: "Time + salaries",
  },
  {
    name: "LinkedIn / Cold Outreach Agencies",
    type: "Lead Generation Services",
    description: "Agencies that run automated cold email and LinkedIn campaigns to generate meetings in new markets.",
    bestFor: "Companies with transactional products and no need for local relationships.",
    limitations: [
      "Cold leads — no trust or warm introduction",
      "Response rates under 1% in B2B enterprise",
      "No local market knowledge or cultural adaptation",
      "Cannot facilitate in-person meetings",
    ],
    sipitenoAdvantage: [
      "Warm introductions through 15-year relationships",
      "In-person meeting facilitation in 28 markets",
      "Cultural guidance and local market intelligence",
      "Strategic partnerships, not just cold meetings",
    ],
    startingCost: "$2,000-$5,000/mo",
  },
  {
    name: "Trade Associations & Chambers",
    type: "Networking Organizations",
    description: "Organizations like AmCham, European Tech Alliance, or bilateral chambers of commerce that facilitate business introductions.",
    bestFor: "Companies seeking general networking and industry events.",
    limitations: [
      "General networking — no targeted deal support",
      "Annual memberships ($5K-$25K) with no guaranteed ROI",
      "Cannot execute BD or close deals",
      "Reactive — you wait for opportunities",
    ],
    sipitenoAdvantage: [
      "Proactive deal sourcing, not passive networking",
      "Direct pipeline targets and closed deals",
      "Fraction of the cost of chamber memberships",
      "Strategic execution, not just introductions",
    ],
    startingCost: "$5,000-$25,000/yr",
  },
];

const COMPARISON_POINTS = [
  { feature: "Emerging Market Specialization", sipiteno: true, big4: true, boutique: true, diy: false, linkedin: false, chamber: false },
  { feature: "Technology & SaaS Focus", sipiteno: true, big4: false, boutique: false, diy: false, linkedin: false, chamber: false },
  { feature: "Warm Introductions (not cold)", sipiteno: true, big4: true, boutique: false, diy: false, linkedin: false, chamber: true },
  { feature: "In-Person Meeting Facilitation", sipiteno: true, big4: true, boutique: false, diy: false, linkedin: false, chamber: false },
  { feature: "BD Execution (not just advice)", sipiteno: true, big4: false, boutique: false, diy: true, linkedin: true, chamber: false },
  { feature: "28+ Market Coverage", sipiteno: true, big4: true, boutique: false, diy: false, linkedin: false, chamber: false },
  { feature: "Senior Consultant (not junior)", sipiteno: true, big4: false, boutique: true, diy: false, linkedin: false, chamber: false },
  { feature: "Under $10K Starting Price", sipiteno: true, big4: false, boutique: false, diy: false, linkedin: true, chamber: false },
];

const Alternatives = () => {
  const [selected, setSelected] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const title = "Sipiteno vs Alternatives | Consulting & Market Entry Comparison";
  const description = "How Sipiteno compares to Big 4 consulting firms, boutique market entry specialists, DIY expansion, LinkedIn agencies, and trade chambers for B2B expansion into emerging markets.";

  return (
    <>
      <SEOHead title={title} description={description} url="https://sipiteno.com/alternatives" />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 md:pt-24 pb-16">
          {/* Hero */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Compare</span>
              </div>
              <h1 className="text-[clamp(1.75rem,6vw,3rem)] md:text-5xl font-bold text-foreground mb-3 md:mb-4 leading-tight">
                Sipiteno vs the Alternatives
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Honest comparison with 5 categories of alternatives. We tell you who each option is actually best for — including when it's not us.
              </p>
            </div>
          </section>

          {/* Comparison Cards — Mobile: swipeable tabs / Desktop: grid */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            {/* Tab selector — horizontal scroll on mobile */}
            <div className="max-w-6xl mx-auto mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
                style={{ scrollbarWidth: "none" }}
              >
                {COMPETITORS.map((comp, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                      selected === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {comp.name.split(" ")[0].replace(/[()]/g, "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected card detail */}
            <div className="max-w-3xl mx-auto">
              {COMPETITORS.map((comp, i) => {
                if (i !== selected) return null;
                return (
                  <div key={i} className="rounded-2xl border-2 border-border overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-card px-5 md:px-7 py-5 md:py-6 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{comp.type}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Starting cost: <strong className="text-foreground">{comp.startingCost}</strong></span>
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-foreground mb-2">{comp.name}</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{comp.description}</p>
                    </div>

                    {/* Best for */}
                    <div className="px-5 md:px-7 py-4 md:py-5 border-b border-border bg-primary/5">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Best for</p>
                          <p className="text-sm md:text-base text-foreground">{comp.bestFor}</p>
                        </div>
                      </div>
                    </div>

                    {/* Limitations vs Sipiteno Advantage */}
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Limitations */}
                      <div className="px-5 md:px-7 py-5 md:py-6 md:border-r border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center">
                            <X className="w-4 h-4 text-destructive" />
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-foreground">Their limitations</h3>
                        </div>
                        <ul className="space-y-3">
                          {comp.limitations.map((lim, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{lim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Sipiteno advantage */}
                      <div className="px-5 md:px-7 py-5 md:py-6 bg-emerald-500/5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-foreground">Why Sipiteno is better here</h3>
                        </div>
                        <ul className="space-y-3">
                          {comp.sipitenoAdvantage.map((adv, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground leading-relaxed">{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Feature Matrix Table */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">Feature Comparison</h2>
                <p className="text-sm md:text-base text-muted-foreground">At a glance — tap "Show all" to see every row</p>
              </div>

              <div className="rounded-2xl border-2 border-border overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm font-bold text-foreground">Feature</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-bold text-primary min-w-[70px]">Sipiteno</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-muted-foreground min-w-[70px]">Big 4</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-muted-foreground min-w-[70px]">Boutique</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-muted-foreground min-w-[70px]">DIY</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-muted-foreground min-w-[70px]">LinkedIn</th>
                      <th className="px-3 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-muted-foreground min-w-[70px]">Chambers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllFeatures ? COMPARISON_POINTS : COMPARISON_POINTS.slice(0, 5)).map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm text-foreground font-medium">{row.feature}</td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.sipiteno ? <Check className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.big4 ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.boutique ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.diy ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.linkedin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                        <td className="px-3 py-3 md:py-4 text-center">
                          {row.chamber ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-4">
                <Button variant="outline" size="sm" onClick={() => setShowAllFeatures(!showAllFeatures)}>
                  {showAllFeatures ? "Show less" : `Show all ${COMPARISON_POINTS.length} features`}
                </Button>
              </div>
            </div>
          </section>

          {/* Value props */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { icon: Globe, value: "28", label: "Markets covered" },
                  { icon: Users, value: "15+", label: "Years of relationships" },
                  { icon: Zap, value: "4-16", label: "Week delivery" },
                  { icon: Shield, value: "$3K", label: "Starting price" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 md:p-5 rounded-xl bg-card border border-border">
                    <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-primary mx-auto mb-2" />
                    <div className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 md:p-10 text-center">
              <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Still comparing? Let's make it easy.</h2>
              <p className="text-sm md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                Get a free, no-pressure strategy call. We'll tell you honestly if we're the right fit — or if a Big 4 or boutique firm would serve you better.
              </p>
              <Button size="lg" asChild>
                <Link to="/#contact">Book a Free Call <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Alternatives;
