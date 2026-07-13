import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ArrowRight, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  icon: string;
}

const GLOSSARY: GlossaryTerm[] = [
  { term: "Market Entry Strategy", category: "Market Entry", icon: "🌍", definition: "A comprehensive plan for introducing a product or service into a new geographic or demographic market. Includes regulatory compliance, competitor analysis, pricing strategy, channel partnerships, and go-to-market timing." },
  { term: "Greenfield Investment", category: "Market Entry", icon: "🌱", definition: "Building operations from scratch in a new market, as opposed to acquiring an existing local company. Common in emerging markets where suitable acquisition targets are scarce." },
  { term: "Go-To-Market (GTM)", category: "Market Entry", icon: "🚀", definition: "The tactical execution plan for reaching target customers and delivering value. Covers sales channels, marketing, distribution, and customer onboarding." },
  { term: "Soft Landing", category: "Market Entry", icon: "🪂", definition: "Entering a new market gradually through partnerships, incubators, or local accelerators rather than committing full resources immediately. Reduces risk and capital exposure." },
  { term: "B2B Lead Generation", category: "Business Development", icon: "🎯", definition: "The process of identifying and attracting potential business customers. In emerging markets, this often requires local market intelligence, cultural adaptation, and warm introductions." },
  { term: "Strategic Partnership", category: "Business Development", icon: "🤝", definition: "A formal alliance between two companies to share resources, distribution, or technology for mutual benefit. Critical for market entry where local relationships drive deals." },
  { term: "Pipeline Management", category: "Business Development", icon: "📊", definition: "The systematic tracking and nurturing of potential deals from initial contact through close. Includes stages, probabilities, and expected close dates." },
  { term: "Warm Introduction", category: "Business Development", icon: "🔥", definition: "A referral or introduction to a potential customer or partner through a mutual connection. In CEE and emerging markets, warm intros often outperform cold outreach 10:1." },
  { term: "SaaS (Software as a Service)", category: "Technology", icon: "☁️", definition: "Software delivered via subscription over the internet rather than installed locally. Dominant model for B2B technology companies expanding into new markets." },
  { term: "API Integration", category: "Technology", icon: "🔌", definition: "Connecting different software systems through documented interfaces. Essential for B2B SaaS companies entering markets with legacy infrastructure." },
  { term: "Data Residency", category: "Technology", icon: "🔒", definition: "The legal requirement that data about a country's citizens must be stored on servers physically located within that country. Critical compliance factor in EU and emerging markets." },
  { term: "Digital Transformation", category: "Technology", icon: "⚡", definition: "The integration of digital technology into all areas of a business, fundamentally changing how it operates and delivers value to customers." },
  { term: "Runway", category: "Finance", icon: "🏃", definition: "The number of months a company can operate before running out of cash. Calculated as current cash / monthly burn rate. Critical metric during market expansion." },
  { term: "Customer Acquisition Cost (CAC)", category: "Finance", icon: "💰", definition: "The total cost of acquiring a new customer, including marketing, sales, and onboarding. In emerging markets, CAC is often significantly lower than in saturated Western markets." },
  { term: "Lifetime Value (LTV)", category: "Finance", icon: "📈", definition: "The total revenue a customer generates over their entire relationship with your company. A healthy LTV:CAC ratio is at least 3:1." },
  { term: "PSD2", category: "Finance", icon: "🏦", definition: "The EU's revised Payment Services Directive, enabling open banking. Creates opportunities for fintech companies in European markets but requires compliance investment." },
  { term: "Sales Funnel", category: "Marketing & Sales", icon: "🔻", definition: "The step-by-step journey from first contact to closed deal. A well-designed funnel nurtures leads through awareness, interest, decision, and action stages." },
  { term: "Account-Based Marketing (ABM)", category: "Marketing & Sales", icon: "🎯", definition: "A B2B strategy that targets specific high-value accounts with personalized campaigns rather than broad market approaches. Especially effective in enterprise sales." },
  { term: "Conversion Rate Optimization (CRO)", category: "Marketing & Sales", icon: "✨", definition: "The process of improving the percentage of visitors who take a desired action, such as filling out a form or making a purchase." },
  { term: "Multilingual SEO", category: "Marketing & Sales", icon: "🌐", definition: "Search engine optimization across multiple languages and regions. Essential for reaching local-language buyers in CEE where English search volume is lower." },
  { term: "Emerging Markets", category: "Emerging Markets", icon: "🌅", definition: "Countries experiencing rapid economic growth and industrialization. CEE, Southeast Asia, and Latin America offer high growth potential with lower competition than saturated Western markets." },
  { term: "CEE (Central & Eastern Europe)", category: "Emerging Markets", icon: "🇪🇺", definition: "The region comprising countries like Poland, Czech Republic, Romania, Hungary, Bulgaria, and the Baltics. Offers EU market access with lower costs and growing tech ecosystems." },
  { term: "Local Culture Adaptation", category: "Emerging Markets", icon: "🎭", definition: "Adapting products, marketing, and business practices to fit local cultural norms. In CEE, relationship-building and in-person meetings remain essential to closing deals." },
  { term: "Regulatory Sandboxing", category: "Emerging Markets", icon: "⚖️", definition: "A framework allowing companies to test innovative products in a controlled environment with relaxed regulations. Common in fintech across Lithuania, Estonia, and Poland." },
  { term: "Agile Delivery", category: "Project Management", icon: "🔄", definition: "An iterative approach to project management where teams deliver work in small increments, allowing for rapid adaptation to changing requirements and market conditions." },
  { term: "Stakeholder Management", category: "Project Management", icon: "👥", definition: "The process of managing expectations and communications across all parties affected by a project — including clients, teams, partners, and regulators across multiple time zones." },
];

const CATEGORIES = ["All", ...Array.from(new Set(GLOSSARY.map(g => g.category)))];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CATEGORY_COLORS: Record<string, string> = {
  "All": "from-slate-500 to-slate-700",
  "Market Entry": "from-sky-500 to-blue-600",
  "Business Development": "from-violet-500 to-purple-600",
  "Technology": "from-cyan-500 to-teal-600",
  "Finance": "from-emerald-500 to-green-600",
  "Marketing & Sales": "from-orange-500 to-red-500",
  "Emerging Markets": "from-amber-500 to-yellow-600",
  "Project Management": "from-pink-500 to-rose-600",
};

const Glossary = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLetter, setActiveLetter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return GLOSSARY
      .filter(g => {
        if (activeCategory !== "All" && g.category !== activeCategory) return false;
        if (activeLetter !== "All" && !g.term.toUpperCase().startsWith(activeLetter)) return false;
        if (search) {
          const q = search.toLowerCase();
          return g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory, activeLetter]);

  // Group by category for display
  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filtered.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filtered]);

  const title = "Glossary | Sipiteno - Business & Technology Terms Explained";
  const description = "A comprehensive glossary of business development, technology, marketing, and emerging market terms. Plain-English definitions for B2B expansion into CEE and beyond.";

  return (
    <>
      <SEOHead title={title} description={description} url="https://sipiteno.com/glossary" />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <Navigation />

        {/* Hero with gradient background */}
        <div className="relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
          </div>

          <main className="pt-20 md:pt-24 pb-16">
            {/* Hero */}
            <section className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Knowledge Base</span>
                </div>
                <h1 className="text-[clamp(2rem,7vw,3.5rem)] font-black text-foreground mb-4 leading-[1.1] tracking-tight">
                  Business & Tech
                  <span className="block text-primary">
                    Glossary
                  </span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {GLOSSARY.length} essential terms for B2B expansion — from market entry to fintech compliance, explained in plain English.
                </p>
              </div>
            </section>

            {/* Search bar */}
            <section className="container mx-auto px-4 sm:px-6 mb-6">
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Search className="absolute z-10 pointer-events-none left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="search"
                      value={search}
                      onChange={e => { setSearch(e.target.value); setExpanded(null); }}
                      placeholder="Search terms or definitions..."
                      className="w-full pl-14 pr-5 py-4 md:py-5 rounded-2xl bg-card/80 backdrop-blur border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg shadow-lg"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Category pills */}
            <section className="container mx-auto px-4 sm:px-6 mb-5">
              <div className="max-w-5xl mx-auto">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setExpanded(null); }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all min-h-[44px] flex items-center gap-1.5 ${
                        activeCategory === cat
                          ? `text-white bg-gradient-to-r ${CATEGORY_COLORS[cat] || CATEGORY_COLORS["All"]} shadow-lg shadow-primary/20`
                          : "bg-card/60 backdrop-blur border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card"
                      }`}
                    >
                      {cat !== "All" && <span className="text-xs opacity-70">{GLOSSARY.filter(g => g.category === cat).length}</span>}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Alphabet filter */}
            <section className="container mx-auto px-4 sm:px-6 mb-10">
              <div className="max-w-5xl mx-auto">
                <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    onClick={() => { setActiveLetter("All"); setExpanded(null); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold min-w-[44px] min-h-[36px] transition-all ${
                      activeLetter === "All" ? "bg-secondary text-secondary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >All</button>
                  {ALPHABET.map(letter => {
                    const hasTerms = GLOSSARY.some(g => g.term.toUpperCase().startsWith(letter));
                    return (
                      <button
                        key={letter}
                        onClick={() => { setActiveLetter(letter); setExpanded(null); }}
                        disabled={!hasTerms}
                        className={`px-2 py-1.5 rounded-lg text-sm font-bold min-w-[32px] min-h-[36px] transition-all ${
                          activeLetter === letter
                            ? "bg-secondary text-secondary-foreground shadow-md"
                            : hasTerms
                            ? "text-foreground hover:bg-muted"
                            : "text-muted-foreground/25 cursor-not-allowed"
                        }`}
                      >{letter}</button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Results */}
            {filtered.length === 0 ? (
              <section className="container mx-auto px-4 sm:px-6 py-16">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No terms found</h3>
                  <p className="text-muted-foreground mb-5">Try a different search or reset your filters.</p>
                  <Button onClick={() => { setSearch(""); setActiveCategory("All"); setActiveLetter("All"); }}>
                    Reset all filters
                  </Button>
                </div>
              </section>
            ) : (
              <>
                {/* Results count */}
                <section className="container mx-auto px-4 sm:px-6 mb-5">
                  <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span>{filtered.length} {filtered.length === 1 ? "term" : "terms"} found</span>
                  </div>
                </section>

                {/* Terms grouped by category */}
                <section className="container mx-auto px-4 sm:px-6">
                  <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
                    {Object.entries(grouped).map(([category, terms]) => (
                      <div key={category}>
                        {/* Category header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[category] || CATEGORY_COLORS["All"]} flex items-center justify-center shrink-0`}>
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-lg md:text-xl font-bold text-foreground">{category}</h2>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-muted-foreground font-medium">{terms.length}</span>
                        </div>

                        {/* Terms */}
                        <div className="space-y-2.5">
                          {terms.map((item, i) => {
                            const isOpen = expanded === item.term;
                            return (
                              <div
                                key={i}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                  isOpen
                                    ? "border-primary/40 shadow-lg shadow-primary/5 bg-card"
                                    : "border-border bg-card/60 backdrop-blur hover:border-primary/20 hover:bg-card hover:shadow-md"
                                }`}
                              >
                                <button
                                  onClick={() => setExpanded(isOpen ? null : item.term)}
                                  className="w-full text-left px-4 md:px-6 py-4 md:py-5 flex items-center gap-4"
                                  aria-expanded={isOpen}
                                >
                                  {/* Icon */}
                                  <div className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                                    isOpen ? "bg-primary/10 scale-110" : "bg-muted"
                                  }`}>
                                    {item.icon}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-bold text-foreground mb-0.5">{item.term}</h3>
                                    {!isOpen && (
                                      <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">{item.definition}</p>
                                    )}
                                  </div>

                                  {/* Chevron */}
                                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground"
                                  }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </button>

                                {/* Expanded content */}
                                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                  <div className="overflow-hidden">
                                    <div className="px-4 md:px-6 pb-5 md:pb-6 pl-[4.5rem] md:pl-[5.5rem]">
                                      <div className="pl-4 border-l-2 border-primary/30">
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.definition}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* CTA */}
            <section className="container mx-auto px-4 sm:px-6 mt-16">
              <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="relative p-8 md:p-12 text-center">
                  <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Need help navigating these terms?</h2>
                  <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto">
                    Schedule a free strategy call and we'll translate these concepts into an actionable plan for your market expansion.
                  </p>
                  <Button size="lg" className="shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                    <Link to="/#contact">Get a Free Strategy Call <ArrowRight className="w-4 h-4 ml-2" /></Link>
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

export default Glossary;
