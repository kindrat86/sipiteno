import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
}

const GLOSSARY: GlossaryTerm[] = [
  // Market Entry
  { term: "Market Entry Strategy", category: "Market Entry", definition: "A comprehensive plan for introducing a product or service into a new geographic or demographic market. Includes regulatory compliance, competitor analysis, pricing strategy, channel partnerships, and go-to-market timing." },
  { term: "Greenfield Investment", category: "Market Entry", definition: "Building operations from scratch in a new market, as opposed to acquiring an existing local company. Common in emerging markets where suitable acquisition targets are scarce." },
  { term: "Go-To-Market (GTM)", category: "Market Entry", definition: "The tactical execution plan for reaching target customers and delivering value. Covers sales channels, marketing, distribution, and customer onboarding." },
  { term: "Soft Landing", category: "Market Entry", definition: "Entering a new market gradually through partnerships, incubators, or local accelerators rather than committing full resources immediately. Reduces risk and capital exposure." },

  // Business Development
  { term: "B2B Lead Generation", category: "Business Development", definition: "The process of identifying and attracting potential business customers. In emerging markets, this often requires local market intelligence, cultural adaptation, and warm introductions." },
  { term: "Strategic Partnership", category: "Business Development", definition: "A formal alliance between two companies to share resources, distribution, or technology for mutual benefit. Critical for market entry where local relationships drive deals." },
  { term: "Pipeline Management", category: "Business Development", definition: "The systematic tracking and nurturing of potential deals from initial contact through close. Includes stages, probabilities, and expected close dates." },
  { term: "Warm Introduction", category: "Business Development", definition: "A referral or introduction to a potential customer or partner through a mutual connection. In CEE and emerging markets, warm intros often outperform cold outreach 10:1." },

  // Technology & SaaS
  { term: "SaaS (Software as a Service)", category: "Technology", definition: "Software delivered via subscription over the internet rather than installed locally. Dominant model for B2B technology companies expanding into new markets." },
  { term: "API Integration", category: "Technology", definition: "Connecting different software systems through documented interfaces. Essential for B2B SaaS companies entering markets with legacy infrastructure." },
  { term: "Data Residency", category: "Technology", definition: "The legal requirement that data about a country's citizens must be stored on servers physically located within that country. Critical compliance factor in EU and emerging markets." },
  { term: "Digital Transformation", category: "Technology", definition: "The integration of digital technology into all areas of a business, fundamentally changing how it operates and delivers value to customers." },

  // Finance & Investment
  { term: "Runway", category: "Finance", definition: "The number of months a company can operate before running out of cash. Calculated as current cash / monthly burn rate. Critical metric during market expansion." },
  { term: "Customer Acquisition Cost (CAC)", category: "Finance", definition: "The total cost of acquiring a new customer, including marketing, sales, and onboarding. In emerging markets, CAC is often significantly lower than in saturated Western markets." },
  { term: "Lifetime Value (LTV)", category: "Finance", definition: "The total revenue a customer generates over their entire relationship with your company. A healthy LTV:CAC ratio is at least 3:1." },
  { term: "PSD2", category: "Finance", definition: "The EU's revised Payment Services Directive, enabling open banking. Creates opportunities for fintech companies in European markets but requires compliance investment." },

  // Marketing & Sales
  { term: "Sales Funnel", category: "Marketing & Sales", definition: "The step-by-step journey from first contact to closed deal. A well-designed funnel nurtures leads through awareness, interest, decision, and action stages." },
  { term: "Account-Based Marketing (ABM)", category: "Marketing & Sales", definition: "A B2B strategy that targets specific high-value accounts with personalized campaigns rather than broad market approaches. Especially effective in enterprise sales." },
  { term: "Conversion Rate Optimization (CRO)", category: "Marketing & Sales", definition: "The process of improving the percentage of visitors who take a desired action, such as filling out a form or making a purchase." },
  { term: "Multilingual SEO", category: "Marketing & Sales", definition: "Search engine optimization across multiple languages and regions. Essential for reaching local-language buyers in CEE where English search volume is lower." },

  // Emerging Markets
  { term: "Emerging Markets", category: "Emerging Markets", definition: "Countries experiencing rapid economic growth and industrialization. CEE, Southeast Asia, and Latin America offer high growth potential with lower competition than saturated Western markets." },
  { term: "CEE (Central & Eastern Europe)", category: "Emerging Markets", definition: "The region comprising countries like Poland, Czech Republic, Romania, Hungary, Bulgaria, and the Baltics. Offers EU market access with lower costs and growing tech ecosystems." },
  { term: "Local Culture Adaptation", category: "Emerging Markets", definition: "Adapting products, marketing, and business practices to fit local cultural norms. In CEE, relationship-building and in-person meetings remain essential to closing deals." },
  { term: "Regulatory Sandboxing", category: "Emerging Markets", definition: "A framework allowing companies to test innovative products in a controlled environment with relaxed regulations. Common in fintech across Lithuania, Estonia, and Poland." },

  // Project Management
  { term: "Agile Delivery", category: "Project Management", definition: "An iterative approach to project management where teams deliver work in small increments, allowing for rapid adaptation to changing requirements and market conditions." },
  { term: "Stakeholder Management", category: "Project Management", definition: "The process of managing expectations and communications across all parties affected by a project — including clients, teams, partners, and regulators across multiple time zones." },
];

const CATEGORIES = ["All", ...Array.from(new Set(GLOSSARY.map(g => g.category))).sort()];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

  const title = "Glossary | Sipiteno - Business & Technology Terms Explained";
  const description = "A comprehensive glossary of business development, technology, marketing, and emerging market terms. Plain-English definitions for B2B expansion into CEE and beyond.";

  return (
    <>
      <SEOHead title={title} description={description} url="https://sipiteno.com/glossary" />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 md:pt-24 pb-16">
          {/* Hero */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Reference</span>
              </div>
              <h1 className="text-[clamp(1.75rem,6vw,3rem)] md:text-5xl font-bold text-foreground mb-3 md:mb-4 leading-tight">
                Business & Technology Glossary
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {GLOSSARY.length} terms demystified — market entry, B2B sales, SaaS, fintech, and emerging markets in plain English.
              </p>
            </div>
          </section>

          {/* Search */}
          <section className="container mx-auto px-4 sm:px-6 mb-6 md:mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setExpanded(null); }}
                  placeholder="Search terms..."
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-base"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </section>

          {/* Category pills — horizontal scroll on mobile */}
          <section className="container mx-auto px-4 sm:px-6 mb-4 md:mb-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
                style={{ scrollbarWidth: "none" }}
              >
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setExpanded(null); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px] ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Alphabet filter — horizontal scroll */}
          <section className="container mx-auto px-4 sm:px-6 mb-8 md:mb-10">
            <div className="max-w-5xl mx-auto">
              <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
                style={{ scrollbarWidth: "none" }}
              >
                <button
                  onClick={() => { setActiveLetter("All"); setExpanded(null); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium min-w-[40px] min-h-[36px] transition-colors ${
                    activeLetter === "All" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >All</button>
                {ALPHABET.map(letter => {
                  const hasTerms = GLOSSARY.some(g => g.term.toUpperCase().startsWith(letter));
                  return (
                    <button
                      key={letter}
                      onClick={() => { setActiveLetter(letter); setExpanded(null); }}
                      disabled={!hasTerms}
                      className={`px-2 py-1.5 rounded-lg text-sm font-medium min-w-[32px] min-h-[36px] transition-colors ${
                        activeLetter === letter
                          ? "bg-secondary text-secondary-foreground"
                          : hasTerms
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                    >{letter}</button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Results count */}
          <section className="container mx-auto px-4 sm:px-6 mb-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground">
                {filtered.length === 0 ? "No terms match your search." : `${filtered.length} ${filtered.length === 1 ? "term" : "terms"}`}
              </p>
            </div>
          </section>

          {/* Terms — accordion list */}
          <section className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-3">
              {filtered.map((item, i) => {
                const isOpen = expanded === item.term;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                      isOpen ? "border-primary/30 shadow-md" : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.term)}
                      className="w-full text-left px-4 md:px-6 py-4 md:py-5 flex items-start justify-between gap-3"
                      aria-expanded={isOpen}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base md:text-lg font-bold text-foreground">{item.term}</h3>
                          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">{item.category}</span>
                        </div>
                        {!isOpen && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.definition}</p>
                        )}
                      </div>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 md:px-6 pb-5 md:pb-6 animate-fade-in-up">
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.definition}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">No terms found.</p>
                  <Button
                    variant="outline"
                    onClick={() => { setSearch(""); setActiveCategory("All"); setActiveLetter("All"); }}
                  >Reset filters</Button>
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-4 sm:px-6 mt-16">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 md:p-10 text-center">
              <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Need help navigating these terms?</h2>
              <p className="text-sm md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                Schedule a free strategy call and we'll translate these concepts into an actionable plan for your market expansion.
              </p>
              <Button size="lg" asChild>
                <Link to="/#contact">Get a Free Strategy Call <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Glossary;
