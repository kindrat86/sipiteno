// Market countries data for programmatic page generation
// Each country has rich metadata for pSEO pages

export interface CountryInfo {
  name: string;
  slug: string;
  flag: string;
  region: string;
  capital: string;
  languages: string[];
  techHub: string;
  keyIndustries: string[];
  businessCulture: string;
  challenge: string;
  opportunity: string;
  economicContext: string;
}

export const COUNTRIES: CountryInfo[] = [
  {
    name: "Albania",
    slug: "albania",
    flag: "🇦🇱",
    region: "Southeast Europe",
    capital: "Tirana",
    languages: ["Albanian", "English", "Italian"],
    techHub: "Tirana Tech Park",
    keyIndustries: ["Tourism", "Energy", "IT Outsourcing", "Agriculture"],
    businessCulture: "Relationship-driven with emphasis on personal trust. Decision-making is hierarchical but increasingly meritocratic in the tech sector.",
    challenge: "Limited access to venture capital and a small domestic market size for B2B SaaS products.",
    opportunity: "Growing IT talent pool with competitive rates (30-40% lower than Western Europe). EU candidate country with improving regulatory alignment.",
    economicContext: "GDP growth 3.5% annually. IT sector expanding 15% YoY. Increasing EU integration and digital transformation investments."
  },
  {
    name: "Armenia",
    slug: "armenia",
    flag: "🇦🇲",
    region: "Caucasus",
    capital: "Yerevan",
    languages: ["Armenian", "Russian", "English"],
    techHub: "Yerevan IT Park & Engineering City",
    keyIndustries: ["IT & Software", "Mining", "Agriculture", "Tourism"],
    businessCulture: "Small, tightly-knit tech community with strong diaspora connections. Relationship-building is essential before business discussions.",
    challenge: "Geopolitical tensions and regional instability can disrupt business continuity and supply chains.",
    opportunity: "Rich engineering talent pool (ranked top 30 globally for math Olympiad performance). Growing startup ecosystem with government innovation incentives.",
    economicContext: "IT sector contributes 8% of GDP. Over 1,000 IT companies operating. Strong diaspora network (10M+ globally) supporting tech investment."
  },
  {
    name: "Azerbaijan",
    slug: "azerbaijan",
    flag: "🇦🇿",
    region: "Caucasus",
    capital: "Baku",
    languages: ["Azerbaijani", "Russian", "English", "Turkish"],
    techHub: "Baku IT Park & Innovation Center",
    keyIndustries: ["Oil & Gas", "Transport & Logistics", "Agriculture", "ICT"],
    businessCulture: "Formal and hierarchical with strong respect for seniority. Government relationships are crucial for large-scale business development.",
    challenge: "Economy heavily dependent on oil & gas revenues. Bureaucracy can slow down market entry and business registration.",
    opportunity: "Government actively diversifying economy through ICT promotion. Strategic location on the Middle Corridor trade route between Europe and Asia.",
    economicContext: "GDP per capita $15,000+. Digital transformation is a national priority. New tech parks offer 50% tax incentives for IT companies."
  },
  {
    name: "Bosnia and Herzegovina",
    slug: "bosnia-and-herzegovina",
    flag: "🇧🇦",
    region: "Southeast Europe",
    capital: "Sarajevo",
    languages: ["Bosnian", "Croatian", "Serbian", "English"],
    techHub: "Sarajevo Technology Park",
    keyIndustries: ["Energy", "Manufacturing", "IT Services", "Tourism"],
    businessCulture: "Decentralized decision-making due to federal structure. Building trust through consistent personal interactions is key.",
    challenge: "Complex political structure (two entities, three presidents) creates regulatory fragmentation and slows cross-entity business operations.",
    opportunity: "Underserved but growing IT sector with lower costs than regional peers. EU candidate country with infrastructure modernization programs.",
    economicContext: "IT sector growing 20% annually from a small base. Competitive developer rates ($25-40/hr). Young demographic profile (median age 42)."
  },
  {
    name: "Bulgaria",
    slug: "bulgaria",
    flag: "🇧🇬",
    region: "Southeast Europe",
    capital: "Sofia",
    languages: ["Bulgarian", "English", "German", "Russian"],
    techHub: "Sofia Tech Park",
    keyIndustries: ["IT Outsourcing", "Manufacturing", "Tourism", "Agriculture"],
    businessCulture: "Direct communication style. Business is conducted formally but personal rapport accelerates deals significantly.",
    challenge: "Brain drain of skilled professionals to Western Europe. Low brand recognition as a tech destination vs. Poland or Romania.",
    opportunity: "One of the fastest internet speeds in the world. EU member with low corporate tax (10%). Growing startup scene in Sofia and Plovdiv.",
    economicContext: "Flat 10% corporate income tax. IT sector employs 150,000+ professionals. 30+ tech unicorns and major R&D centers from global companies."
  },
  {
    name: "Croatia",
    slug: "croatia",
    flag: "🇭🇷",
    region: "Southeast Europe",
    capital: "Zagreb",
    languages: ["Croatian", "English", "German", "Italian"],
    techHub: "Zagreb Technology Park",
    keyIndustries: ["Tourism", "IT Services", "Pharma", "Shipbuilding"],
    businessCulture: "Polite and formal initial approach that becomes more relaxed as relationships develop. EU business standards apply.",
    challenge: "Seasonal tourism-driven economy creates uneven business cycles. High cost of living in coastal areas affects hiring costs.",
    opportunity: "EU membership provides full market access. Strong tourism tech (traveltech) niche. Growing R&D investments in pharma and biotech.",
    economicContext: "GDP per capita $34,000+. IT sector growing at 12% annually. Entered Eurozone in 2023. Strong digital infrastructure and high English proficiency."
  },
  {
    name: "Cyprus",
    slug: "cyprus",
    flag: "🇨🇾",
    region: "Mediterranean",
    capital: "Nicosia",
    languages: ["Greek", "English", "Turkish", "Russian"],
    techHub: "Nicosia Innovation Center",
    keyIndustries: ["Financial Services", "Tourism", "Real Estate", "ICT"],
    businessCulture: "British-influenced business practices with Mediterranean warmth. English is widely used in corporate settings.",
    challenge: "Divided island with separate legal systems (Greek Cypriot/Turkish Cypriot). Highly competitive financial services sector.",
    opportunity: "EU member with favorable corporate tax (12.5%). Growing fintech ecosystem. Strategic hub between EU and Middle East markets.",
    economicContext: "Corporate tax rate 12.5% (lowest in EU). Over 100,000 registered companies. Digital nomad visa program attracting tech talent."
  },
  {
    name: "Czech Republic",
    slug: "czech-republic",
    flag: "🇨🇿",
    region: "Central Europe",
    capital: "Prague",
    languages: ["Czech", "English", "German", "Russian"],
    techHub: "Prague Innovation Center",
    keyIndustries: ["Automotive", "IT & Software", "Engineering", "Manufacturing"],
    businessCulture: "Pragmatic and reserved communication. Business is conducted professionally with emphasis on technical competence.",
    challenge: "Labor market is extremely tight, especially for tech talent. High demand has pushed salaries up significantly.",
    opportunity: "Advanced IT infrastructure with strong engineering tradition. Major R&D hub for automotive and industrial tech. High technology adoption rate.",
    economicContext: "GDP per capita $46,000+ (highest in CEE). Prague is one of Europe's top tech hubs. 200,000+ IT professionals. Strong venture capital ecosystem."
  },
  {
    name: "Estonia",
    slug: "estonia",
    flag: "🇪🇪",
    region: "Northern Europe",
    capital: "Tallinn",
    languages: ["Estonian", "English", "Russian", "Finnish"],
    techHub: "Tallinn Tehnopol & Ülemiste City",
    keyIndustries: ["Digital Government", "Cybersecurity", "IT Services", "Fintech"],
    businessCulture: "Direct, efficient, and digital-first culture. Business processes are streamlined and government services are fully digitized.",
    challenge: "Small domestic market (~1.3M population). Attracting senior talent to a small country with limited entertainment infrastructure.",
    opportunity: "World's most advanced digital society (e-residency, digital ID). 10+ unicorns per capita (Skype, Bolt, Wise). Europe's leading startup ecosystem.",
    economicContext: "e-Residency program with 100,000+ enrolled entrepreneurs. 7+ unicorns per million people (world-leading). Digital society saves 2% of GDP annually."
  },
  {
    name: "Ethiopia",
    slug: "ethiopia",
    flag: "🇪🇹",
    region: "East Africa",
    capital: "Addis Ababa",
    languages: ["Amharic", "English", "Oromo", "Tigrinya"],
    techHub: "Addis Ababa Innovation Hub",
    keyIndustries: ["Agriculture", "Manufacturing", "ICT", "Logistics"],
    businessCulture: "Hierarchical with strong emphasis on respect and relationship-building. Multiple meetings required before business decisions.",
    challenge: "Infrastructure limitations for reliable internet and power. Currency volatility and foreign exchange constraints for repatriating profits.",
    opportunity: "Second-largest population in Africa (120M+). Rapid digitization underway (Ethio Telecom, Safaricom). Growing startup ecosystem with government support.",
    economicContext: "Fastest growing economy in East Africa (6-8% GDP growth). 60%+ mobile penetration with rapid smartphone adoption. Digital Ethiopia 2025 initiative driving transformation."
  },
  {
    name: "Georgia",
    slug: "georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    capital: "Tbilisi",
    languages: ["Georgian", "English", "Russian", "Turkish"],
    techHub: "Tbilisi Tech Park & Innovation Center",
    keyIndustries: ["Tourism", "Agriculture", "ICT", "Logistics"],
    businessCulture: "Warm and hospitable culture where social relationships form the foundation of business. Feasting and toasts are integral to deal-making.",
    challenge: "Limited domestic market size for tech products. Ongoing geopolitical tensions affect investor confidence.",
    opportunity: "Liberal business environment with easy company registration. Fast-growing tech scene (Tbilisi startup ecosystem). Strategic location on the Silk Road corridor.",
    economicContext: "Ranked 7th globally for ease of doing business. 0% tax on retained earnings for IT companies. 50,000+ tech professionals. Digital Nomad visa program active."
  },
  {
    name: "Greece",
    slug: "greece",
    flag: "🇬🇷",
    region: "Southeast Europe",
    capital: "Athens",
    languages: ["Greek", "English", "German", "French"],
    techHub: "Athens Science & Technology Park",
    keyIndustries: ["Tourism", "Shipping", "ICT", "Pharma"],
    businessCulture: "Relationship-focused with importance placed on personal connections and trust. Flexibility and creativity in problem-solving.",
    challenge: "Legacy bureaucracy and slow digitalization in traditional sectors. Recent economic recovery from debt crisis still has lingering effects.",
    opportunity: "Growing startup ecosystem (Athens ranked top 30 globally). Greece's tech talent returning from abroad. EU funds driving digital transformation.",
    economicContext: "GDP growth 2%+. 40+ incubators/accelerators active. Tourism drives 25% of GDP. Growing fintech and SaaS ecosystem in Athens and Thessaloniki."
  },
  {
    name: "Hungary",
    slug: "hungary",
    flag: "🇭🇺",
    region: "Central Europe",
    capital: "Budapest",
    languages: ["Hungarian", "English", "German", "Russian"],
    techHub: "Budapest Science Park & Infopark",
    keyIndustries: ["Automotive", "Pharma", "ICT", "Logistics"],
    businessCulture: "Formal and structured business culture. Communication can be indirect. German-style meetings with clear agendas expected.",
    challenge: "Demographic decline and skilled labor shortage. Government regulatory unpredictability in certain sectors. Currency volatility (HUF).",
    opportunity: "Strong R&D tradition with excellent math and engineering education. Budapest is a major tech hub with 20+ global R&D centers.",
    economicContext: "200,000+ IT professionals. 9% corporate tax rate (one of EU's lowest). Strong automotive R&D (Audi, Mercedes, BMW have large engineering centers)."
  },
  {
    name: "India",
    slug: "india",
    flag: "🇮🇳",
    region: "South Asia",
    capital: "New Delhi",
    languages: ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi"],
    techHub: "Bengaluru - India's Silicon Valley",
    keyIndustries: ["IT Services", "Software", "Manufacturing", "Pharma", "E-commerce"],
    businessCulture: "Hierarchical with high power distance. Relationship-driven with emphasis on long-term commitment. English is the language of business.",
    challenge: "Extremely competitive IT market with thousands of service providers. Price sensitivity and high expectations for value delivery.",
    opportunity: "World's largest IT talent pool (5M+ engineers). 100+ unicorns. Growing SaaS ecosystem (1,200+ SaaS companies). Massive domestic market opportunity.",
    economicContext: "IT sector contributes 7.5% of GDP. SaaS revenue projected to reach $50B by 2030. 3rd largest startup ecosystem globally (100K+ registered startups)."
  },
  {
    name: "Kazakhstan",
    slug: "kazakhstan",
    flag: "🇰🇿",
    region: "Central Asia",
    capital: "Astana",
    languages: ["Kazakh", "Russian", "English", "Turkish"],
    techHub: "Astana Hub - International Technopark of IT Startups",
    keyIndustries: ["Oil & Gas", "Mining", "Agriculture", "ICT", "Logistics"],
    businessCulture: "Formal relationships with gradual trust-building. Business is conducted in Russian or Kazakh initially, English in international-facing companies.",
    challenge: "Extreme continental climate (-40°C to +40°C) affects logistics. Distance from major European markets increases transportation and travel costs.",
    opportunity: "Astana Hub offers 100% tax exemption for IT companies until 2030. Government actively diversifying economy away from oil. Strategic location connecting China and Europe.",
    economicContext: "Largest economy in Central Asia ($225B GDP). Astana Hub has 800+ resident IT companies. Digital Kazakhstan 2025 program with $1B+ in investments."
  },
  {
    name: "Kyrgyzstan",
    slug: "kyrgyzstan",
    flag: "🇰🇬",
    region: "Central Asia",
    capital: "Bishkek",
    languages: ["Kyrgyz", "Russian", "English", "Uzbek"],
    techHub: "Bishkek IT Park & High Technology Park",
    keyIndustries: ["Agriculture", "Mining", "Tourism", "ICT"],
    businessCulture: "Relationship-first culture with strong hospitality traditions. Business often mixes with social gatherings and meals.",
    challenge: "Small market size (6.5M population). Limited VC funding and early-stage investment ecosystem.",
    opportunity: "IT Park offers 0% tax on all activities for IT companies. Growing outsourcing destination with competitive rates ($20-35/hr). English proficiency improving among younger generation.",
    economicContext: "IT Park tax incentives (0% profit tax, 0% VAT, 0% payroll tax). 400+ IT companies registered. Growing remote work ecosystem with cost advantage."
  },
  {
    name: "Latvia",
    slug: "latvia",
    flag: "🇱🇻",
    region: "Northern Europe",
    capital: "Riga",
    languages: ["Latvian", "English", "Russian", "German"],
    techHub: "Riga TechHub & Innovation Center",
    keyIndustries: ["IT Services", "Fintech", "Logistics", "Manufacturing"],
    businessCulture: "Northern European directness with reserved initial communication. Punctuality and reliability are highly valued.",
    challenge: "Small domestic market (~1.9M population). Competition for tech talent with Lithuanian and Estonian companies.",
    opportunity: "EU member with strong digital infrastructure. Growing fintech ecosystem (Mintos, Twino). Strategic logistics hub connecting EU and CIS.",
    economicContext: "IT sector growing 8% annually. 25,000+ IT professionals. Startup visa program active. Riga is emerging Baltic tech hub alongside Tallinn and Vilnius."
  },
  {
    name: "Lithuania",
    slug: "lithuania",
    flag: "🇱🇹",
    region: "Northern Europe",
    capital: "Vilnius",
    languages: ["Lithuanian", "English", "Russian", "Polish"],
    techHub: "Vilnius Tech Park & Innovation Park",
    keyIndustries: ["Fintech", "IT Services", "Biotech", "Manufacturing"],
    businessCulture: "Reserved but warm once rapport is established. Punctual, direct communication. Young workforce with strong English skills.",
    challenge: "Small talent pool relative to demand. Rapidly rising salaries in tech sector.",
    opportunity: "Leading fintech hub in Europe (300+ fintech companies). EU single digital market access. Centralized licensing advantage for financial services.",
    economicContext: "Fintech sector growing 25% annually. 50,000+ IT professionals. 700+ B2B SaaS companies. Vilnius ranked among top 30 startup cities globally."
  },
  {
    name: "Moldova",
    slug: "moldova",
    flag: "🇲🇩",
    region: "Eastern Europe",
    capital: "Chisinau",
    languages: ["Romanian", "Russian", "English", "Ukrainian"],
    techHub: "Chisinau IT Park & Tekwill",
    keyIndustries: ["Agriculture", "IT Services", "Manufacturing", "Wine"],
    businessCulture: "Warm and hospitable with Southern European influences. Personal relationships and social credibility are essential before business.",
    challenge: "Small economy with political uncertainty. Limited access to international payments systems. Infrastructure gaps.",
    opportunity: "Moldova IT Park offers 7% single tax rate on revenue. Very competitive tech labor costs ($15-30/hr). Growing nearshoring destination for EU companies.",
    economicContext: "Moldova IT Park (MITP) created 1,000+ IT companies since 2018. IT sector growing 25%+ annually. EU candidate country with development funding programs."
  },
  {
    name: "Montenegro",
    slug: "montenegro",
    flag: "🇲🇪",
    region: "Southeast Europe",
    capital: "Podgorica",
    languages: ["Montenegrin", "Serbian", "English", "Russian"],
    techHub: "Podgorica Technology Park",
    keyIndustries: ["Tourism", "Energy", "Real Estate", "ICT"],
    businessCulture: "Mediterranean business style with relaxed timelines. Personal connections open doors. Relationships formed over coffee and meals.",
    challenge: "Very small domestic market (~620K population). Limited specialized tech talent in niche areas.",
    opportunity: "Growing digital nomad community. EU candidate country with tourism-driven digital transformation needs. Competitive corporate tax (9%).",
    economicContext: "Corporate income tax 9% (among lowest in Europe). Tourism contributes 25% of GDP. Growing IT sector with focus on tourism tech solutions."
  },
  {
    name: "North Macedonia",
    slug: "north-macedonia",
    flag: "🇲🇰",
    region: "Southeast Europe",
    capital: "Skopje",
    languages: ["Macedonian", "Albanian", "English", "Turkish"],
    techHub: "Skopje Tech Park",
    keyIndustries: ["Manufacturing", "IT Services", "Agriculture", "Textiles"],
    businessCulture: "Warm and informal communication style. Business relationships develop through repeated social interactions.",
    challenge: "Limited brand recognition as a tech destination. Brain drain to Western Europe. Pending EU accession creates policy uncertainty.",
    opportunity: "Competitive operating costs with improving infrastructure. Growing nearshoring destination for EU companies. Government tech investment incentives.",
    economicContext: "Flat 10% corporate and personal income tax. IT sector growing 15% annually. Free economic zones with 10-year tax holidays. English proficiency improving."
  },
  {
    name: "Poland",
    slug: "poland",
    flag: "🇵🇱",
    region: "Central Europe",
    capital: "Warsaw",
    languages: ["Polish", "English", "German", "Russian", "Ukrainian"],
    techHub: "Warsaw Business Hub & Krakow Tech Park",
    keyIndustries: ["IT Outsourcing", "Manufacturing", "Fintech", "Gaming", "Logistics"],
    businessCulture: "Formal business culture with hierarchical structure. Relationship-building over time is valued. Direct but polite communication.",
    challenge: "Rapidly rising labor costs in IT (wages up 15-20% annually). High competition for senior tech talent across all sectors.",
    opportunity: "Largest IT talent pool in CEE (400,000+ developers). 50+ tech unicorns and 2,000+ SaaS companies. Strong VC ecosystem and EU funding availability.",
    economicContext: "Corporate tax: 9% for small businesses, 19% standard. 400,000+ developers, 50+ tech unicorns. Warsaw and Krakow are top 20 European tech hubs."
  },
  {
    name: "Romania",
    slug: "romania",
    flag: "🇷🇴",
    region: "Southeast Europe",
    capital: "Bucharest",
    languages: ["Romanian", "English", "French", "German"],
    techHub: "Bucharest Tech Hub & Cluj Innovation Park",
    keyIndustries: ["IT Outsourcing", "Automotive", "Manufacturing", "Agriculture"],
    businessCulture: "Latin-influenced warmth in business interactions. Relationships matter, but professional competence is the primary trust-builder.",
    challenge: "Infrastructure gaps outside major cities. Tax system complexity and frequent legislative changes.",
    opportunity: "One of Europe's fastest-growing tech ecosystems. 220,000+ IT professionals with strong English skills. Very competitive rates vs. Western Europe.",
    economicContext: "IT professionals: 220,000+. IT sector contributes 6% of GDP. No corporate tax on reinvested profits for IT companies. 3% IT salary tax exemption."
  },
  {
    name: "Serbia",
    slug: "serbia",
    flag: "🇷🇸",
    region: "Southeast Europe",
    capital: "Belgrade",
    languages: ["Serbian", "English", "Russian", "German"],
    techHub: "Belgrade Science & Technology Park",
    keyIndustries: ["IT Services", "Agriculture", "Manufacturing", "Energy"],
    businessCulture: "Personal relationships are critical. Social settings (coffee, meals) precede business discussions. Trust is earned over time.",
    challenge: "Non-EU membership affects some cross-border data and trade agreements. Brain drain of young professionals to EU countries.",
    opportunity: "Strong engineering tradition with 100,000+ developers. Government offers tax incentives for R&D. Growing startup ecosystem (Strawberry Energy, Nordeus).",
    economicContext: "IT sector growing 20%+ annually. 100,000+ software developers. Tax exemption for R&D projects. 40+ science and technology parks active."
  },
  {
    name: "Slovakia",
    slug: "slovakia",
    flag: "🇸🇰",
    region: "Central Europe",
    capital: "Bratislava",
    languages: ["Slovak", "English", "German", "Hungarian"],
    techHub: "Bratislava Technology Park & Košice Innovation Hub",
    keyIndustries: ["Automotive", "IT Services", "Manufacturing", "Electronics"],
    businessCulture: "Reserved and professional. German-influenced management style with emphasis on precision and planning.",
    challenge: "Small population (5.4M) limits domestic tech talent pool. Dependency on automotive sector for economic stability.",
    opportunity: "Strategic location with direct access to Western European markets. Growing IT sector supported by EU digital transformation funds.",
    economicContext: "Corporate tax 21% (with lower rates for startups). IT sector growing 10% annually. EU single market access. Strong industrial R&D tradition."
  },
  {
    name: "Slovenia",
    slug: "slovenia",
    flag: "🇸🇮",
    region: "Central Europe",
    capital: "Ljubljana",
    languages: ["Slovenian", "English", "German", "Italian"],
    techHub: "Ljubljana Technology Park",
    keyIndustries: ["Manufacturing", "Pharma", "ICT", "Tourism"],
    businessCulture: "Egalitarian management style with low power distance. Work-life balance is prioritized. Meetings are structured and efficient.",
    challenge: "Very small domestic market (2.1M population). High cost of labor relative to regional competitors.",
    opportunity: "Excellent infrastructure and quality of life attract top talent. R&D-intensive economy with strong patent output per capita.",
    economicContext: "R&D spending 2.5% of GDP (above EU average). Strong startup culture (Lek, Outfit7, Celtra). High English proficiency (94th globally)."
  },
  {
    name: "Ukraine",
    slug: "ukraine",
    flag: "🇺🇦",
    region: "Eastern Europe",
    capital: "Kyiv",
    languages: ["Ukrainian", "Russian", "English", "Polish"],
    techHub: "Kyiv Tech Hub & Lviv IT Park",
    keyIndustries: ["IT Outsourcing", "Agriculture", "Manufacturing", "Defense Tech"],
    businessCulture: "Relationship-driven with emphasis on personal connections. Adaptable and resilient communication style. Directness is appreciated.",
    challenge: "War-induced disruptions and safety concerns. Power outages and infrastructure damage affect operational reliability.",
    opportunity: "200,000+ world-class IT professionals. Reshoring to Ukraine is increasing as global demand persists. Diia.City legal framework offers 5% tax rate for IT companies.",
    economicContext: "200,000+ IT professionals. Diia.City tax rate: 5% on income. IT sector contributed $7B+ in exports (2023). Over 5,000 tech companies registered in Diia.City."
  },
  {
    name: "Uzbekistan",
    slug: "uzbekistan",
    flag: "🇺🇿",
    region: "Central Asia",
    capital: "Tashkent",
    languages: ["Uzbek", "Russian", "English", "Turkish"],
    techHub: "Tashkent IT Park & Inha University Campus",
    keyIndustries: ["ICT", "Textiles", "Agriculture", "Energy", "Tourism"],
    businessCulture: "Formal and respectful with emphasis on age and position. Relationships must be cultivated over several meetings before business discussions.",
    challenge: "Limited English proficiency among senior business leaders. Currency control restrictions affect payment and repatriation of funds.",
    opportunity: "Fastest economic reforms in Central Asia. IT Park offers extensive tax benefits (0% taxes until 2040 for IT companies). Growing outsourcing destination.",
    economicContext: "IT Park residents enjoy 0% corporate tax, 0% personal income tax, and 0% social tax until 2040. 1,000+ IT companies registered. Digital Uzbekistan 2030 is a $2B+ national program."
  }
];

export function getCountryBySlug(slug: string): CountryInfo | undefined {
  return COUNTRIES.find(c => c.slug === slug);
}

export function getCountriesByRegion(region: string): CountryInfo[] {
  return COUNTRIES.filter(c => c.region === region);
}

export const REGIONS = [
  { name: "Central Europe", description: "Poland, Czech Republic, Hungary, Slovakia, Slovenia" },
  { name: "Southeast Europe", description: "Bulgaria, Romania, Croatia, Serbia, Bosnia, Albania, North Macedonia, Montenegro" },
  { name: "Eastern Europe", description: "Ukraine, Moldova" },
  { name: "Caucasus", description: "Georgia, Armenia, Azerbaijan" },
  { name: "Central Asia", description: "Kazakhstan, Uzbekistan, Kyrgyzstan" },
  { name: "Northern Europe", description: "Estonia, Latvia, Lithuania" },
  { name: "Mediterranean", description: "Cyprus, Greece" },
  { name: "East Africa", description: "Ethiopia" },
  { name: "South Asia", description: "India" },
];
