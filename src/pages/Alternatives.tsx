import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Users, Globe, TrendingUp, Zap, Shield, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Competitor {
  name: string;
  shortName: string;
  type: string;
  icon: string;
  color: string;
  description: string;
  bestFor: string;
  limitations: string[];
  sipitenoAdvantage: string[];
  startingCost: string;
}

const COMPETITORS: Competitor[] = [
  {
    name: "Big 4 Consulting (Deloitte, PwC, EY, KPMG)",
    shortName: "Big 4",
    type: "Global Consultancies",
    icon: "🏛️",
    color: "from-blue-500 to-indigo-600",
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
    shortName: "Boutique",
    type: "Regional Specialists",
    icon: "🔬",
    color: "from-violet-500 to-purple-600",
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
    shortName: "DIY",
    type: "Self-Managed",
    icon: "🔨",
    color: "from-amber-500 to-orange-600",
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
    shortName: "LinkedIn",
    type: "Lead Generation Services",
    icon: "📧",
    color: "from-sky-500 to-cyan-600",
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
    shortName: "Chambers",
    type: "Networking Organizations",
    icon: "🤝",
    color: "from-emerald-500 to-green-600",
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

const STATS = [
  { icon: Globe, value: "28", label: "Markets covered", color: "text-sky-500" },
  { icon: Users, value: "15+", label: "Years of relationships", color: "text-violet-500" },
  { icon: Zap, value: "4-16", label: "Week delivery", color: "text-amber-500" },
  { icon: Shield, value: "$3K", label: "Starting price", color: "text-emerald-500" },
];

const Alternatives = () => {
  const [selected, setSelected] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const comp = COMPETITORS[selected];

  const title = "Sipiteno vs Alternatives | Consulting & Market Entry Comparison";
  const description = "How Sipiteno compares to Big 4 consulting firms, boutique market entry specialists, DIY expansion, LinkedIn agencies, and trade chambers.";

  return (
    <>
      <SEOHead title={title} description={description} url="https://sipiteno.com/alternatives" />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <Navigation />

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
          </div>

          <main className="pt-20 md:pt-24 pb-16">
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-12">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Honest Comparison</span>
                </div>
                <h1 className="text-[clamp(2rem,7vw,3.5rem)] font-black text-foreground mb-4 leading-[1.1] tracking-tight">
                  Sipiteno vs
                  <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                    the Alternatives
                  </span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  No spin. We compare ourselves to 5 categories of alternatives — and tell you when they're the better choice.
                </p>
              </div>
            </section>

            {/* Stats bar */}
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {STATS.map((stat, i) => (
                    <div key={i} className="text-center p-4 md:p-5 rounded-2xl bg-card/60 backdrop-blur border border-border hover:border-primary/30 transition-colors">
                      <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.color} mx-auto mb-2`} />
                      <div className="text-xl md:text-3xl font-black text-foreground">{stat.value}</div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tab selector */}
            <section className="container mx-auto px-4 sm:px-6 mb-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {COMPETITORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all min-h-[48px] flex items-center gap-2 ${
                        selected === i
                          ? `text-white bg-gradient-to-r ${c.color} shadow-lg`
                          : "bg-card/60 backdrop-blur border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      <span className="text-base">{c.icon}</span>
                      {c.shortName}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison card */}
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
              <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl">
                  {/* Header with gradient */}
                  <div className={`relative px-6 md:px-8 py-6 md:py-7 bg-gradient-to-br ${comp.color} text-white overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl md:text-4xl">{comp.icon}</span>
                        <div>
                          <span className="inline-block text-[10px] md:text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur font-semibold uppercase tracking-wider">{comp.type}</span>
                        </div>
                      </div>
                      <h2 className="text-xl md:text-3xl font-black mb-2">{comp.name}</h2>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed">{comp.description}</p>
                    </div>
                  </div>

                  {/* Best for */}
                  <div className="px-6 md:px-8 py-5 border-b border-border bg-primary/5">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-1">Best for</p>
                        <p className="text-sm md:text-base text-foreground font-medium">{comp.bestFor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cost badge */}
                  <div className="px-6 md:px-8 py-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Starting cost</span>
                    <span className="text-lg md:text-xl font-black text-foreground">{comp.startingCost}</span>
                  </div>

                  {/* Two columns: limitations vs advantages */}
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Limitations */}
                    <div className="px-6 md:px-8 py-6 md:py-7 md:border-r border-border">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <X className="w-4 h-4 text-destructive" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-foreground">Their limitations</h3>
                      </div>
                      <ul className="space-y-3.5">
                        {comp.limitations.map((lim, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                              <X className="w-3 h-3 text-destructive" />
                            </span>
                            <span className="text-sm text-muted-foreground leading-relaxed">{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sipiteno advantage */}
                    <div className="px-6 md:px-8 py-6 md:py-7 bg-emerald-500/5">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-foreground">Why Sipiteno wins here</h3>
                      </div>
                      <ul className="space-y-3.5">
                        {comp.sipitenoAdvantage.map((adv, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </span>
                            <span className="text-sm text-foreground font-medium leading-relaxed">{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature matrix */}
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-xl md:text-3xl font-black text-foreground mb-2">Feature Matrix</h2>
                  <p className="text-sm md:text-base text-muted-foreground">Full comparison across all alternatives</p>
                </div>

                <div className="overflow-hidden rounded-2xl border-2 border-border shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="bg-muted/50 border-b-2 border-border">
                          <th className="px-4 md:px-5 py-4 text-xs md:text-sm font-bold text-foreground">Feature</th>
                          <th className="px-3 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Crown className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                              <span className="text-xs md:text-sm font-black text-primary">Sipiteno</span>
                            </div>
                          </th>
                          <th className="px-3 py-4 text-center text-xs md:text-sm font-medium text-muted-foreground">🏛️ Big 4</th>
                          <th className="px-3 py-4 text-center text-xs md:text-sm font-medium text-muted-foreground">🔬 Boutique</th>
                          <th className="px-3 py-4 text-center text-xs md:text-sm font-medium text-muted-foreground">🔨 DIY</th>
                          <th className="px-3 py-4 text-center text-xs md:text-sm font-medium text-muted-foreground">📧 LinkedIn</th>
                          <th className="px-3 py-4 text-center text-xs md:text-sm font-medium text-muted-foreground">🤝 Chambers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(showAllFeatures ? COMPARISON_POINTS : COMPARISON_POINTS.slice(0, 5)).map((row, i) => (
                          <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 md:px-5 py-3.5 text-xs md:text-sm text-foreground font-medium">{row.feature}</td>
                            <td className="px-3 py-3.5 text-center bg-primary/5">
                              {row.sipiteno ? <Check className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              {row.big4 ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              {row.boutique ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              {row.diy ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              {row.linkedin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              {row.chamber ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <Button variant="outline" onClick={() => setShowAllFeatures(!showAllFeatures)}>
                    {showAllFeatures ? "Show less" : `Show all ${COMPARISON_POINTS.length} features`}
                  </Button>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative p-8 md:p-12 text-center">
                  <h2 className="text-xl md:text-3xl font-black text-foreground mb-3 md:mb-4">Still comparing? Let's make it easy.</h2>
                  <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto">
                    Get a free, no-pressure strategy call. We'll tell you honestly if we're the right fit — or if someone else would serve you better.
                  </p>
                  <Button size="lg" className="shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                    <Link to="/#contact">Book a Free Call <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Alternatives;
