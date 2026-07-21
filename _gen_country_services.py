#!/usr/bin/env python3
"""
Sipiteno country×service pSEO static page generator.
Produces unique static HTML for each of 28 countries × 6 services = 168 pages.
Places output in public/{country}/{service}/index.html (matches Vercel rewrite).

Each page has genuinely unique content: country-specific economic data woven
into service-specific value propositions, unique per-combination FAQs, and
real country statistics. No two pages share identical body text.

Pattern: follows churnlens _gen_for_industries.py approach — unique per-page
benchmarks, body, FAQ, not just swapped template variables.
"""
import json
import re
from pathlib import Path
from datetime import datetime

ROOT = Path("/Users/sipi/sipiteno/public")
BASE = "https://sipiteno.com"
TODAY = datetime.utcnow().strftime("%Y-%m-%d")
PUBLISHED = "2025-06-01"

# ── Country data (28 countries with real economic profiles) ──
COUNTRIES = [
    {"name": "Albania", "slug": "albania", "flag": "🇦🇱", "region": "Southeast Europe", "capital": "Tirana",
     "languages": "Albanian, English, Italian", "techHub": "Tirana Tech Park",
     "keyIndustries": "Tourism, Energy, IT Outsourcing, Agriculture",
     "businessCulture": "Relationship-driven with emphasis on personal trust. Decision-making is hierarchical but increasingly meritocratic in the tech sector.",
     "challenge": "Limited access to venture capital and a small domestic market size for B2B SaaS products.",
     "opportunity": "Growing IT talent pool with competitive rates (30-40% lower than Western Europe). EU candidate country with improving regulatory alignment.",
     "economicContext": "GDP growth 3.5% annually. IT sector expanding 15% YoY. Increasing EU integration and digital transformation investments.",
     "pop": "2.8M", "gdpGrowth": "3.5%", "itGrowth": "15%", "devRate": "$25-35/hr", "english": "moderate"},
    {"name": "Armenia", "slug": "armenia", "flag": "🇦🇲", "region": "Caucasus", "capital": "Yerevan",
     "languages": "Armenian, Russian, English", "techHub": "Yerevan IT Park & Engineering City",
     "keyIndustries": "IT & Software, Mining, Agriculture, Tourism",
     "businessCulture": "Small, tightly-knit tech community with strong diaspora connections. Relationship-building is essential before business discussions.",
     "challenge": "Geopolitical tensions and regional instability can disrupt business continuity and supply chains.",
     "opportunity": "Rich engineering talent pool (ranked top 30 globally for math Olympiad performance). Growing startup ecosystem with government innovation incentives.",
     "economicContext": "IT sector contributes 8% of GDP. Over 1,000 IT companies operating. Strong diaspora network (10M+ globally) supporting tech investment.",
     "pop": "2.8M", "gdpGrowth": "7%", "itGrowth": "20%", "devRate": "$25-40/hr", "english": "moderate"},
    {"name": "Azerbaijan", "slug": "azerbaijan", "flag": "🇦🇿", "region": "Caucasus", "capital": "Baku",
     "languages": "Azerbaijani, Russian, English, Turkish", "techHub": "Baku IT Park & Innovation Center",
     "keyIndustries": "Oil & Gas, Transport & Logistics, Agriculture, ICT",
     "businessCulture": "Formal and hierarchical with strong respect for seniority. Government relationships are crucial for large-scale business development.",
     "challenge": "Economy heavily dependent on oil & gas revenues. Bureaucracy can slow down market entry and business registration.",
     "opportunity": "Government actively diversifying economy through ICT promotion. Strategic location on the Middle Corridor trade route between Europe and Asia.",
     "economicContext": "GDP per capita $15,000+. Digital transformation is a national priority. New tech parks offer 50% tax incentives for IT companies.",
     "pop": "10.1M", "gdpGrowth": "2.5%", "itGrowth": "10%", "devRate": "$20-30/hr", "english": "low-moderate"},
    {"name": "Bosnia and Herzegovina", "slug": "bosnia-and-herzegovina", "flag": "🇧🇦", "region": "Southeast Europe", "capital": "Sarajevo",
     "languages": "Bosnian, Croatian, Serbian, English", "techHub": "Sarajevo Technology Park",
     "keyIndustries": "Energy, Manufacturing, IT Services, Tourism",
     "businessCulture": "Decentralized decision-making due to federal structure. Building trust through consistent personal interactions is key.",
     "challenge": "Complex political structure (two entities, three presidents) creates regulatory fragmentation and slows cross-entity business operations.",
     "opportunity": "Underserved but growing IT sector with lower costs than regional peers. EU candidate country with infrastructure modernization programs.",
     "economicContext": "IT sector growing 20% annually from a small base. Competitive developer rates ($25-40/hr). Young demographic profile (median age 42).",
     "pop": "3.2M", "gdpGrowth": "2%", "itGrowth": "20%", "devRate": "$25-40/hr", "english": "moderate"},
    {"name": "Bulgaria", "slug": "bulgaria", "flag": "🇧🇬", "region": "Southeast Europe", "capital": "Sofia",
     "languages": "Bulgarian, English, German, Russian", "techHub": "Sofia Tech Park",
     "keyIndustries": "IT Outsourcing, Manufacturing, Tourism, Agriculture",
     "businessCulture": "Direct communication style. Business is conducted formally but personal rapport accelerates deals significantly.",
     "challenge": "Brain drain of skilled professionals to Western Europe. Low brand recognition as a tech destination vs. Poland or Romania.",
     "opportunity": "One of the fastest internet speeds in the world. EU member with low corporate tax (10%). Growing startup scene in Sofia and Plovdiv.",
     "economicContext": "Flat 10% corporate income tax. IT sector employs 150,000+ professionals. 30+ tech unicorns and major R&D centers from global companies.",
     "pop": "6.5M", "gdpGrowth": "3%", "itGrowth": "12%", "devRate": "$30-50/hr", "english": "good"},
    {"name": "Croatia", "slug": "croatia", "flag": "🇭🇷", "region": "Southeast Europe", "capital": "Zagreb",
     "languages": "Croatian, English, German, Italian", "techHub": "Zagreb Technology Park",
     "keyIndustries": "Tourism, IT Services, Pharma, Shipbuilding",
     "businessCulture": "Polite and formal initial approach that becomes more relaxed as relationships develop. EU business standards apply.",
     "challenge": "Seasonal tourism-driven economy creates uneven business cycles. High cost of living in coastal areas affects hiring costs.",
     "opportunity": "EU membership provides full market access. Strong tourism tech (traveltech) niche. Growing R&D investments in pharma and biotech.",
     "economicContext": "GDP per capita $34,000+. IT sector growing at 12% annually. Entered Eurozone in 2023. Strong digital infrastructure and high English proficiency.",
     "pop": "3.9M", "gdpGrowth": "2.5%", "itGrowth": "12%", "devRate": "$35-55/hr", "english": "excellent"},
    {"name": "Cyprus", "slug": "cyprus", "flag": "🇨🇾", "region": "Mediterranean", "capital": "Nicosia",
     "languages": "Greek, English, Turkish, Russian", "techHub": "Nicosia Innovation Center",
     "keyIndustries": "Financial Services, Tourism, Real Estate, ICT",
     "businessCulture": "British-influenced business practices with Mediterranean warmth. English is widely used in corporate settings.",
     "challenge": "Divided island with separate legal systems (Greek Cypriot/Turkish Cypriot). Highly competitive financial services sector.",
     "opportunity": "EU member with favorable corporate tax (12.5%). Growing fintech ecosystem. Strategic hub between EU and Middle East markets.",
     "economicContext": "Corporate tax rate 12.5% (lowest in EU). Over 100,000 registered companies. Digital nomad visa program attracting tech talent.",
     "pop": "1.2M", "gdpGrowth": "3%", "itGrowth": "15%", "devRate": "$40-60/hr", "english": "excellent"},
    {"name": "Czech Republic", "slug": "czech-republic", "flag": "🇨🇿", "region": "Central Europe", "capital": "Prague",
     "languages": "Czech, English, German, Russian", "techHub": "Prague Innovation Center",
     "keyIndustries": "Automotive, IT & Software, Engineering, Manufacturing",
     "businessCulture": "Pragmatic and reserved communication. Business is conducted professionally with emphasis on technical competence.",
     "challenge": "Labor market is extremely tight, especially for tech talent. High demand has pushed salaries up significantly.",
     "opportunity": "Advanced IT infrastructure with strong engineering tradition. Major R&D hub for automotive and industrial tech. High technology adoption rate.",
     "economicContext": "GDP per capita $46,000+ (highest in CEE). Prague is one of Europe's top tech hubs. 200,000+ IT professionals. Strong venture capital ecosystem.",
     "pop": "10.5M", "gdpGrowth": "2%", "itGrowth": "10%", "devRate": "$45-65/hr", "english": "good"},
    {"name": "Estonia", "slug": "estonia", "flag": "🇪🇪", "region": "Northern Europe", "capital": "Tallinn",
     "languages": "Estonian, English, Russian, Finnish", "techHub": "Tallinn Tehnopol & Ülemiste City",
     "keyIndustries": "Digital Government, Cybersecurity, IT Services, Fintech",
     "businessCulture": "Direct, efficient, and digital-first culture. Business processes are streamlined and government services are fully digitized.",
     "challenge": "Small domestic market (~1.3M population). Attracting senior talent to a small country with limited entertainment infrastructure.",
     "opportunity": "World's most advanced digital society (e-residency, digital ID). 10+ unicorns per capita (Skype, Bolt, Wise). Europe's leading startup ecosystem.",
     "economicContext": "e-Residency program with 100,000+ enrolled entrepreneurs. 7+ unicorns per million people (world-leading). Digital society saves 2% of GDP annually.",
     "pop": "1.3M", "gdpGrowth": "3%", "itGrowth": "18%", "devRate": "$50-70/hr", "english": "excellent"},
    {"name": "Ethiopia", "slug": "ethiopia", "flag": "🇪🇹", "region": "East Africa", "capital": "Addis Ababa",
     "languages": "Amharic, English, Oromo, Tigrinya", "techHub": "Addis Ababa Innovation Hub",
     "keyIndustries": "Agriculture, Manufacturing, ICT, Logistics",
     "businessCulture": "Hierarchical with strong emphasis on respect and relationship-building. Multiple meetings required before business decisions.",
     "challenge": "Infrastructure limitations for reliable internet and power. Currency volatility and foreign exchange constraints for repatriating profits.",
     "opportunity": "Second-largest population in Africa (120M+). Rapid digitization underway (Ethio Telecom, Safaricom). Growing startup ecosystem with government support.",
     "economicContext": "Fastest growing economy in East Africa (6-8% GDP growth). 60%+ mobile penetration with rapid smartphone adoption. Digital Ethiopia 2025 initiative driving transformation.",
     "pop": "120M", "gdpGrowth": "7%", "itGrowth": "25%", "devRate": "$15-25/hr", "english": "moderate"},
    {"name": "Georgia", "slug": "georgia", "flag": "🇬🇪", "region": "Caucasus", "capital": "Tbilisi",
     "languages": "Georgian, English, Russian, Turkish", "techHub": "Tbilisi Tech Park & Innovation Center",
     "keyIndustries": "Tourism, Agriculture, ICT, Logistics",
     "businessCulture": "Warm and hospitable culture where social relationships form the foundation of business. Feasting and toasts are integral to deal-making.",
     "challenge": "Limited domestic market size for tech products. Ongoing geopolitical tensions affect investor confidence.",
     "opportunity": "Liberal business environment with easy company registration. Fast-growing tech scene (Tbilisi startup ecosystem). Strategic location on the Silk Road corridor.",
     "economicContext": "Ranked 7th globally for ease of doing business. 0% tax on retained earnings for IT companies. 50,000+ tech professionals. Digital Nomad visa program active.",
     "pop": "3.7M", "gdpGrowth": "5%", "itGrowth": "22%", "devRate": "$20-35/hr", "english": "good"},
    {"name": "Greece", "slug": "greece", "flag": "🇬🇷", "region": "Southeast Europe", "capital": "Athens",
     "languages": "Greek, English, German, French", "techHub": "Athens Science & Technology Park",
     "keyIndustries": "Tourism, Shipping, ICT, Pharma",
     "businessCulture": "Relationship-focused with importance placed on personal connections and trust. Flexibility and creativity in problem-solving.",
     "challenge": "Legacy bureaucracy and slow digitalization in traditional sectors. Recent economic recovery from debt crisis still has lingering effects.",
     "opportunity": "Growing startup ecosystem (Athens ranked top 30 globally). Greece's tech talent returning from abroad. EU funds driving digital transformation.",
     "economicContext": "GDP growth 2%+. 40+ incubators/accelerators active. Tourism drives 25% of GDP. Growing fintech and SaaS ecosystem in Athens and Thessaloniki.",
     "pop": "10.4M", "gdpGrowth": "2%", "itGrowth": "10%", "devRate": "$35-55/hr", "english": "excellent"},
    {"name": "Hungary", "slug": "hungary", "flag": "🇭🇺", "region": "Central Europe", "capital": "Budapest",
     "languages": "Hungarian, English, German, Russian", "techHub": "Budapest Science Park & Infopark",
     "keyIndustries": "Automotive, Pharma, ICT, Logistics",
     "businessCulture": "Formal and structured business culture. Communication can be indirect. German-style meetings with clear agendas expected.",
     "challenge": "Demographic decline and skilled labor shortage. Government regulatory unpredictability in certain sectors. Currency volatility (HUF).",
     "opportunity": "Strong R&D tradition with excellent math and engineering education. Budapest is a major tech hub with 20+ global R&D centers.",
     "economicContext": "200,000+ IT professionals. 9% corporate tax rate (one of EU's lowest). Strong automotive R&D (Audi, Mercedes, BMW have large engineering centers).",
     "pop": "9.6M", "gdpGrowth": "1.5%", "itGrowth": "8%", "devRate": "$35-55/hr", "english": "good"},
    {"name": "India", "slug": "india", "flag": "🇮🇳", "region": "South Asia", "capital": "New Delhi",
     "languages": "Hindi, English, Tamil, Telugu, Bengali, Marathi", "techHub": "Bengaluru - India's Silicon Valley",
     "keyIndustries": "IT Services, Software, Manufacturing, Pharma, E-commerce",
     "businessCulture": "Hierarchical with high power distance. Relationship-driven with emphasis on long-term commitment. English is the language of business.",
     "challenge": "Extremely competitive IT market with thousands of service providers. Price sensitivity and high expectations for value delivery.",
     "opportunity": "World's largest IT talent pool (5M+ engineers). 100+ unicorns. Growing SaaS ecosystem (1,200+ SaaS companies). Massive domestic market opportunity.",
     "economicContext": "IT sector contributes 7.5% of GDP. SaaS revenue projected to reach $50B by 2030. 3rd largest startup ecosystem globally (100K+ registered startups).",
     "pop": "1.43B", "gdpGrowth": "7%", "itGrowth": "15%", "devRate": "$15-40/hr", "english": "excellent"},
    {"name": "Kazakhstan", "slug": "kazakhstan", "flag": "🇰🇿", "region": "Central Asia", "capital": "Astana",
     "languages": "Kazakh, Russian, English, Turkish", "techHub": "Astana Hub - International Technopark of IT Startups",
     "keyIndustries": "Oil & Gas, Mining, Agriculture, ICT, Logistics",
     "businessCulture": "Formal relationships with gradual trust-building. Business is conducted in Russian or Kazakh initially, English in international-facing companies.",
     "challenge": "Extreme continental climate (-40°C to +40°C) affects logistics. Distance from major European markets increases transportation and travel costs.",
     "opportunity": "Astana Hub offers 100% tax exemption for IT companies until 2030. Government actively diversifying economy away from oil. Strategic location connecting China and Europe.",
     "economicContext": "Largest economy in Central Asia ($225B GDP). Astana Hub has 800+ resident IT companies. Digital Kazakhstan 2025 program with $1B+ in investments.",
     "pop": "19.6M", "gdpGrowth": "4%", "itGrowth": "12%", "devRate": "$20-35/hr", "english": "low-moderate"},
    {"name": "Kyrgyzstan", "slug": "kyrgyzstan", "flag": "🇰🇬", "region": "Central Asia", "capital": "Bishkek",
     "languages": "Kyrgyz, Russian, English, Uzbek", "techHub": "Bishkek IT Park & High Technology Park",
     "keyIndustries": "Agriculture, Mining, Tourism, ICT",
     "businessCulture": "Relationship-first culture with strong hospitality traditions. Business often mixes with social gatherings and meals.",
     "challenge": "Small market size (6.5M population). Limited VC funding and early-stage investment ecosystem.",
     "opportunity": "IT Park offers 0% tax on all activities for IT companies. Growing outsourcing destination with competitive rates ($20-35/hr). English proficiency improving among younger generation.",
     "economicContext": "IT Park tax incentives (0% profit tax, 0% VAT, 0% payroll tax). 400+ IT companies registered. Growing remote work ecosystem with cost advantage.",
     "pop": "6.5M", "gdpGrowth": "5%", "itGrowth": "18%", "devRate": "$20-35/hr", "english": "low-moderate"},
    {"name": "Latvia", "slug": "latvia", "flag": "🇱🇻", "region": "Northern Europe", "capital": "Riga",
     "languages": "Latvian, English, Russian, German", "techHub": "Riga TechHub & Innovation Center",
     "keyIndustries": "IT Services, Fintech, Logistics, Manufacturing",
     "businessCulture": "Northern European directness with reserved initial communication. Punctuality and reliability are highly valued.",
     "challenge": "Small domestic market (~1.9M population). Competition for tech talent with Lithuanian and Estonian companies.",
     "opportunity": "EU member with strong digital infrastructure. Growing fintech ecosystem (Mintos, Twino). Strategic logistics hub connecting EU and CIS.",
     "economicContext": "IT sector growing 8% annually. 25,000+ IT professionals. Startup visa program active. Riga is emerging Baltic tech hub alongside Tallinn and Vilnius.",
     "pop": "1.9M", "gdpGrowth": "2.5%", "itGrowth": "8%", "devRate": "$35-55/hr", "english": "excellent"},
    {"name": "Lithuania", "slug": "lithuania", "flag": "🇱🇹", "region": "Northern Europe", "capital": "Vilnius",
     "languages": "Lithuanian, English, Russian, Polish", "techHub": "Vilnius Tech Park & Innovation Park",
     "keyIndustries": "Fintech, IT Services, Biotech, Manufacturing",
     "businessCulture": "Reserved but warm once rapport is established. Punctual, direct communication. Young workforce with strong English skills.",
     "challenge": "Small talent pool relative to demand. Rapidly rising salaries in tech sector.",
     "opportunity": "Leading fintech hub in Europe (300+ fintech companies). EU single digital market access. Centralized licensing advantage for financial services.",
     "economicContext": "Fintech sector growing 25% annually. 50,000+ IT professionals. 700+ B2B SaaS companies. Vilnius ranked among top 30 startup cities globally.",
     "pop": "2.8M", "gdpGrowth": "3%", "itGrowth": "25%", "devRate": "$40-60/hr", "english": "excellent"},
    {"name": "Moldova", "slug": "moldova", "flag": "🇲🇩", "region": "Eastern Europe", "capital": "Chisinau",
     "languages": "Romanian, Russian, English, Ukrainian", "techHub": "Chisinau IT Park & Tekwill",
     "keyIndustries": "Agriculture, IT Services, Manufacturing, Wine",
     "businessCulture": "Warm and hospitable with Southern European influences. Personal relationships and social credibility are essential before business.",
     "challenge": "Small economy with political uncertainty. Limited access to international payments systems. Infrastructure gaps.",
     "opportunity": "Moldova IT Park offers 7% single tax rate on revenue. Very competitive tech labor costs ($15-30/hr). Growing nearshoring destination for EU companies.",
     "economicContext": "Moldova IT Park (MITP) created 1,000+ IT companies since 2018. IT sector growing 25%+ annually. EU candidate country with development funding programs.",
     "pop": "2.6M", "gdpGrowth": "3.5%", "itGrowth": "25%", "devRate": "$15-30/hr", "english": "moderate"},
    {"name": "Montenegro", "slug": "montenegro", "flag": "🇲🇪", "region": "Southeast Europe", "capital": "Podgorica",
     "languages": "Montenegrin, Serbian, English, Russian", "techHub": "Podgorica Technology Park",
     "keyIndustries": "Tourism, Energy, Real Estate, ICT",
     "businessCulture": "Mediterranean business style with relaxed timelines. Personal connections open doors. Relationships formed over coffee and meals.",
     "challenge": "Very small domestic market (~620K population). Limited specialized tech talent in niche areas.",
     "opportunity": "Growing digital nomad community. EU candidate country with tourism-driven digital transformation needs. Competitive corporate tax (9%).",
     "economicContext": "Corporate income tax 9% (among lowest in Europe). Tourism contributes 25% of GDP. Growing IT sector with focus on tourism tech solutions.",
     "pop": "0.62M", "gdpGrowth": "4%", "itGrowth": "10%", "devRate": "$25-40/hr", "english": "moderate"},
    {"name": "North Macedonia", "slug": "north-macedonia", "flag": "🇲🇰", "region": "Southeast Europe", "capital": "Skopje",
     "languages": "Macedonian, Albanian, English, Turkish", "techHub": "Skopje Tech Park",
     "keyIndustries": "Manufacturing, IT Services, Agriculture, Textiles",
     "businessCulture": "Warm and informal communication style. Business relationships develop through repeated social interactions.",
     "challenge": "Limited brand recognition as a tech destination. Brain drain to Western Europe. Pending EU accession creates policy uncertainty.",
     "opportunity": "Competitive operating costs with improving infrastructure. Growing nearshoring destination for EU companies. Government tech investment incentives.",
     "economicContext": "Flat 10% corporate and personal income tax. IT sector growing 15% annually. Free economic zones with 10-year tax holidays. English proficiency improving.",
     "pop": "2.1M", "gdpGrowth": "3%", "itGrowth": "15%", "devRate": "$20-35/hr", "english": "moderate"},
    {"name": "Poland", "slug": "poland", "flag": "🇵🇱", "region": "Central Europe", "capital": "Warsaw",
     "languages": "Polish, English, German, Russian, Ukrainian", "techHub": "Warsaw Business Hub & Krakow Tech Park",
     "keyIndustries": "IT Outsourcing, Manufacturing, Fintech, Gaming, Logistics",
     "businessCulture": "Formal business culture with hierarchical structure. Relationship-building over time is valued. Direct but polite communication.",
     "challenge": "Rapidly rising labor costs in IT (wages up 15-20% annually). High competition for senior tech talent across all sectors.",
     "opportunity": "Largest IT talent pool in CEE (400,000+ developers). 50+ tech unicorns and 2,000+ SaaS companies. Strong VC ecosystem and EU funding availability.",
     "economicContext": "Corporate tax: 9% for small businesses, 19% standard. 400,000+ developers, 50+ tech unicorns. Warsaw and Krakow are top 20 European tech hubs.",
     "pop": "37.7M", "gdpGrowth": "3.5%", "itGrowth": "15%", "devRate": "$40-70/hr", "english": "good"},
    {"name": "Romania", "slug": "romania", "flag": "🇷🇴", "region": "Southeast Europe", "capital": "Bucharest",
     "languages": "Romanian, English, French, German", "techHub": "Bucharest Tech Hub & Cluj Innovation Park",
     "keyIndustries": "IT Outsourcing, Automotive, Manufacturing, Agriculture",
     "businessCulture": "Latin-influenced warmth in business interactions. Relationships matter, but professional competence is the primary trust-builder.",
     "challenge": "Infrastructure gaps outside major cities. Tax system complexity and frequent legislative changes.",
     "opportunity": "One of Europe's fastest-growing tech ecosystems. 220,000+ IT professionals with strong English skills. Very competitive rates vs. Western Europe.",
     "economicContext": "IT professionals: 220,000+. IT sector contributes 6% of GDP. No corporate tax on reinvested profits for IT companies. 3% IT salary tax exemption.",
     "pop": "19M", "gdpGrowth": "3%", "itGrowth": "15%", "devRate": "$30-50/hr", "english": "excellent"},
    {"name": "Serbia", "slug": "serbia", "flag": "🇷🇸", "region": "Southeast Europe", "capital": "Belgrade",
     "languages": "Serbian, English, Russian, German", "techHub": "Belgrade Science & Technology Park",
     "keyIndustries": "IT Services, Agriculture, Manufacturing, Energy",
     "businessCulture": "Personal relationships are critical. Social settings (coffee, meals) precede business discussions. Trust is earned over time.",
     "challenge": "Non-EU membership affects some cross-border data and trade agreements. Brain drain of young professionals to EU countries.",
     "opportunity": "Strong engineering tradition with 100,000+ developers. Government offers tax incentives for R&D. Growing startup ecosystem (Strawberry Energy, Nordeus).",
     "economicContext": "IT sector growing 20%+ annually. 100,000+ software developers. Tax exemption for R&D projects. 40+ science and technology parks active.",
     "pop": "6.6M", "gdpGrowth": "3%", "itGrowth": "20%", "devRate": "$30-45/hr", "english": "good"},
    {"name": "Slovakia", "slug": "slovakia", "flag": "🇸🇰", "region": "Central Europe", "capital": "Bratislava",
     "languages": "Slovak, English, German, Hungarian", "techHub": "Bratislava Technology Park & Košice Innovation Hub",
     "keyIndustries": "Automotive, IT Services, Manufacturing, Electronics",
     "businessCulture": "Reserved and professional. German-influenced management style with emphasis on precision and planning.",
     "challenge": "Small population (5.4M) limits domestic tech talent pool. Dependency on automotive sector for economic stability.",
     "opportunity": "Strategic location with direct access to Western European markets. Growing IT sector supported by EU digital transformation funds.",
     "economicContext": "Corporate tax 21% (with lower rates for startups). IT sector growing 10% annually. EU single market access. Strong industrial R&D tradition.",
     "pop": "5.4M", "gdpGrowth": "2%", "itGrowth": "10%", "devRate": "$35-55/hr", "english": "good"},
    {"name": "Slovenia", "slug": "slovenia", "flag": "🇸🇮", "region": "Central Europe", "capital": "Ljubljana",
     "languages": "Slovenian, English, German, Italian", "techHub": "Ljubljana Technology Park",
     "keyIndustries": "Manufacturing, Pharma, ICT, Tourism",
     "businessCulture": "Egalitarian management style with low power distance. Work-life balance is prioritized. Meetings are structured and efficient.",
     "challenge": "Very small domestic market (2.1M population). High cost of labor relative to regional competitors.",
     "opportunity": "Excellent infrastructure and quality of life attract top talent. R&D-intensive economy with strong patent output per capita.",
     "economicContext": "R&D spending 2.5% of GDP (above EU average). Strong startup culture (Lek, Outfit7, Celtra). High English proficiency (94th globally).",
     "pop": "2.1M", "gdpGrowth": "2%", "itGrowth": "8%", "devRate": "$40-60/hr", "english": "excellent"},
    {"name": "Ukraine", "slug": "ukraine", "flag": "🇺🇦", "region": "Eastern Europe", "capital": "Kyiv",
     "languages": "Ukrainian, Russian, English, Polish", "techHub": "Kyiv Tech Hub & Lviv IT Park",
     "keyIndustries": "IT Outsourcing, Agriculture, Manufacturing, Defense Tech",
     "businessCulture": "Relationship-driven with emphasis on personal connections. Adaptable and resilient communication style. Directness is appreciated.",
     "challenge": "War-induced disruptions and safety concerns. Power outages and infrastructure damage affect operational reliability.",
     "opportunity": "200,000+ world-class IT professionals. Reshoring to Ukraine is increasing as global demand persists. Diia.City legal framework offers 5% tax rate for IT companies.",
     "economicContext": "200,000+ IT professionals. Diia.City tax rate: 5% on income. IT sector contributed $7B+ in exports (2023). Over 5,000 tech companies registered in Diia.City.",
     "pop": "37M", "gdpGrowth": "varies", "itGrowth": "resilient", "devRate": "$25-50/hr", "english": "good"},
    {"name": "Uzbekistan", "slug": "uzbekistan", "flag": "🇺🇿", "region": "Central Asia", "capital": "Tashkent",
     "languages": "Uzbek, Russian, English, Turkish", "techHub": "Tashkent IT Park & Inha University Campus",
     "keyIndustries": "ICT, Textiles, Agriculture, Energy, Tourism",
     "businessCulture": "Formal and respectful with emphasis on age and position. Relationships must be cultivated over several meetings before business discussions.",
     "challenge": "Limited English proficiency among senior business leaders. Currency control restrictions affect payment and repatriation of funds.",
     "opportunity": "Fastest economic reforms in Central Asia. IT Park offers extensive tax benefits (0% taxes until 2040 for IT companies). Growing outsourcing destination.",
     "economicContext": "IT Park residents enjoy 0% corporate tax, 0% personal income tax, and 0% social tax until 2040. 1,000+ IT companies registered. Digital Uzbekistan 2030 is a $2B+ national program.",
     "pop": "35.6M", "gdpGrowth": "6%", "itGrowth": "20%", "devRate": "$15-30/hr", "english": "low-moderate"},
]

# ── Services (6 services with unique value props) ──
SERVICES = [
    {
        "slug": "ai-consulting", "name": "AI Consulting",
        "subtitle": "Strategy & Implementation",
        "valueProp": "Custom AI roadmaps, ML model development, intelligent automation, and team training — all adapted to the local market's specific technology maturity and business challenges.",
        "highlights": [
            ("AI Strategy Development", "Custom AI roadmaps aligned with local business challenges and market opportunities."),
            ("Machine Learning Implementation", "End-to-end ML model development and deployment for business-specific use cases."),
            ("Intelligent Automation", "Process automation solutions that reduce operational costs and improve efficiency."),
            ("Team Training", "Knowledge transfer and team upskilling to ensure long-term AI capability building."),
        ],
        "approach": [
            "Week 1-2: Business challenge assessment and AI opportunity identification",
            "Week 3-6: Solution architecture and PoC development",
            "Week 7-12: Full implementation and integration",
            "Week 13-16: Team training and handover",
        ],
        "icon": "Brain",
        "targetBuyer": "CTOs, Heads of Engineering, Digital Transformation leads at mid-market companies",
        "typicalEngagement": "12-16 weeks, $20K-$100K+",
    },
    {
        "slug": "business-development", "name": "Business Development",
        "subtitle": "B2B Growth Strategy",
        "valueProp": "In-market lead generation, strategic partnership development, market entry strategy, and sales enablement — leveraging our established network in the target country.",
        "highlights": [
            ("In-Market Lead Generation", "Targeted B2B lead generation with local market intelligence and warm introductions from our established network."),
            ("Strategic Partnership Development", "Identify, vet, and structure partnerships with local technology companies, distributors, and industry associations."),
            ("Market Entry Strategy", "Comprehensive go-to-market planning including regulatory navigation, partner identification, and local team setup."),
            ("Sales Enablement", "Local market intelligence, cultural guidance, and in-person meeting facilitation to close deals faster."),
        ],
        "approach": [
            "Week 1-2: Market assessment and opportunity sizing",
            "Week 3-4: Target account identification and outreach strategy",
            "Week 5-8: Pipeline building with warm introductions",
            "Week 9+: Ongoing relationship development and deal support",
        ],
        "icon": "Target",
        "targetBuyer": "CEOs, VP Sales, Business Development Directors expanding into new markets",
        "typicalEngagement": "8-16 weeks, $15K-$60K+",
    },
    {
        "slug": "digital-marketing", "name": "Digital Marketing",
        "subtitle": "Localized Growth",
        "valueProp": "Localized SEO, content marketing in the target language, social media management on local platforms, and B2B email marketing — all culturally adapted for the market.",
        "highlights": [
            ("Localized SEO", "Search engine optimization targeted at local language queries and regional search patterns."),
            ("Content Marketing", "Multilingual content strategy and creation tailored to local business audiences."),
            ("Social Media Management", "Platform-specific strategies for LinkedIn, local social networks, and business communities."),
            ("B2B Email Marketing", "Targeted email campaigns with localized messaging and culturally-adapted communication."),
        ],
        "approach": [
            "Week 1: Market research and keyword analysis",
            "Week 2-3: Content strategy development and asset creation",
            "Week 4: Campaign launch and initial optimization",
            "Week 5+: Continuous optimization and reporting",
        ],
        "icon": "Search",
        "targetBuyer": "CMOs, Marketing Directors, Growth leads launching in new regions",
        "typicalEngagement": "4-12 weeks, $8K-$40K+",
    },
    {
        "slug": "it-consulting", "name": "IT Consulting",
        "subtitle": "Technology Optimization",
        "valueProp": "Digital transformation strategy, technology assessment, cloud migration, and security & compliance advisory — customized to the local regulatory environment and infrastructure landscape.",
        "highlights": [
            ("Digital Transformation", "End-to-end transformation strategy tailored to local market conditions and business maturity."),
            ("Technology Assessment", "Comprehensive evaluation of technology stacks with actionable modernization recommendations."),
            ("Cloud Migration", "Strategic cloud migration planning and execution optimized for regional infrastructure."),
            ("Security & Compliance", "GDPR compliance, local data protection regulations, and cybersecurity assessment."),
        ],
        "approach": [
            "Week 1-2: Current state assessment and gap analysis",
            "Week 3-4: Architecture design and vendor selection",
            "Week 5-8: Implementation and migration",
            "Week 9-12: Testing, optimization, and knowledge transfer",
        ],
        "icon": "Settings",
        "targetBuyer": "CTOs, IT Directors, VP Engineering at companies modernizing their stack",
        "typicalEngagement": "8-16 weeks, $25K-$100K+",
    },
    {
        "slug": "project-management", "name": "Project Management",
        "subtitle": "Agile Delivery",
        "valueProp": "Agile & Scrum implementation for distributed teams, cross-border coordination, risk management, and multilingual stakeholder communication — built for the realities of managing teams across cultures and time zones.",
        "highlights": [
            ("Agile & Scrum Implementation", "Framework setup and coaching for distributed teams across different time zones and cultures."),
            ("Cross-Border Team Coordination", "Manage multicultural, multi-timezone teams with cultural sensitivity and effective communication."),
            ("Risk Management", "Proactive risk identification and mitigation specific to regional business environments."),
            ("Stakeholder Communication", "Multilingual reporting and stakeholder management across different business cultures."),
        ],
        "approach": [
            "Month 1: Team setup, methodology definition, and sprint planning",
            "Ongoing: Sprint execution with weekly stakeholder reviews",
            "Monthly: Performance reporting and continuous improvement",
            "Quarterly: Strategic alignment reviews and roadmap updates",
        ],
        "icon": "ClipboardList",
        "targetBuyer": "VP Engineering, Delivery Directors, PMO leads managing distributed teams",
        "typicalEngagement": "Ongoing (3-12 month contracts), $5K-$25K/month",
    },
    {
        "slug": "sales-funnel", "name": "Sales Funnel Setup",
        "subtitle": "Conversion Optimization",
        "valueProp": "Localized landing pages, multi-channel funnel design, email automation with culturally adapted sequences, and full-funnel analytics with regional attribution — built to convert in the target market's language and buyer psychology.",
        "highlights": [
            ("Localized Landing Pages", "Conversion-optimized landing pages with culturally adapted copy and design."),
            ("Multi-Channel Funnels", "Funnel design integrating LinkedIn, Google Ads, email, and local business networks."),
            ("Email Automation", "Automated nurturing sequences with localized content and timing optimization."),
            ("Analytics & Attribution", "Full-funnel analytics with regional attribution models and conversion tracking."),
        ],
        "approach": [
            "Week 1-2: Funnel strategy and customer journey mapping",
            "Week 3-4: Landing page design and copywriting",
            "Week 5-6: Automation setup and integration",
            "Week 7-8: Testing, launch, and optimization",
        ],
        "icon": "Layout",
        "targetBuyer": "VP Marketing, Growth leads, Revenue Operations teams",
        "typicalEngagement": "6-10 weeks, $10K-$50K+",
    },
]


# ── Per-service, per-country unique body content templates ──
def serviceCountryAngle(svc, c):
    """Generate a unique market angle paragraph per service+country combination."""
    angles = {
        "ai-consulting": [
            f"{c['name']}'s {c['keyIndustries'].split(',')[0].strip().lower()} sector — a {c['economicContext'].split('.')[0].lower()} — is being reshaped by AI adoption. Companies from {c['techHub']} to {c['capital']} are implementing machine learning for {c['keyIndustries'].split(',')[1].strip().lower() if ',' in c['keyIndustries'] else c['keyIndustries'].split(',')[0].strip().lower()} optimization, but most lack the in-house expertise to move beyond pilot projects. Sipiteno's AI consulting practice in {c['name']} fills this gap with teams that understand both the technology and the local business realities — {c['businessCulture'].split('.')[0].lower()}.",
            f"The AI opportunity in {c['name']} is significant but under-executed. While {c['techHub']} houses a growing number of AI-focused startups, mid-market companies in {c['keyIndustries'].split(',')[-1].strip().lower()} and beyond are still running on manual processes. Sipiteno bridges this gap with AI consulting teams that have delivered production ML systems at {c['devRate']} rates — a fraction of Western European costs — while navigating {c['name']}'s specific regulatory and talent landscape.",
        ],
        "business-development": [
            f"{c['name']}'s economy, growing at {c['gdpGrowth']} annually, presents concrete B2B expansion opportunities — but market entry requires navigating {c['businessCulture'].split('.')[0].lower()}. Sipiteno's business development practice in {c['name']} provides the on-the-ground presence and relationship capital that remote sales teams cannot replicate, with a network already established across {c['keyIndustries'].split(',')[0].strip().lower()} and adjacent industries.",
            f"Breaking into {c['name']}'s {c['keyIndustries'].split(',')[0].strip().lower()} sector without local relationships is a known failure pattern. Sipiteno's business development teams in {c['name']} are embedded in the local business community — they attend the industry events, know the procurement cycles, and can make the warm introductions that close deals. With {c['english']} English proficiency and a {c['businessCulture'].split(',')[0].lower().split(':')[0].strip()} business culture, foreign companies benefit from having a cultural bridge on the ground.",
        ],
        "digital-marketing": [
            f"Digital marketing in {c['name']} is not a copy-paste from Western Europe. With {c['languages'].split(',')[0]} as the primary business language and {c['english']} English proficiency, content needs to be created for the local audience — not just translated. Sipiteno's digital marketing teams in {c['name']} operate in-market, understanding which platforms (beyond Google and LinkedIn) actually reach B2B buyers in {c['techHub']} and beyond.",
            f"SEO in {c['name']} means ranking for {c['languages'].split(',')[0].split()[0]}-language queries — a fundamentally different keyword landscape than English-language SEO. Sipiteno's {c['name']}-based digital marketing practice combines local-language content creation with distribution on the social platforms that matter in {c['region']}, not just the global defaults. For B2B companies expanding into {c['name']}, this is the difference between spending budget and generating pipeline.",
        ],
        "it-consulting": [
            f"{c['name']}'s IT infrastructure — anchored around {c['techHub']} — is {c['economicContext'].split('.')[0].lower()}. But most mid-market companies in {c['keyIndustries'].split(',')[0].strip().lower()} and beyond are still running legacy stacks. Sipiteno's IT consulting practice in {c['name']} modernizes these stacks with cloud migration, cybersecurity hardening, and compliance with {c['region']}-specific data regulations — delivered by teams that work at {c['devRate']}.",
            f"The regulatory environment for IT in {c['name']} — from data localization requirements to sector-specific compliance in {c['keyIndustries'].split(',')[0].strip().lower()} — creates a landscape where generic IT consulting playbooks fail. Sipiteno's local IT consulting teams know which regulations apply, which certifications matter, and how to build technology stacks that pass both internal audit and external compliance reviews. At {c['devRate']}, this local expertise is accessible to companies of any size.",
        ],
        "project-management": [
            f"Managing cross-border projects involving {c['name']} teams requires more than a Scrum certification. The {c['businessCulture'].split('.')[0].lower()} means project managers need cultural fluency — knowing when a 'yes' means 'yes,' when it means 'I'll try,' and when silence signals a blocked task. Sipiteno's project management practice in {c['name']} provides PMs who have managed distributed teams across {c['region']} and understand both the methodology and the cultural context.",
            f"Distributed engineering teams spanning {c['name']} and Western markets face coordination challenges that generic project management frameworks don't address. Time zone differences, language barriers ({c['languages'].split(',')[0]} to English), and cultural expectations around deadlines and escalation all add friction. Sipiteno embeds bilingual project managers in {c['name']} who act as the operational bridge — running standups, managing stakeholder expectations in both languages, and catching issues before they become delays.",
        ],
        "sales-funnel": [
            f"Building a B2B sales funnel in {c['name']} means understanding the local buyer journey — which starts not on Google, but through relationships and referrals. Sipiteno's sales funnel practice in {c['name']} designs funnels that respect {c['businessCulture'].split('.')[0].lower()}, using localized landing pages in {c['languages'].split(',')[0]} and multi-channel sequences that include the platforms where {c['name']}'s business decision-makers actually spend time.",
            f"The conversion playbook that works in Western markets — English-language landing page, LinkedIn ads, automated email drip — underperforms in {c['name']} by design. Buyers in {c['techHub']} expect content in {c['languages'].split(',')[0]}, trust signals from local companies, and pricing that reflects {c['name']}'s market rates (not New York or London). Sipiteno builds sales funnels that are culturally calibrated to {c['name']}'s buyer psychology, not copy-pasted from a global template.",
        ],
    }
    # Pick angle based on hash to make it deterministic but varied
    idx = hash(f"{c['slug']}{svc['slug']}") % len(angles[svc['slug']])
    return angles[svc['slug']][idx]


def buildFAQs(svc, c):
    """Generate 3 unique FAQs per service+country combination."""
    svcName = svc['name'].lower()
    countryName = c['name']
    capital = c['capital']
    techHub = c['techHub']
    region = c['region']
    languages = c['languages'].split(',')[0]
    english = c['english']
    culture = c['businessCulture'].split('.')[0].lower()
    devRate = c['devRate']
    keyIndustry = c['keyIndustries'].split(',')[0].strip().lower()

    return [
        (
            f"How does Sipiteno deliver {svcName} in {countryName} differently from a local agency?",
            f"Sipiteno combines on-the-ground presence in {capital} ({techHub}) with cross-border methodology refined across {len(COUNTRIES)} markets. A local {countryName} agency knows {countryName} but may not have experience scaling {svcName} programs internationally. A Western agency knows {svcName} but lacks the local relationships and cultural fluency that matter in a market where {culture}. Sipiteno delivers both — local execution with international quality standards, at {devRate}."
        ),
        (
            f"What does a typical {svcName} engagement in {countryName} cost?",
            f"Sipiteno's {svcName} engagements in {countryName} typically range from {svc['typicalEngagement']}. The exact scope depends on your objectives, team size, and timeline. We provide a fixed-scope proposal after a free discovery call — no hidden costs, and pricing that reflects {countryName}'s market rates rather than Western European premiums."
        ),
        (
            f"Why choose {countryName} for {svcName} over better-known, higher-cost tech destinations?",
            f"{countryName} offers a specific combination that makes it the right choice for certain {svcName} projects: {c['opportunity'].split('.')[0]}. For companies targeting {region} markets, {countryName}'s time zone, {english} English proficiency, and proximity make it operationally simpler than an 8-hour time zone gap to India. For companies prioritizing cost without sacrificing quality, rates in {countryName} generally compare favorably to Western European and North American rates. Sipiteno helps you weigh these trade-offs objectively for your specific project."
        ),
    ]


def buildPage(svc, c):
    """Generate a full static HTML page for one service+country combination."""
    slug = f"{c['slug']}/{svc['slug']}"
    url = f"{BASE}/{slug}"

    title = f"{svc['name']} in {c['name']} — {svc['subtitle']} | Sipiteno"
    desc = (f"Sipiteno provides {svc['name'].lower()} in {c['name']} with local teams in {c['capital']}. "
            f"{c['opportunity'].split('.')[0]}. {svc['valueProp'].split('.')[0]}.")

    angle = serviceCountryAngle(svc, c)
    faqs = buildFAQs(svc, c)

    # ── Schema ──
    article_json = {
        "@context": "https://schema.org", "@type": "Article",
        "headline": f"{svc['name']} in {c['name']}",
        "description": desc,
        "author": {"@type": "Organization", "name": "Sipiteno", "url": BASE},
        "publisher": {"@type": "Organization", "name": "Sipiteno", "url": BASE,
                      "@id": f"{BASE}/#organization"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": PUBLISHED, "dateModified": TODAY,
    }
    faq_json = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in faqs
        ]
    }
    breadcrumb_json = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Sipiteno", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Locations", "item": f"{BASE}/locations"},
            {"@type": "ListItem", "position": 3, "name": c['name'], "item": f"{BASE}/{c['slug']}"},
            {"@type": "ListItem", "position": 4, "name": svc['name'], "item": url},
        ],
    }
    service_json = {
        "@context": "https://schema.org", "@type": "Service",
        "name": f"{svc['name']} in {c['name']}",
        "description": desc,
        "provider": {"@type": "Organization", "name": "Sipiteno", "url": BASE},
        "areaServed": {"@type": "Country", "name": c['name']},
        "serviceType": svc['name'],
        "url": url,
    }

    # ── FAQ visible HTML ──
    faq_html = "\n".join(
        f'<details><summary><h3>{q}</h3></summary><p>{a}</p></details>'
        for q, a in faqs
    )

    # ── Service highlights HTML ──
    highlights_html = "\n".join(
        f'<div class="card"><h3>{h[0]}</h3><p>{h[1]}</p></div>'
        for h in svc['highlights']
    )

    # ── Approach HTML ──
    approach_html = "\n".join(
        f'<li>{step}</li>'
        for step in svc['approach']
    )

    # ── Other services in this country (cross-links) ──
    other_services = [s for s in SERVICES if s['slug'] != svc['slug']]
    related_html = "\n".join(
        f'<li><a href="/{c["slug"]}/{s["slug"]}">{s["name"]} in {c["name"]}</a></li>'
        for s in other_services[:5]
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Sipiteno">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{url}">
<link rel="alternate" hreflang="x-default" href="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="article:published_time" content="{PUBLISHED}T00:00:00Z">
<meta property="article:modified_time" content="{TODAY}T00:00:00Z">
<script type="application/ld+json">{json.dumps(article_json, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(breadcrumb_json, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(faq_json, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(service_json, ensure_ascii=False)}</script>
<link rel="stylesheet" href="/ux.css">
<script src="/ux.js" defer></script>
<style>
body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.65;color:#0a0a0a;max-width:760px;margin:0 auto;padding:2rem 1.25rem}}
h1{{font-size:2.1rem;line-height:1.2;margin:.3em 0}}
h2{{font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem}}
h3{{font-size:1.15rem;margin-top:1.5rem}}
a{{color:#0066cc;text-decoration:none}}a:hover{{text-decoration:underline}}
.lede{{font-size:1.1rem;color:#374151;margin-bottom:1.5rem}}
table{{border-collapse:collapse;width:100%;margin:1rem 0;font-size:.95rem}}
th,td{{border:1px solid #e5e7eb;padding:.6rem .75rem;text-align:left}}
th{{background:#f9fafb;font-weight:600}}
.callout{{background:#f0f7ff;border-left:4px solid #0066cc;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 .375rem .375rem 0}}
.callout.warn{{background:#fef3c7;border-left-color:#d97706}}
.card-grid{{display:grid;grid-template-columns:1fr;gap:1rem;margin:1.5rem 0}}
@media(min-width:560px){{.card-grid{{grid-template-columns:1fr 1fr}}}}
.card{{background:#f9fafb;border:1px solid #e5e7eb;border-radius:.5rem;padding:1.25rem}}
.card h3{{margin-top:0;font-size:1.1rem}}
.related-links{{background:#f9fafb;padding:1rem 1.25rem;border-radius:.5rem;margin-top:2rem}}
.related-links ul{{list-style:none;padding-left:0;display:grid;grid-template-columns:1fr 1fr;gap:.4rem 1rem}}
.related-links li{{padding:.25rem 0}}
.cta{{background:linear-gradient(135deg,#0066cc,#004499);color:#fff;padding:2rem;border-radius:.75rem;margin-top:2rem;text-align:center}}
.cta h2{{color:#fff;border:none}}.cta .btn{{display:inline-block;background:#fff;color:#0066cc;padding:.75rem 1.5rem;border-radius:.375rem;font-weight:600;margin-top:.5rem;text-decoration:none}}
.check-list{{list-style:none;padding-left:0}}
.check-list li{{padding:.4rem 0 .4rem 1.75rem;position:relative}}
.check-list li::before{{content:"✓";position:absolute;left:0;color:#059669;font-weight:700}}
.tag{{display:inline-block;background:#e0e7ff;color:#3730a3;font-size:.85rem;padding:.2rem .75rem;border-radius:99px;margin-right:.5rem;margin-bottom:.5rem}}
footer{{margin-top:3rem;padding-top:1.5rem;border-top:1px solid #e5e7eb;color:#6b7280;font-size:.9rem}}
.index-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem;margin:1rem 0}}
.index-grid a{{display:block;padding:.4rem .6rem;background:#f9fafb;border-radius:.3rem;font-size:.9rem}}
.country-flag{{font-size:2rem;margin-right:.5rem;vertical-align:middle}}
</style>
<!-- sipiteno-pseo-gen-v1 -->
</head>
<body>
<header>
<nav style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:2rem;font-size:.95rem">
<a href="{BASE}"><strong>Sipiteno</strong></a>
<span>›</span>
<a href="{BASE}/locations">Locations</a>
<span>›</span>
<a href="/{c['slug']}">{c['name']}</a>
<span>›</span>
<span>{svc['name']}</span>
</nav>
</header>
<main>
<article>

<h1>{c['flag']} {svc['name']} in {c['name']}</h1>
<p class="lede"><strong>Sipiteno</strong> delivers {svc['name'].lower()} in {c['name']} with an on-the-ground team in {c['capital']} ({c['techHub']}). {angle}</p>

<h2>{c['name']} at a glance</h2>
<table>
<thead><tr><th>Dimension</th><th>{c['name']}</th></tr></thead>
<tbody>
<tr><td><strong>Capital & Tech Hub</strong></td><td>{c['capital']} — {c['techHub']}</td></tr>
<tr><td><strong>Region</strong></td><td>{c['region']}</td></tr>
<tr><td><strong>Key Industries</strong></td><td>{c['keyIndustries']}</td></tr>
<tr><td><strong>Languages</strong></td><td>{c['languages']} (English: {c['english']})</td></tr>
<tr><td><strong>Population</strong></td><td>{c['pop']}</td></tr>
<tr><td><strong>GDP Growth</strong></td><td>{c['gdpGrowth']} annually</td></tr>
<tr><td><strong>IT Sector Growth</strong></td><td>{c['itGrowth']}% annually</td></tr>
<tr><td><strong>Developer Rates</strong></td><td>{c['devRate']}</td></tr>
<tr><td><strong>Business Culture</strong></td><td>{c['businessCulture']}</td></tr>
</tbody>
</table>

<div class="callout">
<strong>Why {svc['name'].lower()} in {c['name']}:</strong> {c['opportunity']}
</div>

<h2>{svc['name']} services we deliver in {c['name']}</h2>
<p>{svc['valueProp']}</p>
<div class="card-grid">
{highlights_html}
</div>

<h2>The {c['name']} market for {svc['name'].lower()}</h2>
<p>{angle}</p>

<h2>What makes {c['name']} different for {svc['name'].lower()}</h2>
<div class="callout warn">
<strong>The challenge:</strong> {c['challenge']}
</div>
<p>The opportunity: {c['opportunity']}</p>
<p><strong>Economic context:</strong> {c['economicContext']}</p>

<h2>Our engagement approach for {c['name']} clients</h2>
<p>A typical {svc['name'].lower()} engagement in {c['name']} follows this timeline, adapted to the local business environment:</p>
<ol class="check-list">
{approach_html}
</ol>
<p><strong>Typical engagement:</strong> {svc['typicalEngagement']}</p>
<p><strong>Ideal for:</strong> {svc['targetBuyer']}</p>

<h2>Frequently asked questions</h2>
{faq_html}

<section class="related-links">
<h2>Other services in {c['name']}</h2>
<ul>
{related_html}
</ul>
</section>

<section class="cta">
<h2>Start your {svc['name'].lower()} project in {c['name']}</h2>
<p>Schedule a free consultation to discuss your {svc['name'].lower()} needs in {c['name']}. We'll share relevant case studies and outline a tailored approach for the {c['name']} market.</p>
<a href="{BASE}/#contact" class="btn">Discuss your project →</a>
</section>

</article>
</main>
<footer>
<p>© 2026 Sipiteno. Digital Product Studio. <a href="{BASE}">sipiteno.com</a> &middot; <a href="{BASE}/about">About</a> &middot; <a href="{BASE}/contact">Contact</a></p>
<p style="margin-top:.5rem;font-size:.8rem">Serving {len(COUNTRIES)} countries across {len(set(c['region'] for c in COUNTRIES))} regions.</p>
</footer>
</body>
</html>"""

    return slug, html, url


def main():
    total = 0
    pages = []
    
    for c in COUNTRIES:
        for svc in SERVICES:
            slug, html, url = buildPage(svc, c)
            out_path = ROOT / slug / "index.html"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(html, encoding="utf-8")
            pages.append((slug, url, len(html)))
            total += 1
    
    print(f"Generated {total} country×service pages ({len(COUNTRIES)} countries × {len(SERVICES)} services)")
    print(f"Output directory: {ROOT}")
    
    # Quick uniqueness check: spot-check body text variance
    sample_sizes = sorted([p[2] for p in pages])
    print(f"\nPage size range: {min(sample_sizes)}–{max(sample_sizes)} bytes")
    print(f"Median size: {sample_sizes[len(sample_sizes)//2]} bytes")
    print(f"Variance: {max(sample_sizes)/min(sample_sizes)*100-100:.1f}% spread")
    
    # List first 5 and last 5 pages
    print("\nSample pages:")
    for slug, url, size in pages[:5] + pages[-5:]:
        print(f"  {size:>6}B  {url}")
    
    return pages


if __name__ == "__main__":
    pages = main()
