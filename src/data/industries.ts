// Industries metadata for pSEO pages

export interface IndustryInfo {
  name: string;
  slug: string;
  icon: string;
  description: string;
  keyServices: string[];
  relevantCountries: string[];
  challenges: string[];
  opportunities: string[];
}

export const INDUSTRIES: IndustryInfo[] = [
  {
    name: "SaaS & Software",
    slug: "saas-software",
    icon: "Code",
    description: "End-to-end support for SaaS companies expanding into emerging markets, from market validation to full-scale operations.",
    keyServices: ["business-development", "digital-marketing", "ai-consulting"],
    relevantCountries: ["Poland", "Estonia", "Czech Republic", "Ukraine", "Romania", "Lithuania", "Serbia"],
    challenges: ["Navigating local data residency requirements", "Adapting pricing to local market conditions", "Building local sales channels"],
    opportunities: ["Rapidly growing B2B SaaS adoption across CEE", "Lower customer acquisition costs than saturated Western markets", "Regional talent pool for R&D expansion"]
  },
  {
    name: "Fintech & Financial Services",
    slug: "fintech-financial-services",
    icon: "DollarSign",
    description: "Regulatory navigation, partnership development, and market entry for fintech companies targeting Central and Eastern Europe.",
    keyServices: ["business-development", "it-consulting", "project-management"],
    relevantCountries: ["Lithuania", "Estonia", "Poland", "Cyprus", "Bulgaria", "Ukraine"],
    challenges: ["Complex licensing requirements across multiple jurisdictions", "PSD2 and open banking compliance", "Anti-money laundering (AML) implementation"],
    opportunities: ["Lithuania's fintech-friendly licensing regime", "Estonia's e-residency for digital finance", "Growing unbanked populations in Eastern Europe"]
  },
  {
    name: "E-Commerce & Retail Tech",
    slug: "ecommerce-retail-tech",
    icon: "ShoppingCart",
    description: "Market entry strategy and digital transformation for e-commerce businesses expanding across European and Asian markets.",
    keyServices: ["digital-marketing", "sales-funnel", "it-consulting"],
    relevantCountries: ["Poland", "Czech Republic", "Romania", "Kazakhstan", "Georgia", "Ukraine"],
    challenges: ["Logistics infrastructure gaps in emerging markets", "Payment gateway fragmentation across countries", "Cross-border customs and tax complexity"],
    opportunities: ["Allegro (Poland) expansion into CEE markets", "Rising e-commerce penetration in Central Asia", "Cross-border shopping demand within EU"]
  },
  {
    name: "Manufacturing & Industry 4.0",
    slug: "manufacturing-industry-4",
    icon: "Factory",
    description: "Digital transformation consulting and technology implementation for manufacturing companies in Central and Eastern Europe.",
    keyServices: ["it-consulting", "ai-consulting", "project-management"],
    relevantCountries: ["Czech Republic", "Poland", "Slovakia", "Hungary", "Romania", "Bulgaria"],
    challenges: ["Legacy system integration with modern IoT platforms", "Workforce digital skills gap", "Cybersecurity for OT (operational technology)"],
    opportunities: ["EU digital transformation funding programs", "Industry 4.0 adoption incentives", "Regional automotive supply chain digitization"]
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    icon: "Shield",
    description: "Market entry and business development for cybersecurity companies targeting Eastern European and Central Asian markets.",
    keyServices: ["business-development", "it-consulting", "digital-marketing"],
    relevantCountries: ["Estonia", "Poland", "Ukraine", "Romania", "Lithuania", "Georgia"],
    challenges: ["Rapidly evolving regulatory landscape", "Talent competition with larger markets", "Customer education on cybersecurity value"],
    opportunities: ["Estonia's NATO Cooperative Cyber Defence Centre", "Growing threat landscape driving demand", "Government digitalization security requirements"]
  },
  {
    name: "Healthcare & MedTech",
    slug: "healthcare-medtech",
    icon: "HeartPulse",
    description: "Regulatory navigation, partnership development, and market expansion for healthcare technology companies across the region.",
    keyServices: ["business-development", "project-management", "it-consulting"],
    relevantCountries: ["Poland", "Czech Republic", "Hungary", "Ukraine", "Georgia", "Croatia"],
    challenges: ["Medical device certification across multiple jurisdictions", "Healthcare data privacy regulations", "Fragmented public/private healthcare systems"],
    opportunities: ["EU healthcare digitalization initiatives", "Growing private healthcare investment in CEE", "Telemedicine adoption post-pandemic"]
  },
  {
    name: "AgTech & Agriculture",
    slug: "agtech-agriculture",
    icon: "Sprout",
    description: "Technology adoption and market entry support for agtech companies targeting agricultural markets in Central Asia and Eastern Europe.",
    keyServices: ["business-development", "digital-marketing", "sales-funnel"],
    relevantCountries: ["Ukraine", "Kazakhstan", "Romania", "Bulgaria", "Uzbekistan", "Kyrgyzstan"],
    challenges: ["Low technology adoption in traditional farming", "Seasonal cash flow cycles of agricultural businesses", "Rural connectivity limitations"],
    opportunities: ["Massive agricultural production in Ukraine and Kazakhstan", "Government digital agriculture initiatives", "Precision farming demand from large agribusinesses"]
  },
  {
    name: "Energy & Renewables",
    slug: "energy-renewables",
    icon: "Zap",
    description: "Strategic consulting and business development for renewable energy and clean technology companies entering emerging European markets.",
    keyServices: ["business-development", "project-management", "it-consulting"],
    relevantCountries: ["Poland", "Romania", "Bulgaria", "Greece", "Ukraine", "Kazakhstan"],
    challenges: ["Regulatory uncertainty in energy markets", "Infrastructure grid limitations", "Subsidy and incentive complexity across countries"],
    opportunities: ["EU Green Deal funding for CEE countries", "Solar and wind energy potential in Southeastern Europe", "Energy storage and smart grid modernization"]
  },
  {
    name: "Logistics & Supply Chain Tech",
    slug: "logistics-supply-chain",
    icon: "Truck",
    description: "Technology implementation and market expansion for logistics companies leveraging the growing Middle Corridor trade route.",
    keyServices: ["it-consulting", "business-development", "project-management"],
    relevantCountries: ["Kazakhstan", "Georgia", "Azerbaijan", "Poland", "Romania", "Bulgaria", "Cyprus"],
    challenges: ["Cross-border customs digitization gaps", "Infrastructure bottlenecks at border crossings", "Multimodal transport coordination complexity"],
    opportunities: ["Middle Corridor / Trans-Caspian trade route growth", "EU-Central Asia connectivity initiatives", "Digital freight forwarding adoption"]
  }
];

export function getIndustryBySlug(slug: string): IndustryInfo | undefined {
  return INDUSTRIES.find(i => i.slug === slug);
}
