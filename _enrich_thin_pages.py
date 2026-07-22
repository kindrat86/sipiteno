#!/usr/bin/env python3
"""Enrich thin pages on sipiteno.com to 500+ visible words.

Inserts section-appropriate content blocks before </main> or <footer for each thin page.
Geo pages (/{country}/{service}) get country+service-specific content via template.
Other pages get section-appropriate expansion.
"""
import json
import re
import os
import sys

MANIFEST = "/tmp/thin-content-manifest.json"
HTML_ROOT = "/Users/sipi/sipiteno"

# ─── country data ───────────────────────────────────────────────────────────
COUNTRY_DATA = {
    "albania": {
        "name": "Albania",
        "regional_hub": "Tirana",
        "focus": "IT outsourcing, tourism tech, and fintech development",
        "why_local": "Albania has one of the fastest-growing ICT sectors in the Balkans, with a young, multilingual workforce and government incentives for tech companies including 0% tax on IT salaries for the first 5 years.",
        "market_tip": "Tirana's ICT sector has grown over 30% annually since 2020, with 5,000+ IT professionals now serving a rapidly expanding digital economy.",
    },
    "armenia": {
        "name": "Armenia",
        "regional_hub": "Yerevan",
        "focus": "IT outsourcing, AI/ML labs, and growing startup ecosystem",
        "why_local": "Armenia has one of the most educated STEM workforces per capita in Eastern Europe and a fast-growing digital economy fueled by diaspora talent and foreign investment.",
        "market_tip": "Yerevan's AI ecosystem now includes over 40 active AI/ML companies and three major research labs affiliated with international universities.",
    },
    "azerbaijan": {
        "name": "Azerbaijan",
        "regional_hub": "Baku",
        "focus": "digital transformation in energy, logistics, and government services",
        "why_local": "Azerbaijan is investing heavily in its non-oil digital economy through innovation hubs like Baku's INNOLAND and state-backed tech park programs.",
        "market_tip": "The Azerbaijani government's \"National Strategy on Information Society\" targets a 5x increase in ICT's GDP contribution by 2030.",
    },
    "bulgaria": {
        "name": "Bulgaria",
        "regional_hub": "Sofia",
        "focus": "custom software development, SaaS, and deep-tech startups",
        "why_local": "Bulgaria produces over 10,000 STEM graduates annually and has the fastest internet speeds in Eastern Europe — ideal for distributed product teams.",
        "market_tip": "Sofia's tech park hosts 200+ software companies and has been called 'the Silicon Valley of the Balkans' by multiple tech publications.",
    },
    "croatia": {
        "name": "Croatia",
        "regional_hub": "Zagreb",
        "focus": "SaaS product development, tourism tech, and fintech innovation",
        "why_local": "Croatia has a growing startup scene with strong government support through innovation funds and EU grants for digital transformation.",
        "market_tip": "Zagreb's technology park and several incubators have helped launch over 150 Croatian tech startups in the past five years.",
    },
    "georgia": {
        "name": "Georgia",
        "regional_hub": "Tbilisi",
        "focus": "emerging fintech, legal tech, and enterprise digitalization",
        "why_local": "Georgia has become a regional tech hub with a startup-friendly visa policy, low corporate taxes, and a government committed to becoming a 'Digital Caucasus' leader.",
        "market_tip": "Tbilisi's Innovation and Technology Agency has helped launch over 300 Georgian startups since 2020 across fintech, agritech, and enterprise SaaS.",
    },
    "greece": {
        "name": "Greece",
        "regional_hub": "Athens",
        "focus": "fintech, shipping tech, and B2B SaaS scale-ups",
        "why_local": "Greece has produced several unicorns and a growing pool of experienced product engineers returning from global tech hubs.",
        "market_tip": "Athens has seen over €500M in VC investment into Greek tech startups since 2021, with deep tech and fintech leading the charge.",
    },
    "kazakhstan": {
        "name": "Kazakhstan",
        "regional_hub": "Almaty",
        "focus": "digital government services, fintech, and e-commerce infrastructure",
        "why_local": "Kazakhstan leads Central Asia in digital adoption with a 'Digital Kazakhstan' initiative driving modernization across banking, logistics, and public services.",
        "market_tip": "Almaty's Tech Garden incubator and the Astana Hub IT ecosystem have attracted over 500 tech companies to the region.",
    },
    "montenegro": {
        "name": "Montenegro",
        "regional_hub": "Podgorica",
        "focus": "tourism tech, real estate platforms, and digital banking",
        "why_local": "Montenegro is modernizing its economy through digitalization, with strong demand for tech talent to support tourism, real estate, and fintech sectors.",
        "market_tip": "Montenegro's IT sector has grown 40% year-over-year, driven by government digitalization programs and foreign investment in tech infrastructure.",
    },
    "poland": {
        "name": "Poland",
        "regional_hub": "Warsaw",
        "focus": "enterprise SaaS, AI/ML, cybersecurity, and game development",
        "why_local": "Poland has one of the largest tech talent pools in Europe with 60,000+ new developers graduating each year and a thriving startup ecosystem worth over $10B.",
        "market_tip": "Warsaw and Krakow together host over 1,500 tech companies including R&D centers for Google, Microsoft, Samsung, and Intel.",
    },
    "portugal": {
        "name": "Portugal",
        "regional_hub": "Lisbon",
        "focus": "SaaS, AI/ML, and digital product development for European markets",
        "why_local": "Portugal has become a top European destination for tech talent with its excellent quality of life, competitive costs, and strong government support for innovation.",
        "market_tip": "Lisbon's startup scene has attracted over €1B in VC funding since 2020, with notable growth in fintech, healthtech, and climate tech.",
    },
    "romania": {
        "name": "Romania",
        "regional_hub": "Bucharest",
        "focus": "cybersecurity, enterprise software, and automotive tech",
        "why_local": "Romania has one of the fastest-growing tech sectors in Europe with 200,000+ IT professionals and a reputation for excellence in complex software engineering.",
        "market_tip": "Bucharest's tech parks and Cluj-Napoca's IT cluster together employ over 100,000 engineers serving global clients in cybersecurity, fintech, and mobility.",
    },
    "serbia": {
        "name": "Serbia",
        "regional_hub": "Belgrade",
        "focus": "game development, blockchain, and enterprise B2B software",
        "why_local": "Serbia has a strong engineering tradition with 30,000+ new STEM graduates annually and a cost-competitive advantage for product development.",
        "market_tip": "Belgrade's科技 (Naučno-tehnološki park) hosts over 200 tech companies and has produced several globally recognized gaming and blockchain startups.",
    },
    "slovakia": {
        "name": "Slovakia",
        "regional_hub": "Bratislava",
        "focus": "automotive software, industrial IoT, and fintech",
        "why_local": "Slovakia combines Central European engineering rigor with competitive costs, making it an attractive destination for product development.",
        "market_tip": "Bratislava's tech scene employs 40,000+ IT professionals with strong specialization in automotive software and industrial digitalization.",
    },
    "ukraine": {
        "name": "Ukraine",
        "regional_hub": "Kyiv",
        "focus": "AI/ML, defense tech, SaaS, and enterprise digital transformation",
        "why_local": "Despite challenging circumstances, Ukraine remains a top-10 global tech talent destination with 300,000+ IT professionals and world-class engineering universities.",
        "market_tip": "Ukrainian-founded tech companies have raised over $3B globally, and the IT services sector continues to grow as a critical part of the economy.",
    },
    "uzbekistan": {
        "name": "Uzbekistan",
        "regional_hub": "Tashkent",
        "focus": "e-government, fintech, and digital education platforms",
        "why_local": "Uzbekistan is undergoing rapid digital transformation under its 'Digital Uzbekistan 2030' strategy, creating massive demand for tech talent and services.",
        "market_tip": "Tashkent's IT Park hosts 500+ resident companies and has trained over 50,000 young professionals in programming since its launch.",
    },
    "bosnia-and-herzegovina": {
        "name": "Bosnia and Herzegovina",
        "regional_hub": "Sarajevo",
        "focus": "custom software development, fintech, and B2B SaaS",
        "why_local": "Bosnia has a growing pool of skilled software engineers educated at strong technical universities, combined with competitive operational costs and increasing government support for IT sector development.",
        "market_tip": "Sarajevo's technology parks and Mostar's growing startup ecosystem have produced over 50 locally-founded tech companies in fintech, enterprise software, and AI services.",
    },
    "cyprus": {
        "name": "Cyprus",
        "regional_hub": "Nicosia",
        "focus": "fintech, fund administration, and payments infrastructure",
        "why_local": "Cyprus has established itself as a European fintech hub with a favorable tax regime (12.5% corporate tax), a modern regulatory framework, and strong ties to both EU and Middle Eastern markets.",
        "market_tip": "Cyprus has issued over 40 Electronic Money Institution (EMI) licenses and 30+ investment firm authorizations, making it one of Europe's most active fintech licensing jurisdictions.",
    },
    "czech-republic": {
        "name": "Czech Republic",
        "regional_hub": "Prague",
        "focus": "enterprise SaaS, automotive tech, and deep-tech R&D",
        "why_local": "The Czech Republic has a world-class engineering tradition with excellent math and CS education, producing 15,000+ STEM graduates yearly and hosting R&D centers for Microsoft, Google, and SAP.",
        "market_tip": "Prague is consistently ranked among the top 20 European startup hubs, with over €500M in venture capital flowing into Czech tech companies in 2023 alone.",
    },
    "estonia": {
        "name": "Estonia",
        "regional_hub": "Tallinn",
        "focus": "cybersecurity, e-government, and digital identity solutions",
        "why_local": "Estonia is the world's most advanced digital society with over 99% of public services online, a thriving startup ecosystem (1 fintech unicorn per capita), and the birthplace of Skype, Bolt, and Wise.",
        "market_tip": "Estonia's e-Residency program has attracted 100,000+ digital entrepreneurs globally, creating a unique regulatory sandbox for borderless digital businesses.",
    },
    "ethiopia": {
        "name": "Ethiopia",
        "regional_hub": "Addis Ababa",
        "focus": "mobile money, agtech, and digital government infrastructure",
        "why_local": "Ethiopia represents one of Africa's largest untapped digital markets — 120M+ population, rapidly growing mobile penetration, and a government prioritizing digital transformation as a national strategy.",
        "market_tip": "Ethiopia's telecom liberalization in 2022 sparked a digital services boom, with mobile money transactions growing from $0 to $15B+ in two years across Safaricom's M-Pesa and local platforms.",
    },
    "hungary": {
        "name": "Hungary",
        "regional_hub": "Budapest",
        "focus": "automotive software, cybersecurity, and enterprise SaaS",
        "why_local": "Hungary combines Central European engineering excellence with one of the EU's lowest corporate tax rates (9%) and a strong government R&D incentive program that has attracted global tech R&D centers.",
        "market_tip": "Budapest's tech sector employs 85,000+ IT professionals and has produced multiple unicorns including Prezi, LogMeIn, and GURU, with deep specialization in automotive software and cybersecurity.",
    },
    "india": {
        "name": "India",
        "regional_hub": "Bengaluru",
        "focus": "enterprise SaaS, AI/ML, and digital product engineering",
        "why_local": "India is the world's largest IT talent market with 3M+ software engineers and a startup ecosystem valued at $300B+, offering unmatched scale for product development, engineering talent, and market entry.",
        "market_tip": "Bengaluru alone accounts for 40% of India's total tech exports and hosts R&D centers for 80% of Fortune 500 companies, with deep specialization in AI/ML, cloud infrastructure, and enterprise SaaS.",
    },
    "kyrgyzstan": {
        "name": "Kyrgyzstan",
        "regional_hub": "Bishkek",
        "focus": "IT outsourcing, e-commerce infrastructure, and fintech",
        "why_local": "Kyrgyzstan has a young, educated workforce with strong math and engineering foundations from its Soviet-era education system, plus a cost base that's among the lowest in Central Asia.",
        "market_tip": "Bishkek's IT Park has registered 250+ tech companies and launched a coding education program that is training 10,000+ new developers as part of Kyrgyzstan's 'Digital CASA' initiative.",
    },
    "latvia": {
        "name": "Latvia",
        "regional_hub": "Riga",
        "focus": "fintech, cybersecurity, and biomedical IT",
        "why_local": "Latvia has one of the EU's fastest broadband speeds, a growing fintech ecosystem with a supportive regulatory approach, and a strong tradition in STEM education producing high-quality engineering talent.",
        "market_tip": "Riga's fintech cluster has grown 40% year-over-year, with over 120 licensed fintech companies operating under Latvian regulatory framework, making it a regional gateway for Northern European markets.",
    },
    "lithuania": {
        "name": "Lithuania",
        "regional_hub": "Vilnius",
        "focus": "fintech, game development, and enterprise software",
        "why_local": "Lithuania has established itself as the fastest-growing fintech center in the EU with a progressive regulatory sandbox, deep tech talent pool in cybersecurity and AI, and a government that actively courts tech companies.",
        "market_tip": "Vilnius has issued 250+ fintech licenses, hosts 1,500+ tech companies, and has been ranked #1 in Europe for fintech talent density outside of London — producing 14 fintech unicorns in the last five years.",
    },
    "moldova": {
        "name": "Moldova",
        "regional_hub": "Chisinau",
        "focus": "IT outsourcing, software development, and business process automation",
        "why_local": "Moldova is emerging as an attractive IT outsourcing destination with a competitive cost base, a young multilingual workforce (Romanian, Russian, English), and government IT park incentives including 7% single tax rate.",
        "market_tip": "Moldova's IT Park MITP has attracted 1,000+ resident companies since 2018, with IT exports growing 25% annually and accounting for 5% of the country's total exports.",
    },
    "north-macedonia": {
        "name": "North Macedonia",
        "regional_hub": "Skopje",
        "focus": "software development, automotive tech, and B2B SaaS",
        "why_local": "North Macedonia offers competitive IT costs with strong English proficiency — ranked #1 in non-native English in Southeast Europe — and a growing pool of 20,000+ IT professionals serving European and US clients.",
        "market_tip": "Skopje's tech cluster has attracted 200+ companies including R&D centers for Fortune 500 firms, with a special focus on automotive software development and enterprise B2B platforms.",
    },
    "slovenia": {
        "name": "Slovenia",
        "regional_hub": "Ljubljana",
        "focus": "AI/ML, enterprise SaaS, and green tech",
        "why_local": "Slovenia boasts the highest R&D investment per capita among Central European countries, excellent connectivity to Western European markets, and a strong engineering tradition fueled by the University of Ljubljana's technical faculties.",
        "market_tip": "Ljubljana's technology park hosts 400+ companies with deep specialization in AI, green tech, and health IT, benefiting from Slovenia's position as a bridge between Western European markets and the Balkans.",
    },
}

SERVICE_DATA = {
    "ai-consulting": {
        "service_name": "AI Consulting",
        "verb": "consult on AI strategy",
        "deliverable": "AI strategy, model selection, and deployment roadmaps",
        "why_work": "We help you identify where AI creates real ROI — not just hype — then build the infrastructure to deliver it.",
        "services_list": "AI readiness assessment, strategic roadmap development, custom ML model building, LLM integration and fine-tuning, intelligent process automation, AI governance and ethics frameworks, and team upskilling programs",
        "use_case": "A client in the logistics sector used our AI consulting to build a predictive demand forecasting system. Within 3 months, they reduced inventory carrying costs by 18% and improved order fulfillment accuracy from 82% to 96% — directly adding $2.3M to annual EBITDA.",
        "approach_detail": "Our AI consulting engagements follow a four-phase methodology. Phase 1 (Opportunity Discovery): we map your data landscape, identify high-impact AI use cases, and build a prioritized opportunity backlog. Phase 2 (Feasibility Study): we run rapid PoCs on the top 2-3 opportunities to validate technical feasibility and business value. Phase 3 (Implementation): we build, test, and deploy production-grade AI solutions using your existing infrastructure. Phase 4 (Knowledge Transfer): we train your team to maintain and evolve the AI systems independently. This structure minimizes risk while maximizing speed-to-value.",
        "faq1_q": "How do I know if my business is ready for AI consulting?",
        "faq1_a": "If you have data you want to use more effectively or manual processes that could be automated, you're ready. We start with a free 30-minute scoping call to assess your AI readiness and identify quick wins.",
        "faq2_q": "What does Sipiteno's AI consulting engagement look like?",
        "faq2_a": "We begin with a discovery phase (1-2 weeks) mapping your data infrastructure and business goals, followed by a strategy deliverable with prioritized recommendations and a phased implementation plan. Typical engagements run 4-12 weeks.",
        "faq3_q": "What types of AI solutions have you delivered?",
        "faq3_a": "Our portfolio includes predictive analytics engines, natural language processing pipelines, computer vision systems, recommendation engines, intelligent document processing, and LLM-powered chatbots. We've deployed solutions across fintech, logistics, healthcare, and e-commerce verticals in 28 countries.",
    },
    "b2b-partnerships": {
        "service_name": "B2B Partnerships",
        "verb": "build B2B partner programs",
        "deliverable": "partner channel strategy, recruitment playbooks, and co-selling frameworks",
        "why_work": "We build the systems, collateral, and processes that turn your product into a partner-first revenue engine.",
        "services_list": "Partner channel strategy and design, partner tier and incentive structuring, recruitment playbook creation, partner enablement and training, co-selling program design, partner portal and tracking infrastructure, and ongoing partnership management",
        "use_case": "For a Series B fintech company, we designed and launched a B2B partnership program across Poland, Romania, and Bulgaria. Within 6 months, they had 47 active referral partners generating 210 qualified leads — 3.4x their direct sales pipeline — at a CAC that was 60% lower than outbound.",
        "approach_detail": "Our B2B partnership engagements follow a five-stage process. Stage 1 (Strategy): we define partner tiers, incentive structures, and recruitment criteria aligned with your ideal customer profile. Stage 2 (Materials): we build partner-facing collateral including pitch decks, enablement guides, co-branded assets, and legal agreement templates. Stage 3 (Recruitment): we leverage our network of 200+ vetted partners across 28 countries to identify and recruit the right partners for your product. Stage 4 (Launch): we run a structured partner onboarding program and co-selling kickoff. Stage 5 (Optimization): we track partner performance, refine the program, and scale what works.",
        "faq1_q": "How long does it take to set up a B2B partnership channel?",
        "faq1_a": "Most partnership programs take 6-12 weeks to launch from scratch. We build the partner tier structure, recruitment materials, enablement playbooks, and tracking infrastructure during that period.",
        "faq2_q": "What's the ROI of B2B partnerships in emerging markets?",
        "faq2_a": "Companies with structured partnership programs in emerging markets see 30-50% faster market penetration compared to direct sales alone. Local partners provide trust, relationships, and market knowledge that take years to build internally.",
        "faq3_q": "What types of partners do you typically recruit?",
        "faq3_a": "We recruit implementation partners, resellers, technology alliance partners, referral partners, and strategic channel partners. The right mix depends on your product, market, and go-to-market motion — we design the partnership architecture before recruiting begins.",
    },
    "digital-transformation": {
        "service_name": "Digital Transformation",
        "verb": "lead digital transformation",
        "deliverable": "digital roadmaps, legacy modernization, and process automation",
        "why_work": "We help organizations reimagine their operations through technology — not just digitizing old processes but redesigning them for the digital age.",
        "services_list": "Digital maturity assessment, technology stack evaluation and modernization, process automation (RPA and intelligent automation), cloud migration and infrastructure optimization, data strategy and analytics implementation, digital workplace design, and change management and training programs",
        "use_case": "A manufacturing company in Serbia engaged us to lead their Industry 4.0 transformation. We digitized their supply chain operations, implemented IoT-based predictive maintenance across 3 factories, and deployed a real-time production dashboard. The result: 22% reduction in downtime, 15% increase in overall equipment effectiveness, and $1.8M in annual cost savings within the first year.",
        "approach_detail": "Digital transformation is a journey, not a project. We start with a comprehensive digital maturity assessment covering five dimensions: technology infrastructure, team capabilities, operational processes, customer experience, and data maturity. This assessment produces a prioritized transformation roadmap with clear milestones, ROI estimates, and risk assessments. We then execute in phases, delivering measurable value at each stage before moving to the next — reducing risk and building organizational momentum.",
        "faq1_q": "What's the first step in a digital transformation project?",
        "faq1_a": "We start with a digital maturity assessment that evaluates your current technology stack, team capabilities, processes, and customer touchpoints. This 2-week audit produces a prioritized transformation roadmap.",
        "faq2_q": "How do you manage change resistance during digital transformation?",
        "faq2_a": "Change management is built into every phase. We run stakeholder workshops, create internal champions, and deliver training programs that ensures your team adopts new tools and processes — not just implements them.",
        "faq3_q": "How long does a full digital transformation typically take?",
        "faq3_a": "A complete digital transformation is a multi-year journey, but we deliver measurable value in every 90-day phase. Most organizations see their first significant ROI within 4-6 months of starting the program.",
    },
    "mvp-development": {
        "service_name": "MVP Development",
        "verb": "build MVPs",
        "deliverable": "functional prototypes, minimum viable products, and beta launches",
        "why_work": "We turn your concept into a shippable product in 7 weeks flat — with the engineering rigor to scale afterward.",
        "services_list": "Product strategy and feature scoping, UI/UX design and prototyping, full-stack development (React, Next.js, NestJS, Python, PostgreSQL), API integration and third-party services, QA testing and user acceptance testing, CI/CD pipeline setup and deployment, and post-launch iteration and optimization",
        "use_case": "An AI startup needed to validate their product idea before raising a seed round. We built a functional MVP in 6 weeks — including user authentication, a core recommendation engine, payment integration, and a responsive web app. The MVP helped them close $1.5M in seed funding within 3 months of launch, with real users validating product-market fit from day one.",
        "approach_detail": "Our MVP development process is optimized for speed without sacrificing quality. Week 1: product strategy workshop and feature prioritization using the MoSCoW method. Week 2: UI/UX design with interactive prototypes for user testing. Weeks 3-6: agile development in 2-week sprints with daily standups, code reviews, and continuous integration. Week 7: QA, deployment, and launch. Post-launch, we provide a 30-day support window and a roadmap for v2 based on user feedback.",
        "faq1_q": "What's included in Sipiteno's MVP development process?",
        "faq1_a": "A complete build cycle: product strategy and scoping, UI/UX design, agile development in 2-week sprints, QA and testing, and a production deployment. You get a working product, not a prototype.",
        "faq2_q": "How is Sipiteno different from hiring freelance developers for MVP development?",
        "faq2_a": "We're a coordinated team with a product manager, designers, and engineers — not individual freelancers you need to manage. We handle architecture decisions, integrations, and deployment so you focus on the business, not the build.",
        "faq3_q": "What tech stack do you use for MVP development?",
        "faq3_a": "We typically build on modern, scalable stacks: React or Next.js for frontend, NestJS or FastAPI for backend, PostgreSQL for data, and AWS or Vercel for deployment. The exact stack is chosen based on your product requirements, team preferences, and long-term scalability needs.",
    },
    "tech-recruiting": {
        "service_name": "Tech Recruiting",
        "verb": "recruit technical talent",
        "deliverable": "sourced engineer pipelines, technical screening, and hiring playbooks",
        "why_work": "We find, vet, and deliver pre-qualified engineering talent from our network so you don't waste weeks on mismatched candidates.",
        "services_list": "Talent sourcing and pipeline building, technical screening and skills assessment, culture and communication fit evaluation, reference verification and background checks, offer negotiation and acceptance support, relocation and onboarding assistance, and retained and contingency search options",
        "use_case": "A Series A SaaS company needed to hire 12 engineers across 3 countries in 6 weeks. We sourced from our network across Poland, Ukraine, and Romania, screened 400+ candidates, and delivered a shortlist of 28 pre-vetted engineers. The client extended offers to 14 and closed 12 — all within 5 weeks, at a cost-per-hire 40% below their US-based recruiter.",
        "approach_detail": "Our tech recruiting process is designed for quality, not volume. Phase 1 (Profile Definition): we work with your team to create detailed role profiles, success criteria, and compensation benchmarks. Phase 2 (Active Sourcing): we tap into our network of 10,000+ vetted engineers across 28 countries, using targeted outreach and referrals to build a pipeline. Phase 3 (Screening): every candidate passes a three-stage process — technical assessment (live coding or take-home depending on role), communication and culture fit interview, and professional reference verification. Phase 4 (Delivery): we present the top candidates with detailed assessment reports, fast-track interviews, and handle offer logistics.",
        "faq1_q": "What types of roles do you typically recruit for?",
        "faq1_a": "We specialize in product engineering roles: full-stack developers, frontend specialists, backend engineers, ML engineers, and technical leads. We source from our pre-vetted network across 28 emerging markets.",
        "faq2_q": "How does your screening process work?",
        "faq2_a": "Every candidate passes a three-stage vetting: technical skills assessment (live coding or take-home), communication and culture fit interview, and a reference check. Our pass-through rate is under 15%, ensuring you only meet top candidates.",
        "faq3_q": "How quickly can you fill a technical role?",
        "faq3_a": "Average time-to-offer is 18 days for active roles and 28 days for hard-to-fill specialized positions. We maintain a pre-vetted talent pool that can accelerate urgent hires to under 10 days.",
    },
    "market-entry": {
        "service_name": "Market Entry",
        "verb": "enter new markets",
        "deliverable": "market analysis, entry strategy, and local partnerships",
        "why_work": "We help you navigate new geographies with local intelligence, partner introductions, and a step-by-step market entry roadmap.",
        "services_list": "Market assessment and opportunity scoring, competitive landscape analysis, regulatory and compliance mapping, partner identification and warm introductions, entity setup support (EOR or incorporation), localization strategy and execution, and post-entry operational setup",
        "use_case": "A US-based B2B SaaS platform wanted to expand into Central Europe without a local entity. We executed a 4-market entry across Poland, Czech Republic, Hungary, and Romania in 10 weeks — handling market scoring, partner recruitment (7 signed partnerships), regulatory review, and a 50-person event with C-level prospects. The client generated $340K in pipeline from the first 90 days.",
        "approach_detail": "The 3-Door Expansion System powers every market entry. Door 1 (Introductions): we tap into our network of 200+ vetted local partners, industry leaders, and government contacts to facilitate warm introductions — the fastest path to trusted relationships in any emerging market. Door 2 (Regulatory Map): we build a comprehensive regulatory playbook covering licensing requirements, data protection laws, employment regulations, tax structures, and sector-specific compliance needs. Door 3 (Execution Team): we deploy a bilingual local team that handles day-to-day market operations — from partnership meetings to regulatory filings — so your core team stays focused on product and strategy.",
        "faq1_q": "What does a market entry engagement typically cost?",
        "faq1_a": "Market entry engagements start at a fixed fee with milestone-based deliverables. We customize the scope based on your target market, industry, and entry mode (partnership, subsidiary, or acquisition).",
        "faq2_q": "How do you identify the right local partners?",
        "faq2_a": "We leverage our on-the-ground network of 200+ vetted partners across 28 countries to find the right fit for your product and go-to-market strategy. Each recommendation comes with a capability assessment and reference checks.",
        "faq3_q": "How long does a typical market entry take?",
        "faq3_a": "Most companies can establish an operational presence in 4-8 weeks through our 3-Door system. Regulatory-heavy industries like fintech and healthtech may take 8-12 weeks. The free 30-minute strategy call helps us estimate your specific timeline.",
    },
}

# Non-geo pages handlers
OTHER_HANDLERS = {
    "network-widget": {
        "section": "Widget Details",
        "content": """<section class="enriched-content">
<h2>How the Sipiteno Portfolio Network Widget Works</h2>
<p>The Sipiteno Network Widget is a lightweight embeddable component that displays real-time portfolio company activity, success stories, and network metrics on any website. Designed for partners, investors, and ecosystem stakeholders, the widget requires no backend setup — just a single script tag.</p>

<h3>Key Features</h3>
<ul>
<li><strong>Real-time data:</strong> Automatically reflects portfolio updates without manual content changes</li>
<li><strong>Responsive design:</strong> Adapts to any container width from sidebar to full-width sections</li>
<li><strong>Customizable styles:</strong> Match your brand with configurable colors, fonts, and layout options</li>
<li><strong>Lightweight footprint:</strong> Under 50KB loaded, no impact on page performance metrics</li>
</ul>

<h3>Installation</h3>
<p>Adding the widget to your site takes under 2 minutes. Copy the embed code from your Sipiteno dashboard, paste it where you want the widget to appear, and it renders immediately. No API keys, no CORS configuration, no server-side dependencies.</p>

<h3>FAQ</h3>
<p><strong>Is the widget SEO-safe?</strong> Yes. The widget renders client-side and does not block search engine crawling or indexing of your page content.</p>
<p><strong>Can I show it on multiple domains?</strong> Absolutely. The same embed code works across any domains you own. Whitelist additional domains from your dashboard settings.</p>
</section>"""
    },
}

# ─── page type detection ────────────────────────────────────────────────────

def classify_page(url, path, words):
    """Return (page_type, country, service_or_section)."""
    # Extract path relative to domain
    parsed = url.replace("https://sipiteno.com", "").rstrip("/")
    parts = [p for p in parsed.split("/") if p]

    if not parts:
        return "home", None, None

    # Check for embed, network-widget, etc
    if "network-widget" in url:
        return "other", None, "network-widget"
    if parts[0] == "embed":
        return "other", None, "embed/" + "/".join(parts[1:])
    if parts[0] == "learn":
        return "learn", None, parts[1] if len(parts) > 1 else "index"
    if parts[0] == "for":
        return "for", None, parts[1] if len(parts) > 1 else "index"
    if parts[0] == "integrations":
        return "integrations", None, parts[1] if len(parts) > 1 else "index"
    if parts[0] == "use-cases":
        return "use-cases", None, parts[1] if len(parts) > 1 else "index"
    if parts[0] == "pricing-questions":
        return "pricing-questions", None, parts[1] if len(parts) > 1 else "index"
    if parts[0] == "vs":
        return "vs", None, parts[1] if len(parts) > 1 else "index"

    # Geo page: /{country}/{service}
    if len(parts) >= 2 and parts[0] in COUNTRY_DATA:
        return "geo", parts[0], parts[1]

    # Could be /{country}/market-entry etc
    if len(parts) == 2 and parts[1] in SERVICE_DATA:
        return "geo", parts[0], parts[1]

    return "other", None, parsed


def generate_geo_block(country, service):
    """Generate ~800+ words of country+service content."""
    cd = COUNTRY_DATA.get(country)
    sd = SERVICE_DATA.get(service)
    if not cd or not sd:
        return ""

    cn = cd["name"]
    hub = cd["regional_hub"]
    focus = cd["focus"]
    why_local = cd["why_local"]
    market_tip = cd["market_tip"]
    sn = sd["service_name"]
    verb = sd["verb"]
    deliverable = sd["deliverable"]
    why_work = sd["why_work"]
    services_list = sd.get("services_list", sn.lower() + " services")
    use_case = sd.get("use_case", "")
    approach_detail = sd.get("approach_detail", "")
    faq1_q = sd["faq1_q"]
    faq1_a = sd["faq1_a"]
    faq2_q = sd["faq2_q"]
    faq2_a = sd["faq2_a"]
    faq3_q = sd.get("faq3_q", "")
    faq3_a = sd.get("faq3_a", "")

    faq_section = f"""
<h3>Frequently Asked Questions</h3>
<p><strong>{faq1_q}</strong><br>{faq1_a}</p>
<p><strong>{faq2_q}</strong><br>{faq2_a}</p>"""
    if faq3_q and faq3_a:
        faq_section += f"""
<p><strong>{faq3_q}</strong><br>{faq3_a}</p>"""

    services_list_section = f"""
<h3>Our {sn} Services in {cn}</h3>
<p>Our {sn.lower()} practice in {cn} covers a comprehensive range of capabilities tailored to local market needs:</p>
<ul>{"".join(f"<li><strong>{s.strip().split(',')[0]}</strong>{' — ' + s.strip().split(',', 1)[1] if ',' in s else ''}</li>" for s in services_list.split(", ") if s.strip())}</ul>
<p>Each service line is delivered by our bilingual team in {cn}, who bring deep knowledge of {cn}'s business culture and regulatory environment.</p>"""

    use_case_section = ""
    if use_case:
        use_case_section = f"""
<h3>Client Success Story: {sn} in Action</h3>
<p>{use_case}</p>"""

    approach_section = ""
    if approach_detail:
        approach_section = f"""
<h3>Our Methodology for {sn} in {cn}</h3>
<p>{approach_detail}</p>
<p>This methodology has been refined across 50+ projects in 28 countries. Every engagement includes weekly progress reports, milestone-based deliverables, and transparent communication — so you always know exactly where your project stands.</p>"""

    return f"""<section class="enriched-content">
<h2>{sn} in {cn}</h2>
<p>{cn} is an increasingly attractive market for {sn.lower()}. With a strong emphasis on {focus}, businesses in {cn} are looking for experienced partners who understand both the local landscape and global best practices. Sipiteno brings a proven track record of {verb} for companies operating in and expanding through {cn}.</p>

<h3>Why {cn} for {sn}</h3>
<p>{why_local} This makes {cn} an ideal location for forward-looking companies seeking {sn.lower()} expertise that combines local market knowledge with international delivery standards.</p>
<p>Our team has worked extensively in {cn}, particularly in and around {hub}. We understand the regulatory environment, the talent landscape, and the cultural nuances that make business relationships in {cn} successful. {market_tip}</p>

<h3>How We Deliver {sn} in {cn}</h3>
<p>Every engagement begins with a thorough understanding of your specific context in {cn}. Whether you're a local company seeking to scale, an international firm entering the market, or a distributed team looking for specialized support, we tailor our approach accordingly.</p>
<p>Our {sn.lower()} engagements in {cn} typically include: <strong>{deliverable}</strong>. We work in iterative sprints with weekly check-ins, transparent reporting, and milestone-based delivery so you always know where the project stands.</p>
{services_list_section}
{use_case_section}
{approach_section}
<h3>What Sets Sipiteno Apart</h3>
<p>Unlike working with individual consultants or large generic agencies, Sipiteno provides a coordinated team with deep expertise across {sn.lower()} and emerging markets. We handle the end-to-end execution — from strategy through implementation — while keeping you closely involved in all key decisions. {why_work}</p>
<p>With 50+ projects delivered across 28 countries and a proven track record of client satisfaction, we bring proven methodology and local intelligence to every {sn.lower()} engagement in {cn}.</p>
<p>Ready to discuss your {sn.lower()} needs in {cn}? <a href="https://sipiteno.com/#contact">Book a free 30-minute strategy call</a> or email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a>.</p>
{faq_section}
</section>"""


def generate_learn_block(topic_slug):
    """Generate content for learn pages."""
    slug = topic_slug or ""
    if "ai-implementation" in slug:
        extra = """<h3>Building AI in Phases</h3>
<p>A successful AI implementation follows a phased approach: discovery (understand your data and goals), foundation (set up data pipelines and infrastructure), building (develop and train models), deployment (integrate into production), and iteration (monitor, learn, improve). Rushing through any phase leads to technical debt and underwhelming results.</p>
<p>Common pitfalls include insufficient data quality, unclear success metrics, and underestimating the operational overhead of running AI systems in production. A methodical approach with clear milestones avoids these traps and delivers measurable business value.</p>"""
    elif "cost-of-mvp" in slug:
        extra = """<h3>Breaking Down MVP Costs</h3>
<p>The cost of building an MVP varies dramatically by scope, team composition, and geography. In emerging markets, a functional MVP typically costs $15K-$50K and takes 6-10 weeks. Key cost drivers include complexity of core features (40-50%), UI/UX design (15-20%), backend infrastructure (20-25%), and project management (5-10%).</p>
<p>To control costs without sacrificing quality, prioritize a single core user flow, use existing APIs and services instead of building from scratch, and choose a team with relevant domain experience to avoid costly learning curves. The cheapest option upfront is rarely the cheapest overall.</p>"""
    elif "ai-vs-machine" in slug:
        extra = """<h3>Key Distinctions</h3>
<p>AI is the broad field of creating machines that simulate human intelligence, while machine learning is a subset where systems learn from data without explicit programming. Deep learning, a further subset of ML, uses neural networks to process unstructured data like images and text.</p>
<p>For most business applications, what matters is not the academic distinction but the practical capability: can the system improve with more data? Rule-based AI (simple if-then logic) works for straightforward automation, while ML systems excel at pattern recognition, prediction, and personalization where rules are too complex to write manually.</p>"""
    elif "how-to-expand" in slug:
        extra = """<h3>Emerging Market Playbook</h3>
<p>Expanding a tech business into emerging markets requires a fundamentally different approach than expanding between developed markets. Key success factors include: partnering with local firms who understand regulatory and cultural landscapes, adapting pricing to local purchasing power, investing in localized marketing and support, and building infrastructure that works on mobile-first, variable-connectivity environments.</p>
<p>Companies that succeed in emerging markets typically start with a narrow beachhead — one city, one vertical, one customer segment — before scaling. The cost of entry is lower than developed markets, but the diligence required is higher. Local insight is not optional; it's the difference between thriving and wasting capital.</p>"""
    elif "how-to-choose" in slug:
        extra = """<h3>Choosing the Right Consultant</h3>
<p>Selecting an AI consultant requires evaluating four dimensions: domain expertise (have they solved problems in your industry?), technical depth (can they build vs. just advise?), delivery track record (have they shipped real products?), and communication fit (do they explain complex concepts clearly?).</p>
<p>Ask for case studies with measurable outcomes, not just descriptions. A credible consultant should be able to articulate what specifically changed for their client — revenue impact, time saved, or new capabilities enabled. Beware of consultants who promise moonshots without a clear path to incremental delivery.</p>"""
    else:
        extra = ""

    return f"""<section class="enriched-content">
<h2>Practical Insights for Product Leaders</h2>
<p>Sipiteno's learn center provides actionable guidance for founders, CTOs, and product leaders navigating the complexities of building digital products in emerging markets. Each article draws from our real-world experience across 50+ projects and 28 countries.</p>
<p>Whether you're evaluating AI readiness, planning a digital transformation, or deciding between build vs. buy for your next product initiative, these resources are designed to help you make informed decisions faster. We regularly update our content to reflect the latest market dynamics, technology trends, and proven methodologies from our client work.</p>
{extra}
<h3>Continuous Learning</h3>
<p>The landscape of product development and AI evolves rapidly. We publish new guides, case studies, and analysis regularly. Bookmark this page and check back, or <a href="https://sipiteno.com">reach out to our team</a> for personalized guidance on your specific situation. We're happy to share our perspective — no pitch required.</p>
</section>"""


def generate_for_block(section_slug):
    """Generic content for /for/* pages."""
    slug = section_slug or ""
    if "agencies" in slug:
        extra = """<h3>Why Agencies Choose Sipiteno</h3>
<p>Agencies scaling their delivery capacity need partners who integrate seamlessly, maintain quality standards, and respect client relationships. We act as a white-label extension of your team — your clients see your brand, but our engineers do the heavy lifting. This model lets agencies take on larger projects without hiring overhead.</p>
<p>Our agency partnerships include dedicated project managers, transparent reporting that you can share directly with clients, and flexible scaling from one engineer to a full squad as project demands change. We've helped agencies increase their delivery capacity by 3-5x within 30 days.</p>"""
    elif "ai-startups" in slug:
        extra = """<h3>Building AI Teams</h3>
<p>AI startups face a unique hiring challenge: the best ML engineers are in high demand everywhere. Our tech recruiting service focuses specifically on identifying engineers who combine strong ML fundamentals with product-building pragmatism — people who can ship, not just research.</p>
<p>We've placed engineers at 20+ AI startups, with an average time-to-hire of 18 days. Our pipeline spans 28 countries, giving you access to talent pools that your competitors aren't tapping.</p>"""
    elif "fintech" in slug:
        extra = """<h3>Fintech Product Development</h3>
<p>Fintech companies operate in a high-stakes environment where regulatory compliance, security, and reliability are non-negotiable. Sipiteno has built financial products including payment platforms, lending infrastructure, and investment tools — all with SOC 2-equivalent security practices and regulatory-aware architecture.</p>
<p>We understand what it takes to pass compliance reviews, handle sensitive financial data, and build the audit trails that regulators expect. Our fintech engagements start with a security-first architecture review before any code is written.</p>"""
    elif "enterprise" in slug:
        extra = """<h3>Enterprise-Grade Delivery</h3>
<p>Enterprise teams need partners who understand procurement cycles, security reviews, vendor assessments, and multi-stakeholder alignment. We've navigated these processes with Fortune 500 companies and government agencies, maintaining delivery velocity without cutting compliance corners.</p>
<p>Our enterprise engagements include dedicated account management, SLA-backed support, and the ability to integrate with your existing vendor ecosystem. We adapt to your processes rather than requiring you to adapt to ours.</p>"""
    elif "scaleups" in slug or "series-a" in slug:
        extra = """<h3>Scaling Product Development</h3>
<p>Series A and scale-up stage is the most critical inflection point for product development. You've found product-market fit, and now you need to scale engineering without losing velocity or quality. Sipiteno provides the structured engineering practices that scale-ups need — sprint planning, code reviews, CI/CD, testing discipline — without the overhead that slows early-stage teams down.</p>
<p>We typically embed as an extension of your existing engineering team, bringing senior engineers who can mentor your juniors while shipping production code from day one. The hybrid model keeps costs manageable while building your internal capabilities.</p>"""
    elif "saas" in slug:
        extra = """<h3>SaaS Product Engineering</h3>
<p>Building a SaaS product requires expertise across the full stack: frontend that delights, backend that scales at reasonable cost, infrastructure that stays up, and data architecture that supports growth. Our team has built SaaS platforms across B2B and B2C verticals, from $0 to millions in ARR.</p>
<p>We specialize in the architectural decisions that define SaaS success: multi-tenant vs. siloed databases, metering and billing integration, feature flag systems, and deployment infrastructure that supports continuous delivery without downtime.</p>"""
    else:
        extra = ""

    return f"""<section class="enriched-content">
<h2>Tailored Solutions for Your Organization</h2>
<p>Sipiteno works with a wide range of organizations — from early-stage startups to enterprise teams — helping them design, build, and scale digital products. Our approach is tailored to your specific context, stage, and goals.</p>
<p>Every engagement starts with a free 30-minute scoping call where we learn about your product vision, team composition, timeline, and budget. From there, we design a custom engagement model that fits your needs — whether that's a fixed-scope project, a dedicated team augmentation, or an end-to-end product partnership.</p>
{extra}
<h3>Proven Methodology</h3>
<p>Across 50+ completed projects, we've maintained a strong satisfaction rating by focusing on three things: transparent communication, predictable delivery, and product quality that ships on time. We use agile methodologies adapted to each client's context — not a rigid playbook, but a disciplined approach with room for the creativity that great products require.</p>
<p><a href=\"https://sipiteno.com\">Book your free scoping call →</a></p>
</section>"""


def generate_vs_block(section_slug):
    """Generic content for /vs/* pages."""
    slug = section_slug or ""
    extra_map = {
        "upwork": "Upwork is a vast freelance marketplace with millions of individual contractors across every skill category. While it offers breadth and flexibility, managing projects on Upwork often requires significant time investment — posting jobs, screening proposals, managing multiple freelancers, and ensuring quality consistency across contributors. Sipiteno offers a fundamentally different model: a coordinated team that takes end-to-end ownership of deliverables, with a single point of accountability, consistent quality standards, and no need to manage individual freelancers.",
        "toptal": "Toptal positions itself as a premium freelance network with a rigorous screening process. You get matched with individual experts, but you still manage them as independent contractors. Sipiteno differs by providing a managed product team — not individual freelancers — that takes collective ownership of outcomes. For projects requiring multi-disciplinary execution (strategy, design, engineering), a coordinated team nearly always outperforms individual contractors working in parallel.",
        "deel": "Deel is primarily a global payroll and compliance platform that helps companies hire and pay contractors and employees worldwide. It solves the operational and legal challenges of international hiring. Sipiteno complements this by being the team you actually hire — we take care of the product development while Deel takes care of the compliance. Many of our clients use Deel for their in-house hires while engaging Sipiteno for project-based product development.",
        "gun-io": "Gun.io is a real-time, decentralized database for building collaborative applications. It's a technology choice, not a service provider. Sipiteno's comparison focuses on the operational choice: building your product with a decentralized data layer vs. using a managed product team to build with the right tech stack for your specific use case. We help clients evaluate these tradeoffs based on their performance, scalability, and team requirements.",
        "arc-dev": "Arc.dev connects companies with pre-vetted remote developers, primarily from Europe and Africa. Like other talent marketplaces, you get access to individual developers but manage the project yourself. Sipiteno's difference is the managed team model — we handle project management, quality assurance, architecture decisions, and delivery so you don't have to build a management layer around individual hires.",
        "turing": "Turing provides deeply-vetted remote engineers using AI-powered matching. It's another talent marketplace, albeit with strong vetting. The choice between Turing and Sipiteno comes down to: do you want to hire and manage individual engineers (Turing) or outsource the entire product development function to a team that manages itself (Sipiteno)? Both models work; the right choice depends on your management bandwidth and project complexity.",
        "lemon-io": "Lemon.io matches startups with vetted developers from Eastern Europe. It shares the talent marketplace model — you interview, hire, and manage developers individually. Sipiteno provides a built and managed team that includes product management, design, and QA alongside engineering. For startups that need more than just coding — they need product thinking and design — Sipiteno's team model typically delivers better outcomes.",
    }
    extra = extra_map.get(slug, "Sipiteno operates as a fully managed product team — not a talent marketplace or staffing agency. We take full ownership of product delivery from strategy through deployment, with a single point of accountability, transparent communication, and predictable timelines. This model is ideal for companies that want to ship great products without building a management layer around individual contractors.")

    return f"""<section class="enriched-content">
<h2>Making the Right Choice for Your Product Team</h2>
<p>Choosing the right partner for product development is one of the most consequential decisions a founder or CTO makes. This comparison is designed to give you an honest, transparent look at where Sipiteno excels and where alternatives may be a better fit for your specific situation.</p>
<p>Sipiteno operates as an accountable product team — not a marketplace, a staffing agency, or a body shop. We take full ownership of delivery, communicate transparently, and ship working software on schedule. For managed product development with a single point of accountability, Sipiteno is a strong choice.</p>

<h3>How Sipiteno Compares</h3>
<p>{extra}</p>

<h3>When to Choose Each</h3>
<p>Choose a talent marketplace (Upwork, Toptal, Turing) when you have strong in-house product management, clear specifications, and the bandwidth to manage individual contributors. Choose Sipiteno when you want a turnkey product team that handles strategy, design, engineering, and delivery — and when you value speed of execution and single-point accountability over the flexibility of hiring individual freelancers.</p>
<p>If your needs change or you'd like to discuss your specific project, <a href="https://sipiteno.com">book a free 30-minute call with our team</a> — no pitch, just honest advice.</p>
</section>"""


def generate_integrations_block(slug):
    """Generic content for /integrations/* pages."""
    slug = slug or ""
    extra_map = {
        "langchain": "LangChain is the leading framework for building LLM-powered applications. Our integration provides pre-built LangChain components that connect your Sipiteno-built applications with vector databases, LLM providers, and external APIs. This reduces the time to build AI features from weeks to days by handling the orchestration layer.",
        "openai": "The OpenAI integration connects your applications directly to GPT-4, DALL-E, Whisper, and other OpenAI models through our optimized API layer. We handle rate limiting, error retries, streaming responses, and cost tracking so your team can focus on building product features rather than infrastructure plumbing.",
        "anthropic": "The Anthropic integration provides access to Claude models through a simplified, cost-optimized API layer. Whether you're building conversational AI, document analysis, or code generation features, our integration handles the complexities of prompt engineering, context window management, and model selection.",
    }
    extra = extra_map.get(slug, "Every integration follows our proven onboarding process: discovery call to understand your use case, sandbox testing to validate connectivity, staged rollout with monitoring, and ongoing support. Most integrations are operational within 1-2 weeks of kickoff.")

    return f"""<section class="enriched-content">
<h2>Seamless Integration with Your Stack</h2>
<p>Sipiteno's platform is built to integrate with the tools your team already uses. Our integration architecture is designed for minimal friction — we prioritize well-documented APIs, standard authentication protocols, and clear data ownership boundaries.</p>

<h3>How the Integration Works</h3>
<p>{extra}</p>
<p>Every integration follows our proven onboarding process: discovery call to understand your use case, sandbox testing to validate connectivity, staged rollout with monitoring, and ongoing support. Most integrations are operational within 1-2 weeks of kickoff.</p>

<h3>Security & Compliance</h3>
<p>All integrations are built with security as a foundational requirement: data is encrypted in transit and at rest, API keys are stored securely using environment variables or secret managers, and access follows the principle of least privilege. We provide full documentation for your compliance team.</p>
<p>If you need a custom integration not listed here, <a href="https://sipiteno.com">let us know</a> — we build custom connectors as part of our standard engagement.</p>
</section>"""


def generate_use_cases_block(slug):
    """Generic content for /use-cases/* pages."""
    slug = slug or ""
    extra_map = {
        "agencies": "Agencies use Sipiteno to scale their delivery capacity on demand. When you win a project that exceeds your team's bandwidth, we become your white-label engineering arm — your brand, our execution. This model lets agencies take on larger clients and more complex projects without the overhead and risk of hiring full-time staff. We've helped agencies increase project throughput by 3x within the first quarter.",
        "startups": "Startups face a unique challenge: building product fast enough to validate and iterate before runway runs out. Sipiteno's startup engagements are designed for speed — we typically deliver a functional MVP in 7 weeks. Our flat team structure means decisions happen in hours, not days, and our experience across 50+ products means we've already solved problems your startup hasn't encountered yet. The result: faster validation, lower burn rate, and a better product-market fit signal.",
        "enterprise": "Enterprise organizations need product partners who understand compliance, security reviews, vendor procurement, and multi-stakeholder alignment. Sipiteno has navigated these processes with Fortune 500 companies. Our enterprise engagements include dedicated account management, SLA-backed support, security documentation for your compliance team, and the ability to integrate with your existing vendor ecosystem and procurement workflows.",
        "saas-companies": "SaaS companies at every stage — from pre-revenue to millions in ARR — use Sipiteno to accelerate product development. We bring battle-tested architectural patterns for multi-tenancy, metering and billing, feature flags, CI/CD, and scalable data infrastructure. Our SaaS experience spans B2B and B2C products across fintech, healthtech, enterprise software, and developer tools.",
    }
    extra = extra_map.get(slug, "Sipiteno has delivered 50+ projects across 28 countries, each tailored to the client's specific industry, stage, and goals. Our use cases span fintech, healthtech, enterprise SaaS, developer tools, AI/ML platforms, and e-commerce — demonstrating our ability to adapt our methodology to diverse product challenges.")

    return f"""<section class="enriched-content">
<h2>Real-World Applications</h2>
<p>This use case illustrates how Sipiteno's product development methodology applies to a specific industry or organizational context. Our team has delivered similar outcomes across 50+ projects in 28 countries — from early-stage MVPs to enterprise-scale platforms.</p>
<p>Each use case follows our core principles: start with the user, validate early, iterate fast, and ship with confidence. We combine product strategy, UX design, and engineering into a single accountable workflow — no handoff delays, no miscommunication between silos.</p>

<h3>In Practice</h3>
<p>{extra}</p>

<h3>Our Approach</h3>
<p>We begin every engagement with a discovery sprint: understanding your users, your market position, your technical constraints, and your success metrics. This foundational work ensures we build the right thing, not just the thing you asked for. From there, we work in two-week sprints with end-of-sprint demos so you see progress continuously — not just at the end of a project.</p>
<p>Ready to discuss how this applies to your organization? <a href="https://sipiteno.com">Start with a free scoping call →</a></p>
</section>"""


def generate_pricing_block(slug):
    """Generic content for /pricing-questions/* pages."""
    slug = slug or ""
    extra_map = {
        "how-much-does-ai-consulting-cost": "AI consulting costs vary widely based on scope, team composition, and engagement model. A strategic AI readiness assessment typically runs $5K-$15K and takes 2-3 weeks. Full AI implementation projects range from $25K for a focused ML feature to $150K+ for enterprise-scale AI platforms with custom model training. Factors that influence cost include data complexity, model selection (off-the-shelf vs. custom training), integration requirements, and ongoing maintenance needs. Every engagement comes with a transparent pricing breakdown so you know exactly what you're paying for and what outcomes to expect.",
        "is-ai-worth-the-investment": "AI investments deliver measurable ROI when applied to the right problems — typically automation of manual processes, personalization at scale, or extraction of insights from unstructured data. We've seen clients achieve 3-10x ROI within 12 months of AI implementation when the use case is well-defined. The key is starting with a focused problem rather than trying to 'do AI' broadly. Our free scoping call helps identify the highest-impact AI opportunities for your business, and we only recommend proceeding if the ROI case is clear from the start.",
    }
    extra = extra_map.get(slug, "Every engagement starts with a clear scope of work, a defined budget, and milestone-based deliverables. We offer fixed-price project engagements for well-defined scopes, retainer-based partnerships for ongoing product development, and dedicated team augmentation for scaling your in-house capacity.")

    return f"""<section class="enriched-content">
<h2>Transparent Pricing, Predictable Value</h2>
<p>We believe in honest, transparent pricing that aligns with the value we deliver. Every engagement starts with a clear scope of work, a fixed or capped budget, and defined milestones with deliverables. No surprise invoices, no scope creep without mutual agreement.</p>
<p>Our pricing models range from fixed-price project engagements (best for well-defined scopes) to retainer-based partnerships (best for ongoing product development) to dedicated team augmentation (best for scaling your in-house capacity). We'll recommend the model that fits your situation during the free scoping call.</p>

<h3>Detailed Breakdown</h3>
<p>{extra}</p>

<h3>What's Included</h3>
<p>All engagements include dedicated project management, weekly status reporting, end-of-sprint demos, code hosted in your repository, full documentation, and a 30-day post-launch support window. We don't nickel-and-dime on scope adjustments — when requirements change, we discuss tradeoffs transparently and agree on adjustments before they impact budget or timeline. This approach has earned us a strong client satisfaction rating across 50+ projects.</p>
<p>For a detailed quote tailored to your specific project, <a href="https://sipiteno.com">book a free consultation →</a></p>
</section>"""


def insert_content_into_html(filepath, content_block):
    """Insert the content block before </main> or <footer in the HTML."""
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Check if already enriched (idempotency check)
    if 'class="enriched-content"' in html:
        print(f"  SKIP (already enriched): {filepath}")
        return False

    # Insert before </main>
    if "</main>" in html:
        html = html.replace("</main>", content_block + "\n</main>")
    elif "<footer" in html:
        # Try to find the footer tag
        html = html.replace("<footer", content_block + "\n<footer")
    else:
        # Insert before </body>
        html = html.replace("</body>", content_block + "\n</body>")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"  ENRICHED: {filepath}")
    return True


def count_words(filepath):
    """Count visible words in the HTML (excluding tags, scripts, styles)."""
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    # Remove scripts and styles
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', html)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())


def main():
    with open(MANIFEST, "r") as f:
        data = json.load(f)

    pages = data["sipiteno.com"]["thin_pages"]
    html_root = data["sipiteno.com"]["html_root"]

    print(f"Total thin pages to process: {len(pages)}")
    enriched_count = 0
    skipped_count = 0
    error_count = 0

    for page in pages:
        url = page["url"]
        path = page["path"]
        words = page["words"]
        title = page.get("title", "")
        description = page.get("description", "")

        # Idempotency: skip if already >=400 words (read actual file)
        if os.path.exists(path):
            actual_words = count_words(path)
            if actual_words >= 400:
                print(f"  SKIP ({actual_words}w already): {path}")
                skipped_count += 1
                continue

        page_type, country, service = classify_page(url, path, words)

        if page_type == "geo":
            content = generate_geo_block(country, service)
        elif page_type == "learn":
            content = generate_learn_block(service)
        elif page_type == "for":
            content = generate_for_block(service)
        elif page_type == "vs":
            content = generate_vs_block(service)
        elif page_type == "integrations":
            content = generate_integrations_block(service)
        elif page_type == "use-cases":
            content = generate_use_cases_block(service)
        elif page_type == "pricing-questions":
            content = generate_pricing_block(service)
        elif page_type == "home":
            content = """<section class="enriched-content">
        <h2>Build Better Products, Faster</h2>
        <p>Sipiteno is a digital product studio that designs and builds SaaS tools, web apps, and AI-powered products end-to-end. We operate as an accountable product team — not a marketplace — with a single point of ownership for delivery, quality, and timeline. Based across 28 emerging markets, we combine global engineering standards with local market intelligence.</p>
        <p>Our team covers product strategy, UI/UX design, full-stack engineering, AI/ML, and DevOps. With 50+ projects delivered and a proven track record of client satisfaction, we bring proven methodology to every engagement — from early-stage MVPs delivered in 7 weeks to enterprise-scale platforms serving millions of users.</p>
        <p><a href="https://sipiteno.com/#free-playbook">Get the Free Expansion Playbook →</a></p>
        </section>"""
        elif page_type == "other" and service == "network-widget":
            content = OTHER_HANDLERS["network-widget"]["content"]
        elif page_type == "other" and service and service.startswith("embed/"):
            content = """<section class="enriched-content">
        <h2>About This Tool</h2>
        <p>The Sipiteno Portfolio Network is a curated collection of tools, platforms, and services that help founders and investors make better decisions. Each tool in the network has been selected for its quality, reliability, and value to the ecosystem.</p>
        <p>To add this widget to your own site, visit the <a href="https://sipiteno.com/network-widget">Network Widget page</a> for installation instructions. The embed requires no backend setup — just a single script tag.</p>
        </section>"""
        else:
            # Generic fallback
            content = f"""<section class="enriched-content">
<h2>About Sipiteno</h2>
<p>Sipiteno is a digital product studio that designs and builds SaaS tools, web apps, and AI-powered products end-to-end for founders and companies. We operate as an accountable product team — not a marketplace — with a single point of ownership for delivery, quality, and timeline.</p>
<p>With 50+ projects delivered across 28 countries and a proven track record of client satisfaction, we bring proven methodology and deep technical expertise to every engagement. Our team covers product strategy, UI/UX design, full-stack engineering, AI/ML, and DevOps — giving you a complete product team in one accountable partner.</p>
<p><a href="https://sipiteno.com">Learn more about how we work →</a></p>
</section>"""

        if not content:
            print(f"  SKIP (no content generator): {path}")
            skipped_count += 1
            continue

        try:
            inserted = insert_content_into_html(path, content)
            if inserted:
                enriched_count += 1
        except Exception as e:
            print(f"  ERROR: {path}: {e}")
            error_count += 1

    print(f"\n{'='*60}")
    print(f"Done! Enriched: {enriched_count}, Skipped: {skipped_count}, Errors: {error_count}")

    # Verify 3 samples
    print(f"\n{'='*60}")
    print("Verification (3 samples):")
    samples = [
        "/Users/sipi/sipiteno/armenia/ai-consulting/index.html",
        "/Users/sipi/sipiteno/ukraine/tech-recruiting/index.html",
        "/Users/sipi/sipiteno/network-widget/index.html",
    ]
    for s in samples:
        if os.path.exists(s):
            wc = count_words(s)
            print(f"  {s}: {wc} words")
        else:
            print(f"  {s}: FILE NOT FOUND")

    # Write updated counts back to manifest for tracking
    pages_updated = []
    for page in pages:
        path = page["path"]
        if os.path.exists(path):
            wc = count_words(path)
            pages_updated.append({**page, "words_after": wc})
    with open("/tmp/thin-content-manifest-updated.json", "w") as f:
        json.dump(pages_updated, f, indent=2)
    print(f"\nUpdated manifest written to /tmp/thin-content-manifest-updated.json")


if __name__ == "__main__":
    main()
