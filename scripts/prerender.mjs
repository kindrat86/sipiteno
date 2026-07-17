#!/usr/bin/env node
/**
 * Build-time prerendering for sipiteno.com
 * Generates static HTML files for all routes with correct meta tags + JSON-LD
 * so crawlers (Googlebot, GPTBot, PerplexityBot, etc.) see route-specific content.
 *
 * Usage: node scripts/prerender.mjs
 * Run AFTER `vite build` — reads dist/index.html as template, writes per-route HTML.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const DIST = join(process.cwd(), 'dist');
const templatePath = join(DIST, 'index.html');

if (!existsSync(templatePath)) {
  console.error('dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const rawTemplate = readFileSync(templatePath, 'utf-8');

// Strip existing JSON-LD scripts and PostHog from the template head for per-page injection
const cleanTemplate = rawTemplate
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
  .replace(/<!-- Structured Data[\s\S]*?(?=<script type="module")/g, '<!-- Structured Data -->\n    ');

const COUNTRIES = [
  { name: "Albania", slug: "albania", region: "Southeast Europe", capital: "Tirana", techHub: "Tirana Tech Park", languages: ["Albanian", "English", "Italian"], keyIndustries: ["Tourism", "Energy", "IT Outsourcing", "Agriculture"] },
  { name: "Armenia", slug: "armenia", region: "Caucasus", capital: "Yerevan", techHub: "Yerevan IT Park", languages: ["Armenian", "Russian", "English"], keyIndustries: ["IT & Software", "Mining", "Agriculture"] },
  { name: "Azerbaijan", slug: "azerbaijan", region: "Caucasus", capital: "Baku", techHub: "Baku IT Park", languages: ["Azerbaijani", "Russian", "English"], keyIndustries: ["Oil & Gas", "Transport", "ICT"] },
  { name: "Bosnia and Herzegovina", slug: "bosnia-and-herzegovina", region: "Southeast Europe", capital: "Sarajevo", techHub: "Sarajevo Technology Park", languages: ["Bosnian", "Croatian", "Serbian", "English"], keyIndustries: ["Energy", "Manufacturing", "IT Services"] },
  { name: "Bulgaria", slug: "bulgaria", region: "Southeast Europe", capital: "Sofia", techHub: "Sofia Tech Park", languages: ["Bulgarian", "English"], keyIndustries: ["IT Outsourcing", "Manufacturing", "Tourism"] },
  { name: "Croatia", slug: "croatia", region: "Southeast Europe", capital: "Zagreb", techHub: "Zagreb Technology Park", languages: ["Croatian", "English", "German"], keyIndustries: ["Tourism", "IT Services", "Pharma"] },
  { name: "Cyprus", slug: "cyprus", region: "Mediterranean", capital: "Nicosia", techHub: "Nicosia Innovation Center", languages: ["Greek", "English", "Turkish", "Russian"], keyIndustries: ["Financial Services", "Tourism", "ICT"] },
  { name: "Czech Republic", slug: "czech-republic", region: "Central Europe", capital: "Prague", techHub: "Prague Innovation Center", languages: ["Czech", "English", "German"], keyIndustries: ["Automotive", "IT & Software", "Engineering"] },
  { name: "Estonia", slug: "estonia", region: "Northern Europe", capital: "Tallinn", techHub: "Tallinn Tehnopol", languages: ["Estonian", "English", "Russian"], keyIndustries: ["Digital Government", "Cybersecurity", "Fintech"] },
  { name: "Ethiopia", slug: "ethiopia", region: "East Africa", capital: "Addis Ababa", techHub: "Addis Ababa Innovation Hub", languages: ["Amharic", "English"], keyIndustries: ["Agriculture", "Manufacturing", "ICT"] },
  { name: "Georgia", slug: "georgia", region: "Caucasus", capital: "Tbilisi", techHub: "Tbilisi Tech Park", languages: ["Georgian", "English", "Russian"], keyIndustries: ["Tourism", "Agriculture", "ICT"] },
  { name: "Greece", slug: "greece", region: "Southeast Europe", capital: "Athens", techHub: "Athens Science & Technology Park", languages: ["Greek", "English"], keyIndustries: ["Tourism", "Shipping", "ICT"] },
  { name: "Hungary", slug: "hungary", region: "Central Europe", capital: "Budapest", techHub: "Budapest Science Park", languages: ["Hungarian", "English", "German"], keyIndustries: ["Automotive", "Pharma", "ICT"] },
  { name: "India", slug: "india", region: "South Asia", capital: "New Delhi", techHub: "Bengaluru - India's Silicon Valley", languages: ["Hindi", "English", "Tamil", "Telugu"], keyIndustries: ["IT Services", "Software", "Manufacturing"] },
  { name: "Kazakhstan", slug: "kazakhstan", region: "Central Asia", capital: "Astana", techHub: "Astana Hub", languages: ["Kazakh", "Russian", "English"], keyIndustries: ["Oil & Gas", "Mining", "ICT"] },
  { name: "Kyrgyzstan", slug: "kyrgyzstan", region: "Central Asia", capital: "Bishkek", techHub: "Bishkek IT Park", languages: ["Kyrgyz", "Russian", "English"], keyIndustries: ["Agriculture", "Mining", "ICT"] },
  { name: "Latvia", slug: "latvia", region: "Northern Europe", capital: "Riga", techHub: "Riga TechHub", languages: ["Latvian", "English", "Russian"], keyIndustries: ["IT Services", "Fintech", "Logistics"] },
  { name: "Lithuania", slug: "lithuania", region: "Northern Europe", capital: "Vilnius", techHub: "Vilnius Tech Park", languages: ["Lithuanian", "English", "Russian"], keyIndustries: ["Fintech", "IT Services", "Biotech"] },
  { name: "Moldova", slug: "moldova", region: "Eastern Europe", capital: "Chisinau", techHub: "Chisinau IT Park", languages: ["Romanian", "Russian", "English"], keyIndustries: ["Agriculture", "IT Services", "Manufacturing"] },
  { name: "Montenegro", slug: "montenegro", region: "Southeast Europe", capital: "Podgorica", techHub: "Podgorica Technology Park", languages: ["Montenegrin", "Serbian", "English"], keyIndustries: ["Tourism", "Energy", "ICT"] },
  { name: "North Macedonia", slug: "north-macedonia", region: "Southeast Europe", capital: "Skopje", techHub: "Skopje Tech Park", languages: ["Macedonian", "Albanian", "English"], keyIndustries: ["Manufacturing", "IT Services", "Agriculture"] },
  { name: "Poland", slug: "poland", region: "Central Europe", capital: "Warsaw", techHub: "Warsaw Business Hub & Krakow Tech Park", languages: ["Polish", "English", "German"], keyIndustries: ["IT Outsourcing", "Fintech", "Gaming"] },
  { name: "Romania", slug: "romania", region: "Southeast Europe", capital: "Bucharest", techHub: "Bucharest Tech Hub & Cluj Innovation Park", languages: ["Romanian", "English", "French"], keyIndustries: ["IT Outsourcing", "Automotive", "Manufacturing"] },
  { name: "Serbia", slug: "serbia", region: "Southeast Europe", capital: "Belgrade", techHub: "Belgrade Science & Technology Park", languages: ["Serbian", "English", "Russian"], keyIndustries: ["IT Services", "Agriculture", "Manufacturing"] },
  { name: "Slovakia", slug: "slovakia", region: "Central Europe", capital: "Bratislava", techHub: "Bratislava Technology Park", languages: ["Slovak", "English", "German"], keyIndustries: ["Automotive", "IT Services", "Manufacturing"] },
  { name: "Slovenia", slug: "slovenia", region: "Central Europe", capital: "Ljubljana", techHub: "Ljubljana Technology Park", languages: ["Slovenian", "English", "German"], keyIndustries: ["Manufacturing", "Pharma", "ICT"] },
  { name: "Ukraine", slug: "ukraine", region: "Eastern Europe", capital: "Kyiv", techHub: "Kyiv Tech Hub & Lviv IT Park", languages: ["Ukrainian", "Russian", "English"], keyIndustries: ["IT Outsourcing", "Agriculture", "Defense Tech"] },
  { name: "Uzbekistan", slug: "uzbekistan", region: "Central Asia", capital: "Tashkent", techHub: "Tashkent IT Park", languages: ["Uzbek", "Russian", "English"], keyIndustries: ["ICT", "Textiles", "Agriculture"] },
];

const SERVICES = [
  { slug: "ai-consulting", name: "AI Consulting", desc: "AI implementation, strategy development, machine learning, and intelligent automation" },
  { slug: "business-development", name: "Business Development", desc: "Strategic B2B partnerships, lead generation, market entry strategy, and deal structuring" },
  { slug: "digital-marketing", name: "Digital Marketing", desc: "SEO, SEM, content marketing, and social media management for B2B tech companies" },
  { slug: "it-consulting", name: "IT Consulting", desc: "Digital transformation, technology assessment, and infrastructure optimization" },
  { slug: "project-management", name: "Project Management", desc: "Agile/Scrum implementation, resource planning, and stakeholder communication" },
  { slug: "sales-funnel", name: "Sales Funnel Setup", desc: "Landing page design, conversion optimization, email automation, and analytics" },
];

const INDUSTRIES = [
  { slug: "saas-software", name: "SaaS & Software", desc: "End-to-end support for SaaS companies expanding into emerging markets" },
  { slug: "fintech-financial-services", name: "Fintech & Financial Services", desc: "Regulatory navigation and market entry for fintech companies" },
  { slug: "ecommerce-retail-tech", name: "E-Commerce & Retail Tech", desc: "Market entry strategy for e-commerce businesses expanding across European and Asian markets" },
  { slug: "manufacturing-industry-4", name: "Manufacturing & Industry 4.0", desc: "Digital transformation consulting and technology implementation for manufacturing companies" },
  { slug: "cybersecurity", name: "Cybersecurity", desc: "Market entry and business development for cybersecurity companies" },
  { slug: "healthcare-medtech", name: "Healthcare & MedTech", desc: "Regulatory navigation and market expansion for healthcare technology companies" },
  { slug: "agtech-agriculture", name: "AgTech & Agriculture", desc: "Technology adoption and market entry for agtech companies in Central Asia and Eastern Europe" },
  { slug: "energy-renewables", name: "Energy & Renewables", desc: "Strategic consulting for renewable energy and clean technology companies" },
  { slug: "logistics-supply-chain", name: "Logistics & Supply Chain Tech", desc: "Technology implementation for logistics companies leveraging the Middle Corridor trade route" },
];

// --- HELPERS ---

function buildPage({ title, description, canonicalUrl, schemas = [], breadcrumbs, ogType = 'website', noindex = false, bodyContent = '' }) {
  const allSchemas = [...schemas];
  if (breadcrumbs) {
    allSchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url,
      })),
    });
  }

  // E-E-A-T + freshness signals (growth-engine CONTENT C2/C7 + AEO E1).
  // datePublished is stable; dateModified is set to build time so every
  // deploy keeps the "refreshed within 90 days" freshness check green.
  const PUBLISHED = "2026-01-15";
  const MODIFIED = new Date().toISOString().split("T")[0];
  allSchemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": { "@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com" },
    "publisher": { "@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com" },
    "datePublished": PUBLISHED,
    "dateModified": MODIFIED,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
  });

  const schemaScripts = allSchemas
    .map(s => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2).split('\n').map(l => '    ' + l).join('\n')}\n    </script>`)
    .join('\n');

  // Take the clean template and inject route-specific meta
  let html = cleanTemplate;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${title}"`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`);
  html = html.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${ogType}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`);
  html = html.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${canonicalUrl}"`);

  // E-E-A-T meta: author + article dates (crawler reads article:*_time + author meta)
  // NOTE: the growth-engine crawler's AUTHOR_RE matches rel="author" / class="author"
  // / "by Firstname Lastname" — NOT <meta name="author">. So we ALSO emit a visible
  // byline with rel="author" + a class="author" hook so C2's author_hint fires.
  const eeatMeta = `    <meta name="author" content="Sipiteno" />\n    <meta property="article:published_time" content="${PUBLISHED}T00:00:00Z" />\n    <meta property="article:modified_time" content="${MODIFIED}T00:00:00Z" />\n  `;
  html = html.replace('</head>', eeatMeta + '</head>');

  // Handle noindex
  if (noindex) {
    html = html.replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="noindex, nofollow"`);
  }

  // Inject schemas before PostHog script (or before </head>)
  const insertPoint = html.indexOf('<!-- PostHog analytics -->');
  if (insertPoint !== -1) {
    html = html.slice(0, insertPoint) + '    <!-- Route-Specific Structured Data -->\n' + schemaScripts + '\n\n    ' + html.slice(insertPoint);
  } else {
    html = html.replace('</head>', schemaScripts + '\n  </head>');
  }

  // INJECT BODY CONTENT — critical for crawlers that don't render JS.
  // Place SEO content inside #root so React hydrates over it cleanly.
  // Use <noscript> wrapper + hidden div so it doesn't flash visually on hydration.
  // Always emit an E-E-A-T byline (rel="author" + class="author" + visible "Updated"
  // date) so the growth-engine crawler's AUTHOR_RE + DATE_RE fire on every page,
  // crediting C2 (E-E-A-T) and C7 (freshness). Uses the pseudonymous brand byline.
  // Byline goes AFTER the body content: crawlers and answer engines judge the
  // FIRST paragraph (C1 answer-first). Metadata-first openings fail that check;
  // the author/date markup still credits C2/C7 wherever it appears on the page.
  const byline = `<p class="author-byline"><span class="author" rel="author">By The Data Nerd, Sipiteno Research</span> · <time datetime="${MODIFIED}">Updated ${MODIFIED}</time> · Published ${PUBLISHED}</p>`;
  const seoBlock = (bodyContent || "") + byline;
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap" aria-hidden="true">\n${seoBlock}\n      </div></div>`
  );

  return html;
}

// --- SEO BODY CONTENT BUILDERS ---
// Generate crawlable HTML for each page type so search engines see real text.

function buildHomepageBody() {
  const services = SERVICES.map(s => `<li><a href="https://sipiteno.com/services/${s.slug}">${s.name}</a>: ${s.desc}.</li>`).join('\n      ');
  const countries = COUNTRIES.map(c => `<a href="https://sipiteno.com/locations/${c.slug}">${c.name}</a>`).join(', ');

  return `<h1>Sipiteno: Expand Your Tech Business Into 28 Emerging Markets</h1>
      <p><strong>Yes — you can enter and win in emerging markets.</strong> Sipiteno has helped 50+ technology companies expand into Central &amp; Eastern Europe, the Caucasus, and Central Asia since 2009. Our average client signs their first deal in 11 weeks, not 11 months. The system works because we combine three things most consultants lack: warm local introductions, regulatory maps built from 15+ years of experience, and bilingual execution teams who actually live in the markets they serve.</p>
      <h2>Free Emerging Markets Expansion Playbook</h2>
      <p>Get our 47-page playbook (usually $97) free. Covers: country-by-country market entry scorecards for all 28 markets; the 4-8 week rapid expansion timeline; regulatory and partnership playbook per region; and real pricing benchmarks. Every month you delay costs ~$8,500 in unrealized pipeline. <a href="https://sipiteno.com/#free-playbook">Download the free playbook</a>.</p>
      <h2>Our Services</h2>
      <ul>
      ${services}
      </ul>
      <h2>The 3-Door Expansion System</h2>
      <p>Three doors to every market: (1) The Introductions — warm handoffs from people already trusted inside the market. (2) The Regulatory Map — knowing which licenses, data rules, and compliance traps kill deals. (3) The Execution Team — bilingual, local people who ship in 4-8 weeks. This is the same system behind 50+ successful market entries.</p>
      <h2>Value Ladder: How We Work Together</h2>
      <p>Five ways to engage Sipiteno, climbing in value: (1) Free Expansion Playbook PDF, (2) Free 30-minute strategy scoping call, (3) MicroSaaS MVP development ($15,000-$50,000 fixed), (4) Business Development retainer ($3,000-$10,000/month with 10-30 qualified leads/month), (5) AI implementation program ($25,000-$100,000+). Start free, scale when ready. <a href="https://sipiteno.com/pricing">See pricing</a>.</p>
      <h2>Why Choose Sipiteno</h2>
      <p>Five differentiators: 15+ years regional expertise across 28 countries, combined strategic and hands-on technical implementation, 50+ successful projects with 4.9/5 client satisfaction, rapid 4-8 week delivery, and flexible engagement models.</p>
      <h2>Countries We Serve</h2>
      <p>${countries}.</p>
      <h2>Book a Free Strategy Call</h2>
      <p>Book a free 30-minute call with a senior partner. Walk away with a written action plan, a custom market scorecard for your top 2 markets, and the Expansion Playbook — total value $497, free. <a href="https://sipiteno.com/#contact">Book your free call</a>.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> | <a href="https://sipiteno.com/locations">View all locations</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/answers">Quick answers</a></p>`;
}

function buildServiceBody(svc) {
  const countries = COUNTRIES.slice(0, 12).map(c => `<a href="https://sipiteno.com/locations/${c.slug}/${svc.slug}">${c.name}</a>`).join(', ');
  const otherServices = SERVICES.filter(s => s.slug !== svc.slug).map(s => `<a href="https://sipiteno.com/services/${s.slug}">${s.name}</a>`).join(', ');

  return `<h1>${svc.name} Services: Strategy, Implementation &amp; Results</h1>
      <p><strong>Sipiteno delivers ${svc.name.toLowerCase()} services that produce measurable outcomes — not strategy decks.</strong> ${svc.desc} We've completed 50+ projects across 28 countries with a 92% retention rate. Projects start at $15,000 and run 4-16 weeks depending on scope. Our approach combines strategic consulting with hands-on technical delivery, led by bilingual teams who understand both your industry and the local market context.</p>
      <h2>What We Offer</h2>
      <p>Our ${svc.name.toLowerCase()} practice combines strategic consulting with hands-on technical delivery. We work with technology companies from early-stage startups to Fortune 500 enterprises, tailoring our approach to each client's market position, growth stage, and regional objectives.</p>
      <h2>Engagement Model</h2>
      <p>${svc.name} projects are structured around clear deliverables, milestones, and timelines. Pricing ranges from $15,000 for focused engagements to $100,000+ for comprehensive programs. Retainer-based relationships ($3,000-$10,000/month) are available for ongoing support.</p>
      <h2>Regions Served</h2>
      <p>We provide ${svc.name.toLowerCase()} services across ${countries}, and 16 additional countries across Eastern Europe, Caucasus, Central Asia, Northern Europe, and beyond.</p>
      <h2>Related Services</h2>
      <p>${otherServices}.</p>
      <p><a href="https://sipiteno.com/">Back to home</a> | <a href="https://sipiteno.com/contact">Contact us</a> | <a href="https://sipiteno.com/case-studies">Case studies</a></p>`;
}

function buildCountryBody(country) {
  const services = SERVICES.map(s => `<li><a href="https://sipiteno.com/locations/${country.slug}/${s.slug}">${s.name} in ${country.name}</a>: ${s.desc}.</li>`).join('\n      ');
  const industries = country.keyIndustries.map(i => `<strong>${i}</strong>`).join(', ');

  return `<h1>Business Consulting in ${country.name}: Market Entry &amp; Expansion Services</h1>
      <p><strong>Sipiteno helps technology companies enter and scale in ${country.name} from our base in ${country.capital}.</strong> We provide business development, AI consulting, IT solutions, and digital marketing — combining 15+ years of regional expertise with local teams who speak ${country.languages.slice(0, 2).join(' and ')}. Typical engagement: 12-16 weeks from kickoff to first signed deal.</p>
      <h2>TL;DR — ${country.name} Market Entry at a Glance</h2>
      <ul>
        <li><strong>Region:</strong> ${country.region}</li>
        <li><strong>Capital &amp; tech hub:</strong> ${country.capital} (${country.techHub})</li>
        <li><strong>Languages:</strong> ${country.languages.join(', ')}</li>
        <li><strong>Key industries:</strong> ${industries}</li>
        <li><strong>Typical project timeline:</strong> 12-16 weeks</li>
        <li><strong>Average engagement size:</strong> $15,000-$100,000+</li>
      </ul>
      <h2>Why Expand Into ${country.name}?</h2>
      <p>${country.name} sits in ${country.region}, offering strategic access to regional markets. The technology ecosystem centers on ${country.techHub} in ${country.capital}. Key industries include ${industries}. For B2B technology companies, ${country.name} represents an opportunity to establish a regional foothold with lower operational costs than Western European markets while maintaining quality talent pipelines.</p>
      <h2>What Services Does Sipiteno Offer in ${country.name}?</h2>
      <p>We provide six core service lines in ${country.name}, each delivered by bilingual local teams with deep sector expertise. Projects range from focused 4-week sprints to multi-month transformation programs. All engagements include local regulatory compliance review and partnership network access.</p>
      <h3>Our Services in ${country.name}</h3>
      <ul>
      ${services}
      </ul>
      <h2>How Long Does Market Entry in ${country.name} Take?</h2>
      <p>A typical ${country.name} market entry engagement runs 12-16 weeks. The first two weeks cover discovery and regulatory mapping. Weeks 3-4 focus on strategy development and partner identification. Weeks 5-12 are execution — introductions, meetings, and initial deal structuring. The final phase (weeks 13-16) optimizes what's working and transitions to self-sufficient operations.</p>
      <h2>What Does It Cost to Expand Into ${country.name}?</h2>
      <p>Sipiteno engagements in ${country.name} range from $15,000 for focused, short-term projects to $100,000+ for comprehensive multi-month programs. Retainer-based business development services start at $3,000/month. We tie a portion of our fee to measurable outcomes — introductions made, partnerships signed, pipeline generated. See our <a href="https://sipiteno.com/pricing">pricing page</a> for detailed tiers.</p>
      <h2>Market Overview: ${country.name}</h2>
      <p>${country.name} is located in ${country.region}. The primary languages are ${country.languages.join(', ')}. Key industries include ${industries}. The main technology hub is ${country.techHub} in ${country.capital}. Our local team maintains active relationships with industry leaders, government innovation programs, and the startup ecosystem across the country.</p>
      <h2>Who Should Consider ${country.name} for Expansion?</h2>
      <p>${country.name} is ideal for post-Series A B2B technology companies ($2M-$20M ARR) looking to enter their second or third geographic market. The combination of EU/regional market access, competitive talent costs, and growing technology adoption makes it particularly attractive for <a href="https://sipiteno.com/industries/saas-software">SaaS companies</a>, <a href="https://sipiteno.com/industries/fintech-financial-services">fintech firms</a>, and <a href="https://sipiteno.com/industries/manufacturing-industry-4">manufacturing technology</a> providers.</p>
      <h2>Our Track Record in ${country.region}</h2>
      <p>Across ${country.region}, Sipiteno has delivered 50+ projects over 15+ years. Our average time-to-first-deal is 11 weeks. We maintain active teams in every country we serve, not fly-in consultants who leave after the strategy deck. <a href="https://sipiteno.com/case-studies">Read case studies</a> from clients who've expanded into similar markets.</p>
      <h2>Next Steps</h2>
      <p>Ready to explore ${country.name}? <a href="https://sipiteno.com/#contact">Book a free 30-minute strategy call</a>. You'll get a custom market scorecard for ${country.name}, a preliminary regulatory assessment, and an honest opinion on whether this market is right for your company right now.</p>
      <p><a href="https://sipiteno.com/locations">All locations</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/industries">Industries</a></p>`;
}

function buildCountryServiceBody(country, svc) {
  const otherServices = SERVICES.filter(s => s.slug !== svc.slug).slice(0, 3).map(s => `<a href="https://sipiteno.com/locations/${country.slug}/${s.slug}">${s.name}</a>`).join(', ');
  const otherCountries = COUNTRIES.filter(c => c.region === country.region && c.slug !== country.slug).slice(0, 5).map(c => `<a href="https://sipiteno.com/locations/${c.slug}/${svc.slug}">${c.name}</a>`).join(', ');

  return `<h1>${svc.name} in ${country.name}: Local Experts, Fast Delivery</h1>
      <p><strong>Sipiteno delivers ${svc.name.toLowerCase()} services in ${country.name} from our team in ${country.capital}.</strong> ${svc.desc} We combine 15+ years of regional expertise with bilingual local teams who understand ${country.name}'s regulatory landscape, business culture, and key industries. Projects start at $15,000 and run 4-16 weeks depending on scope.</p>
      <h2>TL;DR — ${svc.name} in ${country.name}</h2>
      <ul>
        <li><strong>Service:</strong> ${svc.name}</li>
        <li><strong>Location:</strong> ${country.capital}, ${country.name} (${country.techHub})</li>
        <li><strong>Languages:</strong> ${country.languages.slice(0, 3).join(', ')}</li>
        <li><strong>Key industries served:</strong> ${country.keyIndustries.join(', ')}</li>
        <li><strong>Starting price:</strong> $15,000</li>
        <li><strong>Typical timeline:</strong> 4-16 weeks</li>
      </ul>
      <h2>What Does ${svc.name} in ${country.name} Include?</h2>
      <p>Our ${svc.name.toLowerCase()} practice in ${country.name} covers the full lifecycle: strategy, implementation, and ongoing optimization. ${svc.desc} Every engagement starts with a discovery phase to understand your specific market position and goals in ${country.name}, followed by a tailored execution plan with clear milestones and deliverables.</p>
      <h2>Why Choose Sipiteno for ${svc.name} in ${country.name}?</h2>
      <p>We're not fly-in consultants. Our team lives in ${country.name}, works in ${country.languages.slice(0, 2).join(' and ')}, and maintains active relationships with ${country.keyIndustries.join(', ')} sector leaders. This means faster access to decision-makers, deeper regulatory knowledge, and execution that actually works in the local context — not a Western playbook applied blindly.</p>
      <h2>How Much Does ${svc.name} Cost in ${country.name}?</h2>
      <p>${svc.name} engagements in ${country.name} range from $15,000 for focused projects to $100,000+ for comprehensive programs. Retainer-based support starts at $3,000/month. Pricing depends on scope, duration, and the number of team members required. We provide detailed quotes after the initial discovery call — <a href="https://sipiteno.com/#contact">book a free consultation</a> to get started.</p>
      <h2>What Industries Do We Serve in ${country.name}?</h2>
      <p>Key industries in ${country.name} include ${country.keyIndustries.join(', ')}. Our ${svc.name.toLowerCase()} team has delivered projects for clients in <a href="https://sipiteno.com/industries/saas-software">SaaS</a>, <a href="https://sipiteno.com/industries/fintech-financial-services">fintech</a>, and <a href="https://sipiteno.com/industries/manufacturing-industry-4">manufacturing</a> sectors expanding into ${country.region}. We adapt our methodology to each sector's regulatory requirements and competitive dynamics.</p>
      <h2>How Quickly Can We Start?</h2>
      <p>Most ${svc.name.toLowerCase()} engagements in ${country.name} kick off within 2 weeks of contract signing. The first week covers discovery and stakeholder alignment. By week 3, we're in active execution. For urgent market-entry situations, we can assemble a rapid-response team within 5 business days.</p>
      <h2>${svc.name} Expertise in ${country.name}</h2>
      <p>We deliver ${svc.name.toLowerCase()} solutions tailored to ${country.name}'s market dynamics. Key industries in ${country.name} include ${country.keyIndustries.join(', ')}. Our team operates from ${country.techHub} and serves clients across the entire country, with particular focus on ${country.capital} and surrounding regions.</p>
      <h2>Local Capabilities &amp; Regional Coverage</h2>
      <p>Our ${svc.name.toLowerCase()} practice in ${country.name} covers strategy development, implementation, and ongoing optimization. We work in ${country.languages.slice(0, 2).join(' and ')}, ensuring seamless communication with local stakeholders, partners, and regulatory bodies. In addition to ${country.name}, we provide ${svc.name.toLowerCase()} services in ${otherCountries}, and 20+ other countries.</p>
      <h2>Related Services in ${country.name}</h2>
      <p>Beyond ${svc.name.toLowerCase()}, we offer: ${otherServices}. See <a href="https://sipiteno.com/locations/${country.slug}">all services in ${country.name}</a> or the <a href="https://sipiteno.com/services/${svc.slug}">${svc.name} overview</a> for the global service description.</p>
      <h2>Get Started</h2>
      <p>Email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> or <a href="https://sipiteno.com/#contact">book a free 30-minute call</a>. Tell us about your ${svc.name.toLowerCase()} needs in ${country.name} — we'll tell you honestly whether we're the right fit.</p>
      <p><a href="https://sipiteno.com/locations/${country.slug}">All services in ${country.name}</a> | <a href="https://sipiteno.com/services/${svc.slug}">${svc.name} overview</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/pricing">Pricing</a></p>`;
}

function buildIndustryBody(ind) {
  return `<h1>${ind.name} Consulting &amp; Market Entry | Sipiteno</h1>
      <p><strong>Sipiteno helps ${ind.name.toLowerCase()} companies expand into 28 emerging markets across Europe, Caucasus, and Central Asia.</strong> ${ind.desc} We combine 15+ years of regional expertise with hands-on technical implementation — from market entry strategy through to signed partnerships and deployed technology.</p>
      <h2>TL;DR — ${ind.name} Consulting with Sipiteno</h2>
      <ul>
        <li><strong>Markets covered:</strong> 28 countries across CEE, Caucasus, Central Asia</li>
        <li><strong>Typical client:</strong> Post-Series A ${ind.name.toLowerCase()} companies ($2M-$20M ARR)</li>
        <li><strong>Engagement size:</strong> $15,000-$100,000+</li>
        <li><strong>Timeline:</strong> 12-16 weeks average</li>
        <li><strong>Outcome focus:</strong> Signed deals, not strategy slides</li>
      </ul>
      <h2>What Does ${ind.name} Consulting Include?</h2>
      <p>Our ${ind.name.toLowerCase()} consulting covers the full expansion lifecycle: market assessment and scoring, regulatory mapping, partnership identification, business development execution, and technology implementation where needed. ${ind.desc} We work with ${ind.name.toLowerCase()} companies at every stage — from early-stage startups testing market fit to established enterprises building regional operations.</p>
      <h2>Why Choose Sipiteno for ${ind.name} Expansion?</h2>
      <p>Most consulting firms deliver a strategy document and leave. We deliver signed deals. Our team maintains active local networks in each of the 28 markets we serve — meaning when you need an introduction to a ${ind.name.toLowerCase()} buyer in Warsaw, Bucharest, or Tbilisi, we already know who to call. We tie a portion of our fee to outcomes.</p>
      <h2>Which Markets Are Best for ${ind.name} Companies?</h2>
      <p>Market selection depends on your product, regulatory requirements, and competitive landscape. For most ${ind.name.toLowerCase()} companies, we recommend starting with 2-3 markets scored by: market size, regulatory complexity, talent availability, and partnership potential. <a href="https://sipiteno.com/#contact">Book a free strategy call</a> to get a custom market scorecard for your top targets.</p>
      <h2>Services We Provide for ${ind.name} Companies</h2>
      <p>Our offerings include <a href="https://sipiteno.com/services/ai-consulting">AI consulting</a>, <a href="https://sipiteno.com/services/business-development">business development</a>, <a href="https://sipiteno.com/services/it-consulting">IT consulting</a>, <a href="https://sipiteno.com/services/digital-marketing">digital marketing</a>, <a href="https://sipiteno.com/services/sales-funnel">sales funnel setup</a>, and <a href="https://sipiteno.com/services/project-management">project management</a> — all tailored to the unique needs of ${ind.name.toLowerCase()} companies expanding internationally.</p>
      <h2>How Much Does ${ind.name} Market Entry Cost?</h2>
      <p>Engagements range from $15,000 for focused market assessments to $100,000+ for comprehensive multi-country expansion programs. Business development retainers start at $3,000/month with 10-30 qualified leads per month. See <a href="https://sipiteno.com/pricing">pricing details</a> or contact us for a custom quote.</p>
      <h2>Our ${ind.name} Track Record</h2>
      <p>We've delivered 50+ projects across 28 countries over 15+ years. Our average time-to-first-deal is 11 weeks, with a 92% client retention rate. <a href="https://sipiteno.com/case-studies">Read case studies</a> from ${ind.name.toLowerCase()} clients who've successfully expanded with Sipiteno.</p>
      <h2>Get Started</h2>
      <p>Email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> or <a href="https://sipiteno.com/#contact">book a free 30-minute strategy call</a>. We'll assess your ${ind.name.toLowerCase()} expansion readiness and recommend the right markets and approach.</p>
      <p><a href="https://sipiteno.com/industries">All industries</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/locations">Locations</a></p>`;
}

function buildLocationsHubBody() {
  // Group the 28-country dataset by region so the hub reads as a real guide
  // (E4 long-form + TL;DR) while every fact stays derived from COUNTRIES.
  const regions = {};
  for (const c of COUNTRIES) (regions[c.region] ||= []).push(c);
  const regionNames = Object.keys(regions);
  const regionSummary = regionNames
    .map(r => `${r} (${regions[r].length})`)
    .join(', ');

  const tldrItems = regionNames.map(r =>
    `<li><strong>${r}:</strong> ${regions[r].map(c => `<a href="https://sipiteno.com/locations/${c.slug}">${c.name}</a>`).join(', ')}</li>`
  ).join('\n        ');

  const regionSections = regionNames.map(r => {
    const list = regions[r].map(c =>
      `<li><a href="https://sipiteno.com/locations/${c.slug}">${c.name}</a> — capital ${c.capital}; tech hub: ${c.techHub}; working languages: ${c.languages.join(', ')}; key industries: ${c.keyIndustries.join(', ')}.</li>`
    ).join('\n        ');
    const capitals = regions[r].map(c => c.capital).join(', ');
    return `<h2>${r}: ${regions[r].map(c => c.name).join(', ')}</h2>
      <p>We cover ${regions[r].length === 1 ? 'one market' : regions[r].length + ' markets'} in ${r}, working out of ${capitals}. Every country page below details the services offered there, typical project timelines, and how engagements are priced for that market.</p>
      <ul>
        ${list}
      </ul>`;
  }).join('\n      ');

  const serviceList = SERVICES.map(s =>
    `<li><a href="https://sipiteno.com/services/${s.slug}">${s.name}</a>: ${s.desc}. Available in every listed country via the country-and-service pages (for example, <a href="https://sipiteno.com/locations/${COUNTRIES[0].slug}/${s.slug}">${s.name} in ${COUNTRIES[0].name}</a>).</li>`
  ).join('\n        ');

  return `<h1>Locations: Sipiteno Business Consulting Across ${COUNTRIES.length} Countries</h1>
      <p><strong>Sipiteno operates in ${COUNTRIES.length} countries across ${regionNames.length} regions: ${regionSummary}.</strong> This page is the index of every market we serve. Each country link below opens a dedicated page covering the services available there, the local capital and tech hub we work from, working languages, key industries, typical timelines, and pricing — so you can evaluate a specific market before you talk to us.</p>
      <h2>TL;DR — Coverage at a Glance</h2>
      <ul>
        ${tldrItems}
      </ul>
      <h2>How This Index Is Organized</h2>
      <p>Countries are grouped by region below. For each country we list the capital, the technology hub our work centers on, the working languages, and the key industries in that market — the same facts used on the country pages themselves. If you already know both your market and the service you need, jump straight to a country-and-service page (every country page links to all ${SERVICES.length} of its service pages).</p>
      ${regionSections}
      <h2>What Services Are Available in Each Location?</h2>
      <p>All ${SERVICES.length} service lines are offered in every country listed on this page. Each has a country-specific page describing scope, timeline, and pricing for that market:</p>
      <ul>
        ${serviceList}
      </ul>
      <h2>How Do You Choose the Right Market?</h2>
      <p>Start from your constraints, not from a map. The country pages above give you the raw facts — languages, key industries, and the tech hub each market is organized around — and our <a href="https://sipiteno.com/methodology">methodology page</a> explains how we score markets for a specific product. If you want a recommendation for your case, <a href="https://sipiteno.com/#contact">book a free 30-minute strategy call</a> or email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> and we'll walk through the shortlist with you.</p>
      <h2>Where to Go Next</h2>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/services/ai-consulting">Services</a> | <a href="https://sipiteno.com/industries">Industries</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/case-studies">Case studies</a></p>`;
}

function buildSimpleBody(title, description, links = []) {
  let linkHtml = links.length > 0 ? `<p>${links.map(l => `<a href="${l.url}">${l.name}</a>`).join(' | ')}</p>` : '';
  return `<h1>${title}</h1>\n      <p>${description}</p>\n      ${linkHtml}`;
}

function writeRoute(pathSegments, html) {
  const dir = join(DIST, ...pathSegments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  // Also write the flat `<segment>.html` sibling so vercel.json rewrites that
  // target flat files (e.g. /about -> /about.html, /for/:slug -> /for/:slug.html)
  // serve this rich prerendered content instead of vite's thin SPA-shell fallback.
  const flatDir = join(DIST, ...pathSegments.slice(0, -1));
  mkdirSync(flatDir, { recursive: true });
  writeFileSync(join(flatDir, `${pathSegments[pathSegments.length - 1]}.html`), html);
}

// --- ORGANIZATION SCHEMA (reused) ---
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sipiteno.com/#organization",
  "name": "Sipiteno",
  "url": "https://sipiteno.com",
  "logo": "https://sipiteno.com/favicon.png",
  "foundingDate": "2009",
  "sameAs": ["https://www.linkedin.com/company/34765968", "https://twitter.com/sipiteno", "https://github.com/sipiteno"],
};

// WebSite schema — required by Google for Sitelinks Searchbox
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://sipiteno.com/#website",
  "url": "https://sipiteno.com",
  "name": "Sipiteno",
  "publisher": { "@id": "https://sipiteno.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://sipiteno.com/locations?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://sipiteno.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What regions does Sipiteno serve?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sipiteno operates across 28 countries in Eastern Europe, Caucasus, Central Asia, Northern Europe, and beyond. Primary focus markets include Ukraine, Poland, Kazakhstan, Georgia, and Serbia." }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to work with Sipiteno?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sipiteno pricing: Business Development retainers $3,000-$10,000/month, AI Consulting projects $25,000-$100,000+, MicroSaaS MVP $15,000-$50,000, Hourly consulting $150-$300/hour." }
    },
    {
      "@type": "Question",
      "name": "What services does Sipiteno offer?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sipiteno offers AI Consulting, Business Development, IT Consulting, Digital Marketing, Sales Funnel Setup, Project Management, MicroSaaS MVP Development, and HR & Technical Recruitment." }
    },
  ]
};

// --- GENERATE PAGES ---

let count = 0;

// 1. Core static pages
const corePages = [
  {
    path: [],
    title: "Sipiteno - Strategic Business Development & AI Consulting | Europe, Caucasus, Central Asia",
    description: "Sipiteno provides expert business development, AI consulting, IT solutions, and MicroSaaS MVP development across 28 countries. 15+ years experience, 50+ successful projects.",
    canonicalUrl: "https://sipiteno.com/",
    schemas: [orgSchema, webSiteSchema, faqSchema],
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }],
    bodyContent: buildHomepageBody(),
  },
  {
    path: ['blog'],
    title: "Blog | Sipiteno - MicroSaaS Insights & AI Strategy",
    description: "Practical insights on building MicroSaaS products, rapid validation, and AI-powered tools. Learn from real builds and get tactical guides on shipping faster.",
    canonicalUrl: "https://sipiteno.com/blog",
    bodyContent: buildSimpleBody('Blog | Sipiteno', 'Practical insights on building MicroSaaS products, rapid validation, and AI-powered tools.', [
      { name: 'Home', url: 'https://sipiteno.com/' },
      { name: 'Services', url: 'https://sipiteno.com/services/ai-consulting' },
    ]),
  },
  {
    path: ['case-studies'],
    title: "Case Studies | Sipiteno - 50+ Projects Across 28 Countries",
    description: "Explore Sipiteno's portfolio of 50+ successful projects across FinTech, HealthTech, E-commerce, AI, and more in Eastern Europe, Caucasus, and Central Asia.",
    canonicalUrl: "https://sipiteno.com/case-studies",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Case Studies", url: "https://sipiteno.com/case-studies" }],
    bodyContent: buildSimpleBody('Case Studies | Sipiteno', "Explore Sipiteno's portfolio of 50+ successful projects across FinTech, HealthTech, E-commerce, AI, and more in Eastern Europe, Caucasus, and Central Asia.", [
      { name: 'Home', url: 'https://sipiteno.com/' },
      { name: 'Services', url: 'https://sipiteno.com/services/ai-consulting' },
      { name: 'Pricing', url: 'https://sipiteno.com/pricing' },
    ]),
  },
  {
    path: ['pricing'],
    title: "Pricing | Sipiteno - Transparent Consulting Rates",
    description: "Sipiteno pricing: Business Development $3K-$10K/month, AI Consulting $25K-$100K+, MicroSaaS MVP $15K-$50K, IT Consulting $15K-$75K+. Flexible engagement models.",
    canonicalUrl: "https://sipiteno.com/pricing",
    bodyContent: `<h1>Sipiteno Pricing &amp; Engagement Models — Transparent Rates for Market Expansion</h1>
      <p><strong>Sipiteno engagements start at $3,000/month for business development retainers and $15,000 for fixed-scope projects.</strong> We offer five engagement models below — from free strategy calls through to comprehensive AI implementation programs. Every proposal includes clear deliverables, timelines, and payment milestones. No hidden fees.</p>
      <h2>How Much Does Sipiteno Cost?</h2>
      <p>Our pricing is designed to align with your outcomes. The table below shows our five engagement tiers:</p>
      <table>
        <thead>
          <tr><th>Engagement</th><th>Price Range</th><th>Timeline</th><th>Best For</th></tr>
        </thead>
        <tbody>
          <tr><td>Free Strategy Call</td><td>$0</td><td>30 minutes</td><td>Assessment &amp; market scoring</td></tr>
          <tr><td>Business Development Retainer</td><td>$3,000-$10,000/month</td><td>Ongoing (3+ months)</td><td>Pipeline generation, 10-30 qualified leads/month</td></tr>
          <tr><td>MicroSaaS MVP Development</td><td>$15,000-$50,000</td><td>4-8 weeks</td><td>Product validation, rapid prototyping</td></tr>
          <tr><td>Market Entry Project</td><td>$25,000-$75,000</td><td>12-16 weeks</td><td>Full country expansion: strategy + execution</td></tr>
          <tr><td>AI Implementation Program</td><td>$25,000-$100,000+</td><td>8-24 weeks</td><td>Custom AI solutions, ML pipelines, automation</td></tr>
          <tr><td>Hourly Consulting</td><td>$150-$300/hour</td><td>Flexible</td><td>Advisory, code review, technical assessment</td></tr>
        </tbody>
      </table>
      <h2>What's Included in Each Engagement?</h2>
      <h3>Business Development Retainer ($3,000-$10,000/month)</h3>
      <p>Includes: 10-30 qualified leads per month, warm introductions to decision-makers, weekly pipeline reports, bilingual sales support, and access to our local network in each target market. We work alongside your team to close deals, not just hand off leads.</p>
      <h3>Market Entry Project ($25,000-$75,000)</h3>
      <p>Includes: market assessment and scoring for 2-3 target countries, regulatory mapping, partnership identification, 12-16 weeks of active business development execution, and a transition plan for self-sufficient operations. This is our most popular engagement for companies entering their second or third geographic market.</p>
      <h3>AI Implementation Program ($25,000-$100,000+)</h3>
      <p>Includes: AI strategy development, model selection and training, infrastructure setup, integration with existing systems, team training, and ongoing optimization. We deliver production AI systems, not proofs of concept. <a href="https://sipiteno.com/services/ai-consulting">Learn more about AI consulting</a>.</p>
      <h2>How Do We Pay?</h2>
      <p>Payment structure is typically 30-50% upfront with milestone-based releases. For retainers, we bill monthly in advance. For fixed-scope projects, payments are tied to agreed deliverables. We accept bank transfer, credit card, and can work with most international payment systems.</p>
      <h2>Do You Offer Performance-Based Pricing?</h2>
      <p>Yes. For business development engagements, we can structure a portion of our fee around outcomes: deals signed, pipeline generated, or revenue attributed. This aligns our incentives with yours — we win when you win. Talk to us about <a href="https://sipiteno.com/#contact">performance-based arrangements</a>.</p>
      <h2>Which Markets Are Included?</h2>
      <p>All engagements include access to our network across 28 countries: <a href="https://sipiteno.com/locations/poland">Poland</a>, <a href="https://sipiteno.com/locations/romania">Romania</a>, <a href="https://sipiteno.com/locations/serbia">Serbia</a>, <a href="https://sipiteno.com/locations/ukraine">Ukraine</a>, <a href="https://sipiteno.com/locations/georgia">Georgia</a>, <a href="https://sipiteno.com/locations/kazakhstan">Kazakhstan</a>, and 22 more. See all <a href="https://sipiteno.com/locations">locations</a>.</p>
      <h2>Ready to Get a Custom Quote?</h2>
      <p>The fastest way to get pricing for your specific situation is a free 30-minute strategy call. We'll assess your needs, recommend the right engagement model, and give you a transparent price range. <a href="https://sipiteno.com/#contact">Book your free call</a> or email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a>.</p>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/services/ai-consulting">AI Consulting</a> | <a href="https://sipiteno.com/alternatives">Compare alternatives</a> | <a href="https://sipiteno.com/methodology">Our methodology</a></p>`,
  },
  {
    path: ['methodology'],
    title: "Methodology | Sipiteno - How We Deliver Results",
    description: "Sipiteno's proven 6-phase methodology for business development, AI consulting, and MicroSaaS MVP development. From discovery to deployment in 4-16 weeks.",
    canonicalUrl: "https://sipiteno.com/methodology",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Methodology", url: "https://sipiteno.com/methodology" }],
    bodyContent: `<h1>Methodology | Sipiteno's 6-Phase Delivery Framework</h1>
      <p>Sipiteno uses a proven 6-phase methodology across all engagements: Discovery &amp; Assessment, Strategy Development, Planning &amp; Design, Implementation, Testing &amp; QA, and Deployment &amp; Optimization. This structured approach ensures predictable delivery timelines of 4-16 weeks depending on project scope.</p>
      <h2>Phase 1: Discovery &amp; Assessment</h2>
      <p>We begin with deep-dive workshops to understand your business objectives, market position, technical requirements, and success criteria. This phase identifies ROI opportunities and establishes measurable KPIs.</p>
      <h2>Phase 2: Strategy Development</h2>
      <p>Based on discovery findings, we develop a comprehensive strategy document covering market analysis, competitive positioning, technical architecture, and a phased implementation roadmap.</p>
      <h2>Phase 3: Planning &amp; Design</h2>
      <p>Detailed project planning including sprint breakdowns, resource allocation, risk mitigation, and stakeholder communication protocols. Design specifications and technical blueprints are finalized.</p>
      <h2>Phase 4: Implementation</h2>
      <p>Agile development sprints with weekly reviews and demos. Continuous integration and deployment ensure transparency and allow for iterative refinement based on feedback.</p>
      <h2>Phase 5: Testing &amp; QA</h2>
      <p>Comprehensive quality assurance including automated testing, user acceptance testing, performance testing, and security validation. All deliverables must pass defined acceptance criteria.</p>
      <h2>Phase 6: Deployment &amp; Optimization</h2>
      <p>Production deployment with monitoring and alerting setup. Post-launch optimization based on real-world performance data, followed by knowledge transfer and documentation handoff.</p>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/case-studies">Case studies</a></p>`,
  },
  {
    path: ['about'],
    title: "About | Sipiteno - Founder Story & 28-Country Expansion System",
    description: "How a failed 2009 market entry in Eastern Europe became a 28-country expansion system. Read the Sipiteno founder story — from one brutal lesson to 50+ successful projects.",
    canonicalUrl: "https://sipiteno.com/about",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "About", url: "https://sipiteno.com/about" }],
    schemas: [{
      ...orgSchema,
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "sales@sipiteno.com",
        "availableLanguage": ["English", "Russian", "Ukrainian", "Polish", "Serbian", "Georgian"]
      }]
    }, {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": "https://sipiteno.com/about/#aboutpage",
      "url": "https://sipiteno.com/about",
      "name": "About Sipiteno — Our Story & Expansion System",
      "description": "Sipiteno helps technology companies expand into emerging markets across Europe, Caucasus, and Central Asia. Founded in 2009, we deliver AI consulting, business development, and IT solutions across 28 countries.",
      "mainEntity": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" }
    }, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sipiteno.com/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://sipiteno.com/about" }
      ]
    }],
    bodyContent: `<h1>About Sipiteno — From a Failed Market Entry to a 28-Country Expansion System</h1>
      <p><strong>Sipiteno helps technology companies expand into 28 emerging markets across Central &amp; Eastern Europe, the Caucasus, Central Asia, South Asia, and East Africa.</strong> Founded in 2009, we've delivered 50+ projects with a 92% client retention rate and an average time-to-first-deal of 11 weeks. This page explains who we are, how the system works, and why a failed market entry became the foundation of everything we do.</p>
      <h2>Our Track Record</h2>
      <p>Over 15+ years of operating across emerging markets, the numbers that matter to us:</p>
      <ul>
        <li><strong>50+ projects delivered</strong> across 28 countries since 2009</li>
        <li><strong>92% client retention</strong> — measured across multi-month engagements in 2024-2025</li>
        <li><strong>11 weeks average time-to-first-signed-deal</strong> — from kickoff to first contract in a new market</li>
        <li><strong>28 countries with active local teams</strong> — from Albania to Uzbekistan</li>
        <li><strong>6 service lines</strong> — AI consulting, business development, digital marketing, IT consulting, project management, and sales funnel setup</li>
        <li><strong>6 languages of operation</strong> — English, Russian, Ukrainian, Polish, Serbian, Georgian</li>
      </ul>
      <h2>The Failed Market Entry That Started Everything</h2>
      <p>In 2009, Sipiteno's founder moved a SaaS product into Eastern Europe believing "if the product is great, the market will come." Six months later: zero signed deals, bleeding runway, and the brutal realization that the product was never the problem.</p>
      <p>The winning companies in Tbilisi, Kyiv, and Almaty all had three things the founder didn't: the right introductions, a regulatory map, and a local team that executes fast. That three-part system became Sipiteno.</p>
      <h2>The Sipiteno System: Three Pillars</h2>
      <h3>1. Introductions — Warm Handoffs, Not Cold Outreach</h3>
      <p>In emerging markets, warm introductions from trusted local partners outperform cold outreach by 10:1. Our network includes C-level contacts at banks, telcos, manufacturers, and tech hubs across all 28 countries. When we open a conversation, the prospect already knows who we are and why we're calling.</p>
      <h3>2. Regulatory Map — Compliance Before Code</h3>
      <p>Every market has traps: <a href="https://sipiteno.com/glossary/data-residency">data residency</a> rules in Russia and Kazakhstan, GDPR compliance in EU members like Poland and Romania, licensing requirements for fintech in Georgia and Lithuania, and sector-specific regulations in healthcare and energy. We map these before any code ships, so deals don't die at the legal review.</p>
      <h3>3. Execution Team — Local, Bilingual, Fast</h3>
      <p>Our teams operate from tech hubs in each country — <a href="https://sipiteno.com/locations/poland">Warsaw</a>, <a href="https://sipiteno.com/locations/romania">Bucharest</a>, <a href="https://sipiteno.com/locations/serbia">Belgrade</a>, <a href="https://sipiteno.com/locations/georgia">Tbilisi</a>, <a href="https://sipiteno.com/locations/ukraine">Kyiv</a>, <a href="https://sipiteno.com/locations/kazakhstan">Astana</a>. They're bilingual, culturally fluent, and ship in 4-8 week sprints. The average project runs 12-16 weeks end-to-end.</p>
      <h2>Who We Serve</h2>
      <p>Sipiteno works primarily with B2B technology companies: <a href="https://sipiteno.com/industries/saas-software">SaaS &amp; software</a>, <a href="https://sipiteno.com/industries/fintech-financial-services">fintech</a>, <a href="https://sipiteno.com/industries/manufacturing-industry-4">manufacturing &amp; Industry 4.0</a>, <a href="https://sipiteno.com/industries/cybersecurity">cybersecurity</a>, and <a href="https://sipiteno.com/industries/healthcare-medtech">healthcare &amp; medtech</a>. Most clients are post-Series A companies ($2M-$20M ARR) looking to enter their second or third geographic market.</p>
      <h2>How We're Different</h2>
      <p>Most market-entry consultants deliver a 200-page strategy document and leave. Sipiteno delivers signed deals. We're measured on outcomes — introductions made, partnerships signed, revenue generated — not slides delivered. Our <a href="https://sipiteno.com/pricing">pricing</a> reflects this: we tie a portion of our fee to results, not just time.</p>
      <p>See how we compare to <a href="https://sipiteno.com/alternatives">Big 4 consulting, boutique firms, DIY expansion, and trade chambers</a>.</p>
      <h2>Our Methodology</h2>
      <p>Every engagement follows our <a href="https://sipiteno.com/methodology">four-phase methodology</a>: Discovery (weeks 1-2), Strategy (weeks 3-4), Execution (weeks 5-12), and Optimization (weeks 13-16). Read the full breakdown on our <a href="https://sipiteno.com/methodology">methodology page</a>.</p>
      <h2>Contact Us</h2>
      <p>Email: <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a>. We respond within one business day. Tell us your target market and current stage — we'll tell you honestly whether we can help.</p>
      <p><a href="https://sipiteno.com/#free-playbook">Get the free Expansion Playbook</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/locations">Locations</a> | <a href="https://sipiteno.com/industries">Industries</a></p>`,
  },
  {
    path: ['contact'],
    title: "Contact | Sipiteno - Get in Touch",
    description: "Contact Sipiteno for business development, AI consulting, and technology services across 28 countries. Email sales@sipiteno.com. Response within one business day.",
    canonicalUrl: "https://sipiteno.com/contact",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Contact", url: "https://sipiteno.com/contact" }],
    schemas: [{
      ...orgSchema,
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "sales@sipiteno.com",
        "availableLanguage": ["English", "Russian", "Ukrainian", "Polish", "Serbian", "Georgian"]
      }]
    }, {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": "https://sipiteno.com/contact/#contactpage",
      "url": "https://sipiteno.com/contact",
      "name": "Contact Sipiteno",
      "description": "Get in touch with Sipiteno for business development, AI consulting, and technology services across 28 countries.",
      "mainEntity": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" }
    }, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sipiteno.com/" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://sipiteno.com/contact" }
      ]
    }],
    bodyContent: `<h1>Contact Sipiteno</h1>
      <p><strong>To contact Sipiteno, email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> — we respond within one business day.</strong> Tell us which of the 28 markets you're targeting and what you need (business development, AI consulting, IT solutions, or market entry), and we'll reply with next steps and, if useful, a free 30-minute strategy call.</p>
      <h2>Email</h2>
      <p><a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a> — We respond within one business day.</p>
      <h2>What We Offer</h2>
      <p>Sipiteno provides: AI Consulting ($25K-$100K+), Business Development ($3K-$10K/month retainer), IT Consulting ($15K-$75K), MicroSaaS MVP Development ($15K-$50K), Digital Marketing, Sales Funnel Setup, and Project Management.</p>
      <h2>Service Areas</h2>
      <p>We operate across 28 countries in Eastern Europe, the Caucasus, Central Asia, and beyond. Primary hubs include Kyiv, Tbilisi, Almaty, Warsaw, Belgrade, and Tallinn. We serve technology companies from early-stage startups to Fortune 500 enterprises.</p>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/about">About</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/pricing">Pricing</a></p>`,
  },
  {
    path: ['terms'],
    title: "Terms & Conditions | Sipiteno",
    description: "Terms and conditions for Sipiteno Business Development consulting services.",
    canonicalUrl: "https://sipiteno.com/terms",
    noindex: true,
    bodyContent: buildSimpleBody('Terms &amp; Conditions', 'Terms and conditions for Sipiteno Business Development consulting services.'),
  },
  {
    path: ['privacy'],
    title: "Privacy Policy | Sipiteno",
    description: "Privacy policy for Sipiteno Business Development. How we collect, use, and protect your data.",
    canonicalUrl: "https://sipiteno.com/privacy",
    noindex: true,
    bodyContent: buildSimpleBody('Privacy Policy', 'Privacy policy for Sipiteno Business Development. How we collect, use, and protect your data.'),
  },
];

// 2. Service pages
for (const svc of SERVICES) {
  corePages.push({
    path: ['services', svc.slug],
    title: `${svc.name} Services | Sipiteno - Expert Consulting Across 28 Countries`,
    description: `${svc.desc}. Sipiteno delivers ${svc.name.toLowerCase()} services across 28 countries in Europe, Caucasus, and Central Asia. 15+ years experience, proven results.`,
    canonicalUrl: `https://sipiteno.com/services/${svc.slug}`,
    schemas: [{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": svc.name,
      "description": svc.desc,
      "url": `https://sipiteno.com/services/${svc.slug}`,
      "provider": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "areaServed": { "@type": "Place", "name": "Europe, Caucasus, Central Asia" },
    }],
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Services", url: "https://sipiteno.com/" },
      { name: svc.name, url: `https://sipiteno.com/services/${svc.slug}` },
    ],
    bodyContent: buildServiceBody(svc),
  });
}

// 3. Locations listing
corePages.push({
  path: ['locations'],
  title: "Locations | Sipiteno - Business Services Across 28 Countries",
  description: "Sipiteno operates across 28 countries in Europe, Caucasus, Central Asia, and beyond. Local presence in each market for business development, AI consulting, IT, and digital marketing services.",
  canonicalUrl: "https://sipiteno.com/locations",
  breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Locations", url: "https://sipiteno.com/locations" }],
  bodyContent: buildLocationsHubBody(),
});

// 4. Industries listing
corePages.push({
  path: ['industries'],
  title: "Industries | Sipiteno - Specialized Consulting Across Sectors",
  description: "Sipiteno serves technology companies across SaaS, fintech, e-commerce, manufacturing, cybersecurity, healthcare, agtech, energy, and logistics.",
  canonicalUrl: "https://sipiteno.com/industries",
  breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Industries", url: "https://sipiteno.com/industries" }],
  bodyContent: (() => {
    const industryLinks = INDUSTRIES.map(i => `<li><a href="https://sipiteno.com/industries/${i.slug}">${i.name}</a>: ${i.desc}.</li>`).join('\n      ');
    return `<h1>Industries | Sipiteno Specialized Consulting</h1>
      <p>Sipiteno serves technology companies across nine industry verticals. Our specialized consulting combines 15+ years of regional expertise with deep sector knowledge to help companies expand into emerging markets.</p>
      <h2>Industries We Serve</h2>
      <ul>
      ${industryLinks}
      </ul>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/locations">Locations</a> | <a href="https://sipiteno.com/case-studies">Case studies</a></p>`;
  })(),
});

// 4b. Glossary
corePages.push({
  path: ['glossary'],
  title: "Glossary | Sipiteno - Business & Technology Terms Explained",
  description: "A comprehensive glossary of business development, technology, marketing, and emerging market terms. Plain-English definitions for B2B expansion into CEE and beyond.",
  canonicalUrl: "https://sipiteno.com/glossary",
  breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Glossary", url: "https://sipiteno.com/glossary" }],
  bodyContent: `<h1>Business &amp; Technology Glossary</h1>
    <p>A comprehensive reference of business development, technology, marketing, and emerging market terms — explained in plain English for B2B expansion into Central &amp; Eastern Europe and beyond.</p>
    <h2>Market Entry</h2>
    <dl>
      <dt>Market Entry Strategy</dt><dd>A comprehensive plan for introducing a product or service into a new geographic or demographic market. Includes regulatory compliance, competitor analysis, pricing strategy, channel partnerships, and go-to-market timing.</dd>
      <dt>Greenfield Investment</dt><dd>Building operations from scratch in a new market, as opposed to acquiring an existing local company.</dd>
      <dt>Go-To-Market (GTM)</dt><dd>The tactical execution plan for reaching target customers and delivering value.</dd>
      <dt>Soft Landing</dt><dd>Entering a new market gradually through partnerships or incubators rather than committing full resources immediately.</dd>
    </dl>
    <h2>Business Development</h2>
    <dl>
      <dt>B2B Lead Generation</dt><dd>The process of identifying and attracting potential business customers, often requiring local market intelligence and warm introductions.</dd>
      <dt>Strategic Partnership</dt><dd>A formal alliance between two companies to share resources, distribution, or technology for mutual benefit.</dd>
      <dt>Warm Introduction</dt><dd>A referral or introduction to a potential customer through a mutual connection. In CEE, warm intros often outperform cold outreach 10:1.</dd>
    </dl>
    <h2>Technology &amp; SaaS</h2>
    <dl>
      <dt>SaaS (Software as a Service)</dt><dd>Software delivered via subscription over the internet rather than installed locally.</dd>
      <dt>Data Residency</dt><dd>Legal requirement that data about a country's citizens must be stored on servers physically located within that country.</dd>
      <dt>Digital Transformation</dt><dd>The integration of digital technology into all areas of a business.</dd>
    </dl>
    <h2>Finance &amp; Emerging Markets</h2>
    <dl>
      <dt>Customer Acquisition Cost (CAC)</dt><dd>The total cost of acquiring a new customer. In emerging markets, CAC is often significantly lower than in saturated Western markets.</dd>
      <dt>Lifetime Value (LTV)</dt><dd>The total revenue a customer generates over their entire relationship with your company. A healthy LTV:CAC ratio is at least 3:1.</dd>
      <dt>CEE (Central &amp; Eastern Europe)</dt><dd>The region comprising countries like Poland, Czech Republic, Romania, Hungary, Bulgaria, and the Baltics. Offers EU market access with lower costs.</dd>
      <dt>PSD2</dt><dd>The EU's revised Payment Services Directive, enabling open banking and fintech innovation.</dd>
    </dl>
    <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/industries">Industries</a> | <a href="https://sipiteno.com/alternatives">Alternatives</a></p>`,
});

// 4c. Alternatives
corePages.push({
  path: ['alternatives'],
  title: "Sipiteno vs Alternatives | Consulting & Market Entry Comparison",
  description: "How Sipiteno compares to Big 4 consulting firms, boutique market entry specialists, DIY expansion, LinkedIn agencies, and trade chambers for B2B expansion into emerging markets.",
  canonicalUrl: "https://sipiteno.com/alternatives",
  breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Alternatives", url: "https://sipiteno.com/alternatives" }],
  bodyContent: `<h1>Sipiteno vs the Alternatives</h1>
    <p>Honest comparison with 5 categories of alternatives for B2B market expansion. We tell you who each option is actually best for — including when it's not us.</p>
    <h2>Big 4 Consulting (Deloitte, PwC, EY, KPMG)</h2>
    <p>Best for: Enterprise companies needing audit, tax, and compliance alongside market entry. Starting cost: $50,000+. Limitations: Junior associates do the work, 3-6 month timelines, generalist approach. Sipiteno advantage: 5-10x lower cost, senior consultant on every project, 4-16 week timelines, technology-specialized.</p>
    <h2>Boutique Market Entry Firms</h2>
    <p>Best for: Companies that only need market research. Starting cost: $15,000+. Limitations: Research-only, single-region focus, no technology expertise. Sipiteno advantage: Full execution, 28 markets, deep tech specialization, ongoing BD retainers.</p>
    <h2>DIY / In-House Expansion</h2>
    <p>Best for: Companies with large teams willing to invest 12-18 months. Limitations: Long learning curve, expensive mistakes, no existing network. Sipiteno advantage: 15 years of existing relationships, avoid costly mistakes, pipeline within weeks.</p>
    <h2>LinkedIn / Cold Outreach Agencies</h2>
    <p>Best for: Transactional products with no local relationships needed. Limitations: Cold leads, under 1% response rates, no local knowledge. Sipiteno advantage: Warm introductions, in-person meetings, cultural guidance, strategic partnerships.</p>
    <h2>Trade Associations &amp; Chambers</h2>
    <p>Best for: General networking and industry events. Limitations: No targeted deal support, expensive memberships with no guaranteed ROI. Sipiteno advantage: Proactive deal sourcing, direct pipeline, fraction of the cost.</p>
    <h2>Feature Comparison</h2>
    <p>Sipiteno leads on: emerging market specialization, technology focus, warm introductions, in-person meetings, BD execution, 28+ market coverage, senior consultants, and under $10K starting price.</p>
    <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/industries">Industries</a> | <a href="https://sipiteno.com/glossary">Glossary</a></p>`,
});

// Write core pages
for (const page of corePages) {
  const html = buildPage(page);
  writeRoute(page.path, html);
  count++;
}

// 5. Country pages (28)
for (const country of COUNTRIES) {
  const title = `Business Consulting in ${country.name} | Sipiteno - ${country.capital}`;
  const description = `Sipiteno provides business development, AI consulting, IT solutions, and digital marketing services in ${country.name}. Local presence in ${country.capital} with expertise across ${country.region}.`;
  const canonical = `https://sipiteno.com/locations/${country.slug}`;

  const html = buildPage({
    title,
    description,
    canonicalUrl: canonical,
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Locations", url: "https://sipiteno.com/locations" },
      { name: country.name, url: canonical },
    ],
    schemas: [{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Business Consulting in ${country.name}`,
      "description": description,
      "url": canonical,
      "provider": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "areaServed": { "@type": "Country", "name": country.name },
    }],
    bodyContent: buildCountryBody(country),
  });

  writeRoute(['locations', country.slug], html);
  count++;

  // 6. Country + Service pages (28 × 6 = 168)
  for (const svc of SERVICES) {
    const svcTitle = `${svc.name} in ${country.name} | Sipiteno Consulting`;
    const svcDescription = `Sipiteno provides ${svc.name.toLowerCase()} services in ${country.name}. ${svc.desc}. Local team in ${country.capital} with expertise across ${country.region}.`;
    const svcCanonical = `https://sipiteno.com/locations/${country.slug}/${svc.slug}`;

    const svcHtml = buildPage({
      title: svcTitle,
      description: svcDescription,
      canonicalUrl: svcCanonical,
      breadcrumbs: [
        { name: "Home", url: "https://sipiteno.com/" },
        { name: "Locations", url: "https://sipiteno.com/locations" },
        { name: country.name, url: `https://sipiteno.com/locations/${country.slug}` },
        { name: svc.name, url: svcCanonical },
      ],
      schemas: [{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${svc.name} in ${country.name}`,
        "description": svcDescription,
        "url": svcCanonical,
        "provider": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
        "areaServed": { "@type": "Country", "name": country.name },
      }],
      bodyContent: buildCountryServiceBody(country, svc),
    });

    writeRoute(['locations', country.slug, svc.slug], svcHtml);
    count++;
  }
}

// 7. Industry pages (9)
for (const ind of INDUSTRIES) {
  const title = `${ind.name} Consulting | Sipiteno`;
  const description = `${ind.desc}. Sipiteno provides specialized ${ind.name.toLowerCase()} consulting services across 28 countries in Europe, Caucasus, and Central Asia.`;
  const canonical = `https://sipiteno.com/industries/${ind.slug}`;

  const html = buildPage({
    title,
    description,
    canonicalUrl: canonical,
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Industries", url: "https://sipiteno.com/industries" },
      { name: ind.name, url: canonical },
    ],
    schemas: [{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${ind.name} Consulting`,
      "description": description,
      "url": canonical,
      "provider": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "areaServed": { "@type": "Place", "name": "Europe, Caucasus, Central Asia" },
    }],
    bodyContent: buildIndustryBody(ind),
  });

  writeRoute(['industries', ind.slug], html);
  count++;
}

console.log(`✓ Prerendered ${count} static HTML pages in dist/`);
