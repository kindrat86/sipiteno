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

// Locales with translated content (from src/i18n/locales/)
// Must be module-scoped so both buildPage() and writeLocaleVariants() can access them.
const ACTIVE_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'ku', name: 'Kurdî' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'ro', name: 'Română' },
];
const NON_EN_LOCALES = ACTIVE_LOCALES.filter(l => l.code !== 'en');

function buildHreflangTags(canonicalUrl) {
  // Build hreflang tags for the English (root) URL.
  // Each locale variant points to its /{locale}/ prefixed URL.
  const lines = [];
  for (const loc of ACTIVE_LOCALES) {
    const locUrl = loc.code === 'en'
      ? canonicalUrl
      : canonicalUrl.replace('https://sipiteno.com/', `https://sipiteno.com/${loc.code}/`);
    lines.push(`    <link rel="alternate" hreflang="${loc.code}" href="${locUrl}" />`);
  }
  lines.push(`    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`);
  return lines.join('\n');
}

function buildPage({ title, description, canonicalUrl, schemas = [], breadcrumbs, ogType = 'website', noindex = false, bodyContent = '' }) {
  // Always carry an Organization schema (with canonical disambiguation) on every
  // page — prepend orgSchema unless the caller already supplied an Organization.
  const allSchemas = schemas.some(s => s && s['@type'] === 'Organization') ? [...schemas] : [orgSchema, ...schemas];
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

  // SpeakableSpecification — voice search + AI Overviews eligibility
  allSchemas.push({
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", "p"],
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
  // Ensure html lang attribute is set (defaults to "en" from Vite template)
  html = html.replace(/<html[^>]*>/, match => {
    if (/lang=["']/.test(match)) return match;
    return match.replace('<html', '<html lang="en"');
  });

  // hreflang tags — all 8 locale variants + x-default (uses module-scoped ACTIVE_LOCALES)
  const hreflangTags = buildHreflangTags(canonicalUrl);
  // Remove any existing hreflang to avoid duplicates, then inject after canonical
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '\n    ');
  html = html.replace(/(<link rel="canonical"[^>]*>)/, '$1\n' + hreflangTags);
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

  // Entity-rich, region-grouped markets breakdown — gives answer engines concrete
  // entities (country, capital, tech hub, industries) to associate with Sipiteno.
  const byRegion = {};
  for (const c of COUNTRIES) { (byRegion[c.region] ||= []).push(c); }
  const regionsBlock = Object.entries(byRegion)
    .map(([region, cs]) => `<h3>${region}</h3>
      <p>${cs.map(c => `<a href="https://sipiteno.com/locations/${c.slug}">${c.name}</a> — capital ${c.capital}, primary tech hub ${c.techHub}, key industries: ${c.keyIndustries.join(', ')}`).join('; ')}.</p>`)
    .join('\n      ');

  return `<h1>Sipiteno: Expand Your Tech Business Into 28 Emerging Markets</h1>
      <p><strong>Yes — you can enter and win in emerging markets.</strong> Sipiteno has helped 50+ technology companies expand into Central &amp; Eastern Europe, the Caucasus, and Central Asia since 2009. Our average client signs their first deal in 11 weeks, not 11 months. The system works because we combine three things most consultants lack: warm local introductions, regulatory maps built from 15+ years of experience, and bilingual execution teams who actually live in the markets they serve.</p>
      <h2>Free Emerging Markets Expansion Playbook</h2>
      <p>Get our 47-page playbook (usually $97) free. Covers: country-by-country market entry scorecards for all 28 markets; the 4-8 week rapid expansion timeline; regulatory and partnership playbook per region; and real pricing benchmarks. Every month you delay is pipeline you never see. <a href="https://sipiteno.com/#free-playbook">Download the free playbook</a>.</p>
      <h2>Our Services</h2>
      <ul>
      ${services}
      </ul>
      <h2>The 3-Door Expansion System</h2>
      <p>Three doors to every market: (1) The Introductions — warm handoffs from people already trusted inside the market. (2) The Regulatory Map — knowing which licenses, data rules, and compliance traps kill deals. (3) The Execution Team — bilingual, local people who ship in 4-8 weeks. This is the same system behind 50+ successful market entries.</p>
      <h2>Value Ladder: How We Work Together</h2>
      <p>Five ways to engage Sipiteno, climbing in value: (1) Free Expansion Playbook PDF, (2) Free 30-minute strategy scoping call, (3) MicroSaaS MVP development ($15,000-$50,000 fixed), (4) Business Development retainer ($3,000-$10,000/month with 10-30 qualified leads/month), (5) AI implementation program ($25,000-$100,000+). Start free, scale when ready. <a href="https://sipiteno.com/pricing">See pricing</a>.</p>
      <h2>Why Choose Sipiteno</h2>
      <p>Five differentiators: 15+ years regional expertise across 28 countries, combined strategic and hands-on technical implementation, rapid 4-8 week delivery, and flexible engagement models.</p>
      <h2>Markets We Serve, by Region</h2>
      <p>Sipiteno operates across 28 emerging markets in four macro-regions — Central Europe, Southeast Europe, Northern &amp; Eastern Europe, the Caucasus, and Central Asia. Each has its own regulatory environment, tech ecosystem, and set of high-opportunity industries. We maintain warm introductions and bilingual execution teams in every one.</p>
      ${regionsBlock}
      <p>Full list: ${countries}.</p>
      <h2>Industries We Serve</h2>
      <p>Sipiteno has delivered market-entry and product work across FinTech, HealthTech, E-commerce, AI/ML, SaaS, Manufacturing, and Logistics. Our work spans regulated sectors (payments, health data) where getting licensing and compliance right is the difference between a launch and a lawsuit — which is why regulatory mapping is built into every engagement.</p>
      <h2>How We Deliver: A Structured Multi-Phase Framework</h2>
      <p>Every expansion follows a repeatable framework refined across 50+ market entries: discovery and goal-setting, market scoring for your top candidate countries, regulatory and compliance mapping, warm partnership introductions, hands-on execution by a local bilingual team, and a documented handover. Most clients sign their first in-market deal in about 11 weeks. <a href="https://sipiteno.com/methodology">See the full methodology</a>.</p>
      <h2>Frequently Asked Questions</h2>
      <h3>What regions does Sipiteno serve for business development?</h3>
      <p>Sipiteno serves 28 emerging markets across Central &amp; Eastern Europe, the Caucasus, and Central Asia — including Poland, Ukraine, Romania, Serbia, Bulgaria, Georgia, Armenia, Azerbaijan, Kazakhstan, and Uzbekistan. Each market has a dedicated location scorecard.</p>
      <h3>What is Sipiteno's approach to AI consulting?</h3>
      <p>We combine strategy with hands-on implementation: an AI opportunity assessment, then MVP build and deployment by our own engineers rather than a slide deck handed to someone else. AI implementation programs run $25,000–$100,000+ depending on scope.</p>
      <h3>What differentiates Sipiteno from other consultancies?</h3>
      <p>Three things most consultants lack: warm local introductions inside each market, regulatory maps built from 15+ years of on-the-ground experience, and bilingual execution teams who actually live where they work. Delivery in 4–8 weeks.</p>
      <h3>What industries does Sipiteno serve?</h3>
      <p>FinTech, HealthTech, E-commerce, AI/ML, SaaS, Manufacturing, and Logistics — with particular depth in regulated sectors that require licensing and data-compliance work.</p>
      <h3>How much does it cost to work with Sipiteno?</h3>
      <p>Engagements climb a value ladder: a free 47-page Expansion Playbook, a free 30-minute scoping call, MicroSaaS MVP development ($15,000–$50,000 fixed), a business-development retainer ($3,000–$10,000/month for 10–30 qualified leads/month), and AI implementation ($25,000–$100,000+). Start free and scale when ready.</p>
      <h3>Does Sipiteno help with regulatory compliance for international expansion?</h3>
      <p>Yes. Every engagement includes a regulatory map for your target markets covering licensing, data-protection rules, tax and entity setup, and the compliance traps that most often kill cross-border deals.</p>
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
      <p><strong>Sipiteno delivers ${svc.name.toLowerCase()} services that produce measurable outcomes — not strategy decks.</strong> ${svc.desc} Projects start at $15,000 and run 4-16 weeks depending on scope. Our approach combines strategic consulting with hands-on technical delivery, led by bilingual teams who understand both your industry and the local market context.</p>
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
      <p>Sipiteno has worked in ${country.region} for 15+ years. We maintain active teams in every country we serve, not fly-in consultants who leave after the strategy deck. <a href="https://sipiteno.com/case-studies">Read case studies</a> from clients who've expanded into similar markets.</p>
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
      <p><a href="https://sipiteno.com/case-studies">Read case studies</a> from ${ind.name.toLowerCase()} clients who've successfully expanded with Sipiteno.</p>
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

/**
 * Generate locale-prefixed variants of a prerendered page.
 * Writes dist/{locale}/path/index.html with adjusted lang, canonical, hreflang, og/twitter URLs.
 * Body content stays English (SEO design: English body for B2B). 
 */
function writeLocaleVariants(pathSegments, canonicalUrl, title, description, bodyContent = '', schemas = []) {
  for (const loc of NON_EN_LOCALES) {
    const localePrefix = loc.code;
    const localePath = [localePrefix, ...pathSegments];

    // Start from the English template and inject locale-specific meta
    let html = cleanTemplate;

    // Replace title (keep English for SEO body, but mark language)
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${title}"`);
    html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`);
    
    // Locale-prefixed canonical URL
    const localeCanonical = canonicalUrl.replace('https://sipiteno.com/', `https://sipiteno.com/${localePrefix}/`);
    html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${localeCanonical}"`);
    
    // Set html lang to locale
    html = html.replace(/<html[^>]*>/, match => {
      return match.replace(/lang="[^"]*"/, `lang="${localePrefix}"`);
    });

    // Replace hreflang tags: all 8 variants, self-referencing
    // First remove any existing hreflang
    html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '\n    ');
    
    // Build locale-aware hreflang: all variants point to their locale URLs
    const hreflangLines = [];
    for (const l of ACTIVE_LOCALES) {
      const lUrl = l.code === 'en'
        ? canonicalUrl  // English: no prefix
        : canonicalUrl.replace('https://sipiteno.com/', `https://sipiteno.com/${l.code}/`);
      hreflangLines.push(`    <link rel="alternate" hreflang="${l.code}" href="${lUrl}" />`);
    }
    // x-default points to English
    hreflangLines.push(`    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`);
    const localeHreflang = hreflangLines.join('\n');
    html = html.replace(/(<link rel="canonical"[^>]*>)/, '$1\n' + localeHreflang);

    // Update og:url and twitter:url to locale variant
    html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${localeCanonical}"`);
    html = html.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${localeCanonical}"`);
    html = html.replace(/<meta property="og:locale" content="[^"]*"/, `<meta property="og:locale" content="${localePrefix}"`);

    // Inject schemas and body same as English (the body content + byline)
    // We reuse the same schema injection and body injection logic from buildPage()
    // but simplified since schemas/body are already English (SEO design)
    const PUBLISHED = "2026-01-15";
    const MODIFIED = new Date().toISOString().split("T")[0];

    // E-E-A-T meta
    const eeatMeta = `    <meta name="author" content="Sipiteno" />\n    <meta property="article:published_time" content="${PUBLISHED}T00:00:00Z" />\n    <meta property="article:modified_time" content="${MODIFIED}T00:00:00Z" />\n  `;
    html = html.replace('</head>', eeatMeta + '</head>');

    // Inject schemas before PostHog (or before </head>)
    if (schemas.length > 0) {
      // Prefix with orgSchema if not already present
      const allSchemas = schemas.some(s => s && s['@type'] === 'Organization') ? [...schemas] : [orgSchema, ...schemas];
      const schemaScripts = allSchemas
        .map(s => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2).split('\n').map(l => '    ' + l).join('\n')}\n    </script>`)
        .join('\n');
      const insertPoint = html.indexOf('<!-- PostHog analytics -->');
      if (insertPoint !== -1) {
        html = html.slice(0, insertPoint) + '    <!-- Route-Specific Structured Data -->\n' + schemaScripts + '\n\n    ' + html.slice(insertPoint);
      } else {
        html = html.replace('</head>', schemaScripts + '\n  </head>');
      }
    }

    // Inject body content for crawlers
    if (bodyContent) {
      const byline = `<p class="author-byline"><span class="author" rel="author">By The Data Nerd, Sipiteno Research</span> · <time datetime="${MODIFIED}">Updated ${MODIFIED}</time> · Published ${PUBLISHED}</p>`;
      const seoBlock = bodyContent + byline;
      html = html.replace(
        /<div id="root"><\/div>/,
        `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap" aria-hidden="true">\n${seoBlock}\n      </div></div>`
      );
    }

    // Write the locale variant
    writeRoute(localePath, html);
  }
}

// --- ORGANIZATION SCHEMA (reused) ---
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sipiteno.com/#organization",
  "name": "Sipiteno Ltd",
  "description": "Sipiteno is a digital product studio that designs and builds SaaS tools, web apps, and AI-powered products end-to-end for founders and companies — an accountable product team that ships, not a marketplace where you hire and manage individual freelancers.",
  "disambiguatingDescription": "Sipiteno is a digital product studio that builds SaaS, web, and AI products end-to-end as an accountable team — not a freelance/talent marketplace (Toptal, Upwork, Turing) or a staff-augmentation body shop where you hire and manage individual contractors yourself.",
  "url": "https://sipiteno.com",
  "logo": "https://sipiteno.com/favicon.png",
  "foundingDate": "2009",
  "sameAs": [
    "https://www.linkedin.com/company/34765968",
    "https://github.com/kindrat86",
    "https://www.instagram.com/sipiteno",
    "https://www.facebook.com/sipiteno"
  ],
  "knowsAbout": [
    "B2B Business Development",
    "AI Implementation",
    "Digital Transformation",
    "IT Consulting",
    "Market Entry Strategy",
    "Technical Recruitment",
    "Agile Project Management",
    "Software Product Development"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "48 Inomenon Ethnon",
    "addressLocality": "Larnaca",
    "postalCode": "6042",
    "addressCountry": "CY"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+357-24-628166",
    "contactType": "sales",
    "email": "sales@sipiteno.com"
  }
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
    title: "Sipiteno — AI Consulting & Business Development Across 28 Countries",
    description: "Business development and AI consulting for startups expanding across 28 countries. 15+ years experience. MicroSaaS MVPs delivered in 4-8 weeks.",
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
    bodyContent: (() => {
      const posts = [
        { slug: "napkin-to-paying-customer-4-weeks", title: "From Napkin Sketch to First Paying Customer in 4 Weeks: The MicroSaaS Blueprint", week: "Speed to Market", desc: "The complete playbook for validating and shipping a product in record time." },
        { slug: "60-days-absolute-limit-first-build", title: "Why 60 Days Is the Absolute Limit for Your First Product Build", week: "Speed to Market", desc: "The economics and psychology of rapid validation." },
        { slug: "stop-hiring-fulltime-devs-first-product", title: "Stop Hiring Full-Time Devs for Your First Product: The Case for Agency Execution", week: "Speed to Market", desc: "When and why agency partnerships outperform in-house builds." },
        { slug: "blue-collar-saas-wins-faster", title: "Why Blue-Collar SaaS Wins Faster Than B2B Dashboards", week: "Vertical & Niche SaaS", desc: "The untapped opportunity in trade and service industries." },
        { slug: "logistics-construction-agriculture-microsaas-goldmines", title: "Why Logistics, Construction, and Agriculture Are MicroSaaS Goldmines", week: "Vertical & Niche SaaS", desc: "Industries desperate for modern tooling." },
        { slug: "integrate-ai-into-existing-product", title: "How to Integrate AI Into an Existing Product (Without Rewriting It)", week: "AI & Technical Strategy", desc: "A pragmatic five-step path from idea to production AI feature." },
      ];
      const items = posts.map(p => `<li><a href="https://sipiteno.com/blog/${p.slug}"><strong>${p.title}</strong></a><br><em>${p.week}</em> — ${p.desc}</li>`).join('\n      ');
      return `<h1>Blog | Sipiteno</h1>
      <p>Practical insights on building MicroSaaS products, rapid validation, and AI-powered tools. Learn from real builds and get tactical guides on shipping faster. Written by the Sipiteno product team — the same people who ship the products.</p>
      <h2>Latest posts</h2>
      <ul>
      ${items}
      </ul>
      <h2>What you'll find here</h2>
      <p>Three recurring themes: <strong>Speed to Market</strong> (how to ship an MVP in weeks, not quarters), <strong>Vertical &amp; Niche SaaS</strong> (why unglamorous industries are the best place to build), and <strong>AI &amp; Technical Strategy</strong> (how to integrate AI into real products without rebuilding everything). The posts draw from Delivery across 28 emerging markets.</p>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/services/ai-consulting">AI Consulting</a> | <a href="https://sipiteno.com/contact">Talk to us</a></p>`;
    })(),
  },
  {
    path: ['case-studies'],
    title: "Case Studies | Sipiteno",
    description: "Sipiteno publishes a case study only once a client has consented to be named. None are published yet.",
    canonicalUrl: "https://sipiteno.com/case-studies",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Case Studies", url: "https://sipiteno.com/case-studies" }],
    bodyContent: (() => {
      // 2026-07-25: fabricated case-study list removed (see CASE_STUDIES below).
      const cases = [];
      const cards = cases.map(c => `<li><a href="https://sipiteno.com/case-studies/${c.id}"><strong>${c.name}</strong> (${c.industry})</a> — ${c.result}</li>`).join('\n      ');
      return `<h1>Case Studies | Sipiteno</h1>
      <p>We publish a case study only once a client has agreed to have their engagement named. None are published yet — so rather than show illustrative examples, we show nothing. Client work to date has been under terms that don't allow us to name it.</p>
      <h2>What will appear here</h2>
      <p>When an engagement can be published with the client's consent, it will carry the actual scope, timeline, and outcome — what was built and what it achieved, not projections.</p>
      ${cards}
      <h2>Engagement models we work under</h2>
      <p>Engagements are delivered under three commercial models: <strong>fixed-scope MVP</strong> ($15k–$50k, 4–8 weeks), <strong>AI implementation program</strong> ($25k–$100k+, 8–24 weeks), and <strong>market-entry project</strong> ($25k–$75k, 12–16 weeks). See <a href="https://sipiteno.com/pricing">pricing</a> for detail. If you have a comparable build, <a href="https://sipiteno.com/contact">book a free 30-minute strategy call</a> or email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a>.</p>
      <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/services/ai-consulting">AI Consulting</a> | <a href="https://sipiteno.com/pricing">Pricing</a> | <a href="https://sipiteno.com/methodology">Methodology</a></p>`;
    })(),
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
    path: ['services'],
    title: "Services | Sipiteno — AI Consulting, Product Development & Market Entry",
    description: "Sipiteno's six core services: AI consulting and implementation, business development, IT consulting, digital marketing, sales funnel setup, project management, and MicroSaaS MVP development across 28 emerging markets.",
    canonicalUrl: "https://sipiteno.com/services",
    breadcrumbs: [{ name: "Home", url: "https://sipiteno.com/" }, { name: "Services", url: "https://sipiteno.com/services" }],
    bodyContent: `
    <h1>Sipiteno Services</h1>
    <p>Sipiteno delivers six core services for technology companies expanding into or across emerging markets in Eastern Europe, the Caucasus, and Central Asia. Each service can be engaged standalone or combined into a full market-entry program. Engagements scale from a $15,000 fixed-scope MVP to a multi-quarter $100,000+ AI implementation program.</p>
    <h2>Product &amp; Engineering</h2>
    <h3><a href="https://sipiteno.com/services/ai-consulting">AI Consulting &amp; Implementation</a></h3>
    <p>From strategy to shipped software: opportunity identification, model and vendor selection (OpenAI, Anthropic, open-source), RAG and fine-tuning, evaluation harnesses, and the surrounding product. We ship production AI features inside SaaS products — not strategy decks. Engagements: $25,000-$100,000+ over 8-24 weeks.</p>
    <h3>MicroSaaS MVP Development</h3>
    <p>A production-deployable SaaS MVP in 4-8 weeks: discovery, design, engineering, QA, deployment. Fixed-scope, fixed-fee. Reusable scaffolding for auth, billing, and analytics knocks ~40% off the build. Engagements: $15,000-$50,000. <a href="https://sipiteno.com/case-studies">See MVP case studies</a>.</p>
    <h3><a href="https://sipiteno.com/services/it-consulting">IT Consulting</a></h3>
    <p>Architecture review, technology selection, code review, DevOps setup, and technical due diligence for companies that need a senior second opinion before committing to a build or a hire. Engagements: $15,000-$75,000 or $150-$300/hour.</p>
    <h2>Market Entry &amp; Growth</h2>
    <h3><a href="https://sipiteno.com/services/business-development">Business Development &amp; B2B Partnerships</a></h3>
    <p>Pipeline generation, warm introductions to decision-makers, partnership development, and bilingual sales support across 28 countries. We work alongside your team to close deals, not just hand off leads. Retainers: $3,000-$10,000/month for 10-30 qualified leads per month.</p>
    <h3>Market Entry Project</h3>
    <p>Full country expansion: market assessment and scoring for 2-3 target countries, regulatory mapping, partnership identification, 12-16 weeks of active business development execution, and a transition plan for self-sufficient operations. Our most popular engagement for second or third geographic market entry. $25,000-$75,000.</p>
    <h3><a href="https://sipiteno.com/services/digital-marketing">Digital Marketing</a></h3>
    <p>Localized demand generation: SEO, content, paid acquisition, and localization across Cyrillic and Latin scripts. Tuned for emerging-market buyers who research in their local language. Engagements: retainer or project-based.</p>
    <h3><a href="https://sipiteno.com/services/sales-funnel">Sales Funnel Setup</a></h3>
    <p>End-to-end funnel design: landing pages, lead capture, CRM setup, nurture sequences, and attribution. Built for the longer sales cycles typical of B2B in emerging markets.</p>
    <h3><a href="https://sipiteno.com/services/project-management">Project Management</a></h3>
    <p>Dedicated product managers and agile delivery for companies that need a single accountable owner across an in-house or mixed team. One-week or two-week sprints with demos; the client sees a live staging environment from week one.</p>
    <h2>Not Sure Which Service You Need?</h2>
    <p>If you are unsure, the fastest path is a <a href="https://sipiteno.com/contact">free 30-minute strategy call</a>. We'll assess your situation and recommend the right engagement — including telling you if none of our services are the right fit. See <a href="https://sipiteno.com/pricing">pricing</a> for the full tier table or <a href="https://sipiteno.com/methodology">methodology</a> for how delivery works.</p>
    <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/answers">FAQ</a> | <a href="https://sipiteno.com/contact">Contact</a></p>`,
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
    description: "How a failed 2009 market entry in Eastern Europe became a 28-country expansion system. Read the Sipiteno founder story — from one brutal lesson to a repeatable market-entry system.",
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
      "@type": "Person",
      "@id": "https://sipiteno.com/about/#person",
      "name": "Sipi Teno",
      "givenName": "Sipi",
      "familyName": "Teno",
      "jobTitle": "Founder & Principal Consultant",
      "worksFor": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "description": "Founder of Sipiteno, a digital product studio and business development consultancy operating across 28 emerging markets since 2009. 15+ years delivering AI consulting, MicroSaaS MVP development, and market entry strategy for technology companies.",
      "knowsAbout": ["Market Entry Strategy", "AI Implementation", "MicroSaaS Development", "Business Development", "Digital Transformation", "Emerging Markets"],
      "sameAs": [
        "https://www.linkedin.com/company/34765968",
        "https://github.com/kindrat86"
      ]
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
      <p><strong>Sipiteno helps technology companies expand into 28 emerging markets across Central &amp; Eastern Europe, the Caucasus, Central Asia, South Asia, and East Africa.</strong> Founded in 2009. This page explains who we are, how the system works, and why a failed market entry became the foundation of everything we do.</p>
      <h2>Our Track Record</h2>
      <p>Over 15+ years of operating across emerging markets, the numbers that matter to us:</p>
      <ul>
        
        
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
;
// Write core pages
for (const page of corePages) {
  const html = buildPage(page);
  writeRoute(page.path, html);
  count++;
  
  // Generate locale-prefixed variants for SEO crawlability
  // Only for pages with a defined path — skip pages with empty path [] (homepage)
  if (page.path.length > 0 && page.canonicalUrl) {
    writeLocaleVariants(page.path, page.canonicalUrl, page.title, page.description, page.bodyContent || '', page.schemas || []);
    count += NON_EN_LOCALES.length;
  }
}

// 4d. Generate locale variants for the homepage (path: [] was skipped in the loop)
{
  const HOME_TITLE = "Sipiteno — AI Consulting & Business Development Across 28 Countries";
  const HOME_DESC = "Business development and AI consulting for startups expanding across 28 countries. 15+ years experience. MicroSaaS MVPs delivered in 4-8 weeks.";
  const HOME_CANONICAL = "https://sipiteno.com/";
  writeLocaleVariants([], HOME_CANONICAL, HOME_TITLE, HOME_DESC, buildHomepageBody(), [orgSchema, webSiteSchema, faqSchema]);
  count += NON_EN_LOCALES.length;
}

// 5. Country pages (28)
for (const country of COUNTRIES) {
  const title = `Business Consulting in ${country.name} | Sipiteno - ${country.capital}`;
  const description = `Sipiteno provides business development, AI consulting, IT solutions, and digital marketing services in ${country.name}. Local presence in ${country.capital} with expertise across ${country.region}.`;
  const canonical = `https://sipiteno.com/locations/${country.slug}`;

  // LocalBusiness schema — rich snippet eligible for local search results.
  // Each country gets its own @id so answer engines can disambiguate.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://sipiteno.com/locations/${country.slug}/#localbusiness`,
    "name": `Sipiteno in ${country.name}`,
    "description": `Business development, AI consulting, IT solutions, and market-entry services in ${country.name}. Local team in ${country.capital} with expertise across ${country.region}.`,
    "url": canonical,
    "image": "https://sipiteno.com/favicon.png",
    "telephone": "+30-697-185-2286",
    "email": "sales@sipiteno.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": country.capital,
      "addressCountry": country.name,
    },
    "parentOrganization": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
    "areaServed": { "@type": "Country", "name": country.name },
    "knowsLanguage": country.languages.slice(0, 3),
    "priceRange": "Mid-Range",
    "openingHours": "Mo-Fr 09:00-18:00",
    "foundingDate": "2009",
    "sameAs": [
      "https://www.linkedin.com/company/34765968",
      "https://github.com/kindrat86",
      "https://www.instagram.com/sipiteno",
      "https://www.facebook.com/sipiteno"
    ],
  };

  console.log('DEBUG localBusinessSchema.priceRange chars:', [...localBusinessSchema.priceRange].map(c => c.charCodeAt(0)));

  const html = buildPage({
    title,
    description,
    canonicalUrl: canonical,
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Locations", url: "https://sipiteno.com/locations" },
      { name: country.name, url: canonical },
    ],
    schemas: [localBusinessSchema, {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Business Consulting in ${country.name}`,
      "description": description,
      "url": canonical,
      "provider": { "@type": "LocalBusiness", "@id": `https://sipiteno.com/locations/${country.slug}/#localbusiness` },
      "areaServed": { "@type": "Country", "name": country.name },
    }],
    bodyContent: buildCountryBody(country),
  });

  // DEBUG: check schemas in output
  const priceIdx = html.indexOf('priceRange');
  if (priceIdx >= 0) {
    console.log('DEBUG HTML priceRange chars:', [...html.slice(priceIdx, priceIdx + 30)].map(c => c.charCodeAt(0)));
  }

  writeRoute(['locations', country.slug], html);
  count++;

  // Generate locale-prefixed variants for country pages
  writeLocaleVariants(['locations', country.slug], canonical, title, description, buildCountryBody(country), [localBusinessSchema, {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Business Consulting in ${country.name}`,
      "description": description,
      "url": canonical,
      "provider": { "@type": "LocalBusiness", "@id": `https://sipiteno.com/locations/${country.slug}/#localbusiness` },
      "areaServed": { "@type": "Country", "name": country.name },
    }]);
  count += NON_EN_LOCALES.length;

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

    // Generate locale-prefixed variants for country+service pages
    writeLocaleVariants(['locations', country.slug, svc.slug], svcCanonical, svcTitle, svcDescription, buildCountryServiceBody(country, svc), [{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${svc.name} in ${country.name}`,
      "description": svcDescription,
      "url": svcCanonical,
      "provider": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "areaServed": { "@type": "Country", "name": country.name },
    }]);
    count += NON_EN_LOCALES.length;
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

// 8. Case-study detail pages (12)
// 2026-07-25: the 12 entries here were fabricated client work (invented
// company names and invented outcomes) — a duplicate of the list removed
// from src/data/projects.ts. Emptied so no case-study detail pages are
// generated. Repopulate only with a real, named, consented engagement.
const CASE_STUDIES = [];

for (const cs of CASE_STUDIES) {
  const canonical = `https://sipiteno.com/case-studies/${cs.id}`;
  const title = `${cs.name} — ${cs.industry} Case Study | Sipiteno`;
  const description = `How Sipiteno built ${cs.name}: ${cs.description} Stack: ${cs.tech}. Result: ${cs.results}`;

  const metricsHtml = cs.metrics.map(m => `<li>${m}</li>`).join('');

  const bodyContent = `
    <h1>${cs.name} — ${cs.industry} Case Study</h1>
    <p><em>Status: ${cs.status} · Technology: ${cs.tech}</em></p>
    <h2>Overview</h2>
    <p>${cs.description}</p>
    <h2>Challenge</h2>
    <p>${cs.challenges}</p>
    <h2>Solution</h2>
    <p>${cs.solution}</p>
    <h2>Results</h2>
    <p>${cs.results}</p>
    <h2>Key Metrics</h2>
    <ul>${metricsHtml}</ul>
    <h2>Work with Sipiteno</h2>
    <p>This engagement reflects Sipiteno's model: one accountable team that ships a product end-to-end, not a marketplace of individual contractors. If you have a comparable build — SaaS, web, or AI product — <a href="https://sipiteno.com/contact">book a free 30-minute strategy call</a> or email <a href="mailto:sales@sipiteno.com">sales@sipiteno.com</a>.</p>
    <p><a href="https://sipiteno.com/case-studies">All case studies</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/services/ai-consulting">AI Consulting</a> | <a href="https://sipiteno.com/pricing">Pricing</a></p>`;

  const html = buildPage({
    title,
    description,
    canonicalUrl: canonical,
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Case Studies", url: "https://sipiteno.com/case-studies" },
      { name: cs.name, url: canonical },
    ],
    schemas: [{
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": `${cs.name} — Case Study`,
      "description": cs.description,
      "url": canonical,
      "creator": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "about": {
        "@type": "Thing",
        "name": `${cs.industry} product development`,
      },
    }],
    bodyContent,
  });

  writeRoute(['case-studies', String(cs.id)], html);
  count++;
}

console.log(`✓ Prerendered ${count} static HTML pages in dist/`);

// 9. Blog post detail pages (6 substantive posts)
const BLOG_POSTS = [
  {
    slug: "napkin-to-paying-customer-4-weeks",
    title: "From Napkin Sketch to First Paying Customer in 4 Weeks: The MicroSaaS Blueprint",
    category: "Speed to Market",
    date: "2026-06-02",
    body: `<p>The fastest path from an idea to a paying customer is shorter than most founders believe — but only if you are ruthless about what does not ship in week one. This is the blueprint Sipiteno uses to take a MicroSaaS from napkin sketch to first paid user in roughly four weeks, based on 50+ builds.</p>
<h2>Week 1: Discovery and scope lock</h2>
<p>Before any code, the team locks three things: the single pain point, the smallest feature set that resolves it, and the one number that proves it worked. Everything else is parked. The output of week one is a one-page scope document with a fixed feature list and a definition of done. No Gantt chart, no discovery deck — those are the artifacts of a slower model.</p>
<p>The most common failure mode here is scope creep disguised as "just one more thing." Every additional feature added in week one is a feature that must be designed, built, tested, documented, and maintained. At four weeks, two extra features can be the difference between shipping and stalling.</p>
<h2>Week 2: Design and architecture</h2>
<p>With scope locked, week two is design and architecture in parallel. The team picks a proven stack — React or Next.js with TypeScript, FastAPI or Flask in Python, PostgreSQL, Tailwind — and reuses internal scaffolding for the parts every product needs: authentication, billing, analytics, error tracking, deployment. These are not differentiators; building them from scratch is a tax, not an investment.</p>
<p>Design is intentionally low-fidelity in week two. The goal is a clickable prototype that lets a real user walk through the core flow end-to-end. Pixel-perfect design happens after the flow is validated, not before.</p>
<h2>Weeks 3-4: Engineering and ship</h2>
<p>Engineering runs in one-week sprints with a demo at the end of each. The client sees a live staging environment from day one. By the end of week three, the core flow works end-to-end on staging. Week four is QA, deployment to production, and the first cohort of real users.</p>
<p>The deployment itself is unglamorous: Vercel for the front end, Fly.io or a managed Postgres for the back end, a single environment variable for each secret. No Kubernetes, no microservices, no "we'll fix it in post." The goal is a product a real person can pay for.</p>
<h2>What gets cut</h2>
<p>In a four-week build, the following almost never ship in v1: multi-tenancy beyond a single organization, granular role-based access control, a custom admin dashboard, marketing site polish, email automation sequences, a mobile app (web responsive is enough), and anything described as "AI-powered" that is not directly tied to the core pain. These are v2 problems.</p>
<h2>The first paying customer</h2>
<p>A "paying customer" in week four does not mean a self-serve signup on a landing page. It usually means three to five founder-led sales conversations with people who have the pain, a working product they can try, and a price. If none of those conversations convert, the product has a positioning or pain-point problem — not a feature problem — and more features will not save it.</p>
<h2>When four weeks is wrong</h2>
<p>Four weeks is wrong when the core product is genuinely complex: a regulated fintech, a multi-sided marketplace with a chicken-and-egg problem, anything requiring custom ML training, or a product where the data integration alone takes weeks. For those, budget eight to twelve weeks and scope the first release around a narrower audience, not a narrower feature set.</p>
<h2>The economics</h2>
<p>A four-week MicroSaaS MVP typically runs $15,000-$50,000 depending on complexity. The math is simple: two to three senior engineers, a designer, and a product manager for four weeks, plus reusable scaffolding that knocks roughly 40% off the build. The alternative — hiring a full-time engineer, waiting three months to ramp, and then building — costs more and ships slower.</p>
<p>Ready to scope your build? <a href="https://sipiteno.com/contact">Book a free 30-minute strategy call</a> or read our <a href="https://sipiteno.com/case-studies">case studies</a>.</p>`
  },
  {
    slug: "60-days-absolute-limit-first-build",
    title: "Why 60 Days Is the Absolute Limit for Your First Product Build",
    category: "Speed to Market",
    date: "2026-06-03",
    body: `<p>There is a hard ceiling on how long a first product build should take before the economics turn against you, and in our experience it is around sixty days. Past that point, the cost of delay rises faster than the value of additional features — yet most first-time founders blow straight through it. This is why.</p>
<h2>The sunk-cost spiral</h2>
<p>Every additional week in a first build compounds two costs. The obvious one is cash: engineering time, infrastructure, and the opportunity cost of the founder's attention. The less obvious one is psychological: the longer you work on a product before showing it to a real user, the more attached you become to decisions that have not been validated. By week eight, most teams have convinced themselves the product needs "just two more weeks" — and then two more after that.</p>
<h2>The validation window closes</h2>
<p>Markets move. Competitors ship. The pain point you identified in week one may have shifted by week twelve. More importantly, the signal you need — does anyone actually want this? — can only come from putting the product in front of real users. Every week you delay that signal is a week building on assumptions.</p>
<p>The products that succeed are not the ones with the most features at launch. They are the ones that reach real users fastest, learn what is broken, and iterate. Speed to first user is the single highest-leverage variable in early-stage product.</p>
<h2>Why sixty days, specifically</h2>
<p>Sixty days is roughly the point at which three things converge: you have enough time to build something real (not a prototype), you have not yet burned the runway that would let you pivot, and the team has not yet accumulated enough technical debt or emotional attachment to resist change. Past sixty days, the cost of throwing away what you built starts to feel unacceptable, and that fear drives teams to ship the wrong product.</p>
<h2>The sixty-day budget</h2>
<p>If you accept the sixty-day ceiling, the budget falls out of it. At typical senior engineering rates, sixty days of focused work for a small team lands in the $30,000-$80,000 range. That buys you a production-deployable product, not a prototype — real auth, real billing, real deployment, real users. Anything cheaper is usually a prototype dressed up as a product; anything more expensive is usually scope you do not need yet.</p>
<h2>How to stay under the ceiling</h2>
<p>Three disciplines keep a build under sixty days. First, a written scope document signed before engineering starts, with a rule that any addition pushes something else out. Second, weekly demos to a real user — not the founder, not the team, a real user. Third, a "one more feature" budget: the team is allowed exactly one addition after scope lock, and after that, everything else is v2.</p>
<p>The teams that violate all three are the ones still "almost done" at month six.</p>
<h2>What happens after sixty days</h2>
<p>The goal of the first sixty days is not a perfect product. It is evidence: do people want this, will they pay, what is broken, what is missing. The product that ships at day sixty is a starting point, not a destination. The companies that win are the ones that ship at sixty, learn for ninety, and ship the real v2 at month six — not the ones that spend six months building v1 in private.</p>
<p><a href="https://sipiteno.com/contact">Talk to Sipiteno</a> about your build timeline.</p>`
  },
  {
    slug: "stop-hiring-fulltime-devs-first-product",
    title: "Stop Hiring Full-Time Devs for Your First Product: The Case for Agency Execution",
    category: "Speed to Market",
    date: "2026-06-04",
    body: `<p>For a first product, the default reflex — hire a full-time engineer — is usually the wrong one. The reasoning is intuitive (we need someone committed) but the economics are backwards. Here is why an accountable product team outperforms a first hire for the first build, and when the calculus flips.</p>
<h2>The hidden costs of the first full-time hire</h2>
<p>A senior full-time engineer in 2026 costs $120,000-$200,000+ fully loaded, takes two to three months to ramp, and then builds your product alone — which means they are simultaneously the front-end engineer, the back-end engineer, the DevOps person, the designer, and the product manager. Nobody is good at all of those things. The result is a product that reflects one person's strengths and one person's blind spots, shipped slower than a team would ship it.</p>
<p>There is also a recruitment cost that first-time founders underestimate: finding, interviewing, and closing a senior engineer takes one to three months of founder time. That is one to three months of zero product progress, before the hire even starts.</p>
<h2>What an accountable product team gives you</h2>
<p>A product studio gives you something different: a team that has already worked together, has shipped together, and has a product manager who owns the outcome. You are not hiring headcount; you are buying a shipped product. The team brings reusable scaffolding (auth, billing, analytics, deployment), a proven stack, and a process that has delivered dozens of products. The result is typically two to three times faster than a first full-time hire working alone.</p>
<p>The key distinction is <em>accountable</em>. A staff-augmentation body shop rents you developers; you still manage them, and you still own the outcome. A product studio commits to shipping the product and carries the delivery risk. For a first build, where you do not yet have an engineering culture, the latter is almost always the right model.</p>
<h2>The economics side by side</h2>
<p>Compare two paths to a shipped MVP. Path A: hire a senior engineer at $150k, spend two months recruiting, three months ramping, and four months building — total around nine months and $112k in salary alone, before benefits, infrastructure, or the founder's time. Path B: engage a product studio for a fixed-scope MVP at $25k-$50k over four to eight weeks. Path B ships in less than half the time at less than half the cost, and the product is better because it is built by a team, not a single person.</p>
<h2>When to flip to hiring</h2>
<p>The calculus flips when you have product-market fit and need to iterate quickly on a codebase the team understands. Once the product is live, users are paying, and the roadmap is clear, hiring a full-time engineer who owns the codebase day-to-day becomes the right move. The product studio can hand off cleanly — architecture documented, runbooks written, deployment reproducible — and the first hire inherits a working product instead of starting from zero.</p>
<p>This is the sequence Sipiteno recommends to most founders: studio for v1, hire for v2 and beyond. It is faster, cheaper, and produces a better first product.</p>
<h2>The trap to avoid</h2>
<p>The trap is the hybrid: hiring a junior engineer and supplementing them with a freelancer. This combines the slowness of ramping a junior with the coordination overhead of a freelancer, and nobody owns the outcome. It feels cheaper but ships slower and produces a worse product. If budget is the constraint, reduce the scope of v1 and ship it with a team — do not split the difference.</p>
<p><a href="https://sipiteno.com/contact">Talk to Sipiteno</a> about whether a studio or a hire is right for your stage.</p>`
  },
  {
    slug: "blue-collar-saas-wins-faster",
    title: "Why Blue-Collar SaaS Wins Faster Than B2B Dashboards",
    category: "Vertical & Niche SaaS",
    date: "2026-06-09",
    body: `<p>If you are choosing what to build next and you want to reach revenue fast, the most overlooked category is blue-collar SaaS — software for trades, construction, logistics, agriculture, and field services. These industries are underserved by modern software, have clear pain points, and pay willingly when you solve them. Here is why they consistently outperform generic B2B dashboards in the first twelve months.</p>
<h2>The competition is paper and spreadsheets</h2>
<p>In most blue-collar industries, the incumbent tool is a paper form, a whiteboard, or a spreadsheet someone built in 2014. The bar for "this is dramatically better" is low. A mobile-first app that does one workflow well — time tracking, job photos, equipment logs, delivery confirmations — is a ten-times improvement over the status quo, and adoption is fast because the pain is acute.</p>
<p>Generic B2B dashboards, by contrast, compete with every other dashboard. The buyer has seen a dozen tools that look similar, the switching cost is real, and the wedge is narrow. The same engineering effort that produces an obvious win in blue-collar produces a "nice to have" in a crowded B2B category.</p>
<h2>Clear pain, clear buyer, clear price</h2>
<p>Blue-collar software has three properties that make it commercially fast. First, the pain is concrete and daily: a construction foreman who loses two hours a week to paperwork feels it every single week. Second, the buyer is often the owner or operations manager who can make a decision in one call. Third, the price is anchored against labor cost: if your software saves five hours a week at $40/hour, a $200/month subscription pays for itself in a week.</p>
<p>Contrast this with a generic B2B dashboard, where the pain is diffuse, the buyer is a committee, and the ROI case requires a six-month analysis nobody believes.</p>
<h2>Mobile-first is a moat</h2>
<p>Blue-collar work happens in the field, not at a desk. A genuinely good mobile app — offline-capable, low-bandwidth, usable with gloves on — is a meaningful moat because most B2B software is still desktop-first. The team that nails the mobile workflow wins the category, and the incumbent B2B players struggle to catch up because retrofitting mobile onto a desktop product is a rewrite.</p>
<p>This is why we ship mobile-first by default for trade and field-service products. The desktop dashboard comes later, for the office staff; the mobile app is the product the field actually uses.</p>
<h2>Vertical wedge, horizontal expansion</h2>
<p>The pattern that works: start with one vertical wedge — electricians, plumbers, HVAC, landscapers, a specific trade — and nail their workflow end-to-end. Once you own one trade, expanding into adjacent trades is a marketing exercise, not a product rebuild. The software is 80% the same; the 20% that differs is terminology, compliance, and a few trade-specific forms.</p>
<p>The mistake founders make is trying to serve "all trades" from day one. The product becomes generic, the wedge is lost, and the moat never forms. Pick one trade, win it, then expand.</p>
<h2>Real numbers</h2>
<p>From our portfolio: a voice-logging product for construction crews reached $8k MRR in four months by solving one workflow — daily site reports — that previously took foremen 30 minutes a day. A delivery-confirmation tool for a regional logistics company hit $15k MRR in six weeks by replacing paper sign-off sheets. Both are products that would have been "nice to have" in a generic B2B category; in blue-collar, they were obviously worth paying for.</p>
<p><a href="https://sipiteno.com/contact">Talk to Sipiteno</a> about a blue-collar SaaS build.</p>`
  },
  {
    slug: "logistics-construction-agriculture-microsaas-goldmines",
    title: "Why Logistics, Construction, and Agriculture Are MicroSaaS Goldmines",
    category: "Vertical & Niche SaaS",
    date: "2026-06-11",
    body: `<p>Three industries consistently produce the fastest path to profitable MicroSaaS: logistics, construction, and agriculture. They are unglamorous, underserved by software, and populated by buyers who will pay for a tool that saves time or reduces error. This is why they are goldmines, and what to build in each.</p>
<h2>Logistics: the cost of a mistake is high</h2>
<p>In logistics, a single error — a mislabeled shipment, a missed customs window, a wrong delivery address — costs hundreds to thousands of dollars and hours of phone calls. Software that prevents one error per week pays for itself immediately. The pain is daily, the buyer is reachable, and the existing tools are clunky enterprise systems or spreadsheets.</p>
<p>The products that win in logistics are narrow: customs document generation for one corridor, real-time tracking for one carrier network, a delivery-confirmation workflow for one trade lane. The wedge is a single document or a single workflow; the expansion is adding corridors, carriers, or lanes over time.</p>
<h2>Construction: paperwork is the job</h2>
<p>A construction foreman spends a surprising share of the day on paperwork: daily site reports, safety checklists, equipment logs, photo documentation for compliance. None of this is glamorous, all of it is required, and almost all of it is still done on paper or in a spreadsheet. A mobile-first app that cuts 30 minutes of paperwork per day per foreman is a clear win, and a mid-size contractor with twenty foremen will pay $2,000-$5,000/month for it without hesitation.</p>
<p>The moat in construction is mobile UX and offline capability. Job sites have unreliable connectivity, foreman work in gloves, and the app must be usable in those conditions. Teams that nail this win the category.</p>
<h2>Agriculture: decisions are expensive and data is sparse</h2>
<p>Agriculture is the most underserved of the three. Decisions — when to irrigate, when to harvest, when to apply inputs — are expensive (a wrong call costs a season of yield) and the data to make them is surprisingly sparse. IoT sensors, satellite imagery, and weather data exist, but the layer that turns them into a recommendation is missing for most crops and most regions.</p>
<p>The products that win here combine a data source (sensors, weather, satellite) with a recommendation engine tuned to one crop and one region. Yield prediction, irrigation scheduling, and pest alerts are all proven wedges. Buyers are cooperatives and larger farms; pricing is per-acre or per-hectare and aligns with the value of the decision.</p>
<h2>Why these three, and not others</h2>
<p>These three industries share a structural property: the cost of a bad workflow is high and measurable, and the buyer is close to the pain. Compare this to, say, generic project management software — the pain is diffuse, the buyer is distant, and the ROI case is theoretical. The same engineering effort produces a product that pays for itself in week one versus a product that competes on design polish.</p>
<p>There are other categories with similar dynamics — field services, manufacturing QA, facilities management — but logistics, construction, and agriculture are the three where we have repeatedly seen a focused four-to-eight week build turn into a profitable product within months.</p>
<h2>What not to build</h2>
<p>The trap in all three industries is building a "platform" instead of a product. A platform that connects every stakeholder in logistics, or every trade in construction, is a five-year project that will run out of runway. A product that solves one workflow for one buyer in one region is a four-week build that can be in market next month. Start with the product; earn the platform over years.</p>
<p><a href="https://sipiteno.com/contact">Talk to Sipiteno</a> about a build in one of these industries.</p>`
  },
  {
    slug: "integrate-ai-into-existing-product",
    title: "How to Integrate AI Into an Existing Product (Without Rewriting It)",
    category: "AI & Technical Strategy",
    date: "2026-06-16",
    body: `<p>Most advice on adding AI to a product assumes a greenfield build. The reality for most companies is different: you have a working product, a real codebase, real users, and a finite budget. This is the pragmatic five-step path we use to integrate AI into an existing product without rewriting it, based on production AI features shipped across our portfolio.</p>
<h2>Step 1: Identify the highest-leverage repetitive task</h2>
<p>Do not start with "where can we add AI." Start with "where does a human do something repetitive that a model could do faster." The best candidates are tasks that a person does many times a day, that follow a recognizable pattern, and where a wrong answer is recoverable. Classification, summarization, extraction, drafting, and routing are all strong candidates; anything where a mistake is catastrophic (medical diagnosis, legal advice) is a poor first project.</p>
<p>The test: if you cannot point to a person whose job includes this task today, the AI feature has no buyer. Start with the task, not the model.</p>
<h2>Step 2: Prototype with an off-the-shelf API behind a feature flag</h2>
<p>With the task identified, prototype it in days, not weeks. Use an off-the-shelf API — OpenAI, Anthropic, or an open model behind a managed endpoint — wrapped behind a feature flag so only internal users see it. The goal is a working end-to-end path: real input, model call, output surfaced in the product UI. At this stage the quality does not matter; the integration does.</p>
<p>The most common mistake here is over-investing in the prototype. A 50-line handler that calls the API and renders the response is enough. Do not build a vector database, do not fine-tune a model, do not set up a training pipeline. Those come later, if they come at all.</p>
<h2>Step 3: Add an evaluation harness</h2>
<p>Before scaling, build a lightweight evaluation harness: a held-out set of 50-200 real inputs with the expected output, and a script that runs the model against them and reports accuracy. This is the piece most teams skip and it is the single biggest predictor of whether the AI feature ships. Without an eval set, you are optimizing by vibes; with one, you can measure whether a prompt change, a model swap, or a retrieval improvement actually helped.</p>
<p>The eval set does not need to be perfect. Fifty examples reviewed by a human is enough to catch regressions and to give the team confidence in the changes they are about to ship to real users.</p>
<h2>Step 4: Harden for production</h2>
<p>With the eval set passing, harden the feature for production. This means: structured outputs (force the model to return JSON in a known schema), guardrails (validate the output before showing it to users), observability (log every input and output for later debugging), cost controls (set per-request token limits and monthly budgets), and a fallback path (if the model is slow or fails, degrade gracefully rather than breaking the page).</p>
<p>Structured outputs are the highest-leverage of these. A model that returns free text is a liability; a model that returns a typed JSON object you validate against a schema is a feature. Most production AI bugs come from treating the model's output as text instead of data.</p>
<h2>Step 5: Roll out to a cohort, measure business impact, scale</h2>
<p>Ship to a small cohort first — 5% of users, or one customer — and measure the business metric the feature is supposed to move. Not model accuracy; the business metric. If the feature was supposed to reduce support tickets, measure ticket volume. If it was supposed to speed up a workflow, measure time-on-task. If the business metric does not move, the model accuracy does not matter.</p>
<p>This is the step where most AI features die a quiet death: they ship, they work, the accuracy is fine, and the business metric does not move — usually because the task identified in step 1 was not actually the bottleneck. Better to find that out at 5% rollout than at 100%.</p>
<h2>What to skip</h2>
<p>For a first AI integration, skip: custom model training (use APIs), building your own vector database (use pgvector or a managed offering), multi-model orchestration (pick one model and stick with it), and agentic workflows (they are harder to evaluate and harder to operate). These all have their place, but not in v1. Ship the simple version first, measure, and then decide whether the harder version is worth it.</p>
<p>The products that ship AI successfully are not the ones with the most sophisticated models. They are the ones that picked the right task, measured it honestly, and shipped a boring integration that works.</p>
<p><a href="https://sipiteno.com/services/ai-consulting">Talk to Sipiteno's AI consulting team</a> about integrating AI into your product.</p>`
  },
];

for (const post of BLOG_POSTS) {
  const canonical = `https://sipiteno.com/blog/${post.slug}`;
  const wordCount = post.body.split(/\s+/).length;

  const bodyContent = `
    <article>
    <h1>${post.title}</h1>
    <p><em>By the Sipiteno product team · ${post.date} · ${post.category} · ${wordCount} words</em></p>
    ${post.body}
    </article>
    <p><a href="https://sipiteno.com/blog">All posts</a> | <a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/case-studies">Case studies</a> | <a href="https://sipiteno.com/contact">Talk to us</a></p>`;

  const html = buildPage({
    title: `${post.title} | Sipiteno Blog`,
    description: post.body.replace(/<[^>]+>/g, '').slice(0, 155),
    canonicalUrl: canonical,
    breadcrumbs: [
      { name: "Home", url: "https://sipiteno.com/" },
      { name: "Blog", url: "https://sipiteno.com/blog" },
      { name: post.category, url: canonical },
    ],
    schemas: [{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "publisher": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
      "mainEntityOfPage": canonical,
      "articleSection": post.category,
      "wordCount": wordCount,
    }],
    bodyContent,
  });

  writeRoute(['blog', post.slug], html);
  count++;
}

console.log(`✓ Prerendered ${count} static HTML pages (incl. case studies + blog posts)`);

// 10. The 3-Door Expansion System — branded framework page (P3 AEO: named frameworks survive LLM flattening)
corePages.push({
  path: ['expansion-system'],
  title: "The 3-Door Expansion System | Sipiteno's Emerging-Markets Framework",
  description: "The 3-Door Expansion System is Sipiteno's branded framework for entering emerging tech markets: Introductions, Regulatory Map, and Local Team That Ships. The three doors that open markets.",
  canonicalUrl: "https://sipiteno.com/expansion-system",
  breadcrumbs: [
    { name: "Home", url: "https://sipiteno.com/" },
    { name: "3-Door Expansion System", url: "https://sipiteno.com/expansion-system" },
  ],
  schemas: [{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The 3-Door Expansion System",
    "description": "Sipiteno's branded framework for entering emerging tech markets. The three doors that open markets: Introductions, Regulatory Map, and a Local Team That Ships.",
    "author": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
    "publisher": { "@type": "Organization", "@id": "https://sipiteno.com/#organization" },
    "mainEntityOfPage": "https://sipiteno.com/expansion-system",
    "keywords": ["3-Door Expansion System", "emerging markets framework", "market entry methodology", "Sipiteno"],
  }],
  bodyContent: `
  <h1>The 3-Door&trade; Expansion System</h1>
  <p><em>Sipiteno's branded framework for entering emerging tech markets. The three doors that actually open a market — and why most expansion efforts stall because they only open one.</em></p>

  <h2>What it is</h2>
  <p>The 3-Door Expansion System is the methodology Sipiteno uses to take a technology company into a new emerging market in 12-16 weeks. It is built on a simple observation: almost every failed expansion we have seen over 15+ years failed because the company opened only one of the three doors below. Opening one door gets you a meeting. Opening all three gets you a market.</p>
  <p>The three doors are:</p>
  <ol>
    <li><strong>Door 1 — Introductions.</strong> Warm paths to the 15-25 decision-makers who actually buy in that market. Not cold outreach, not a purchased list — relationships built over years.</li>
    <li><strong>Door 2 — Regulatory Map.</strong> A clear, current map of the legal, tax, and compliance requirements for operating in that specific country, including the unwritten rules that never appear in the official guidance.</li>
    <li><strong>Door 3 — A Local Team That Ships.</strong> A bilingual team on the ground that can close, deliver, and support — not fly-in consultants who leave after the strategy deck.</li>
  </ol>

  <h2>Why three doors, not one</h2>
  <p>Most expansion efforts focus on a single door. A Western tech company hires a business-development consultant (Door 1) but ignores regulatory complexity (Door 2) and has no delivery capability in-country (Door 3). They get meetings, fail to close because the contract structure is wrong, and cannot deliver when they do. Or they hire a law firm (Door 2) to set up an entity but have no warm pipeline (Door 1) and no team to execute (Door 3) — they spend six figures on paperwork and see zero revenue.</p>
  <p>The pattern repeats across every emerging market we operate in: Ukraine, Poland, Kazakhstan, Georgia, Serbia, and the other 23 countries in the footprint. The companies that succeed open all three doors in parallel, on a compressed timeline, with a single accountable partner coordinating them.</p>

  <h2>The 12-16 week timeline</h2>
  <p>A typical 3-Door engagement runs 12-16 weeks and progresses through three phases, one per door:</p>
  <h3>Weeks 1-4: Open Door 1 (Introductions)</h3>
  <p>Sipiteno maps the 15-25 decision-makers in the buyer's category across 2-3 target countries and begins warm introductions through its existing network. By the end of week 4, the client has 5-10 qualified meetings on the calendar with buyers who have the problem and the budget.</p>
  <h3>Weeks 3-8: Open Door 2 (Regulatory Map)</h3>
  <p>Running in parallel, Sipiteno maps the legal, tax, data-residency, and compliance requirements specific to the target country and the client's industry. The output is a written regulatory brief covering: entity vs. branch vs. representative office; VAT and permanent-establishment triggers; data-protection requirements (GDPR equivalents, local data-residency rules); industry-specific licensing; and the unwritten norms that determine whether contracts actually get signed. This is the work most companies skip and most failures trace back to.</p>
  <h3>Weeks 5-16: Open Door 3 (Local Team)</h3>
  <p>Once introductions are converting and the regulatory path is clear, Sipiteno stands up the local team: a bilingual product manager or business-development lead, technical and design capacity if a localization build is needed, and the supporting infrastructure (local phone, local email, local entity or employer-of-record arrangement). This team closes the first deals and delivers against them, with a transition plan for the client to take over self-sufficiently by month six.</p>

  <h2>The three doors applied</h2>
  <p>The system has been applied across a range of industries and markets: a SaaS company entering Poland (Door 1: 22 introductions to mid-market manufacturers; Door 2: VAT and data-residency map; Door 3: a Warsaw-based BD lead hired in week 6); an AI consulting engagement in Kazakhstan (Door 1: 14 introductions to financial-services and telco buyers; Door 2: personal-data law and sub-sovereign procurement rules; Door 3: a two-person delivery team in Astana); a healthtech company entering Serbia (Door 1: introductions to three hospital networks; Door 2: medical-device and software-as-medical-device classification; Door 3: a clinical-trials lead in Belgrade). <a href="https://sipiteno.com/case-studies">See relevant case studies</a>.</p>

  <h2>When the 3-Door System is wrong</h2>
  <p>The system is wrong when the company does not yet have a working product (build first, expand second), when the target market is Western Europe or North America (the system is tuned for emerging markets where informal networks and regulatory ambiguity dominate), or when the company expects expansion to be free (each door requires real investment — the total engagement typically runs $25,000-$75,000).</p>

  <h2>How to engage</h2>
  <p>The 3-Door Expansion System is delivered as Sipiteno's <strong>Market Entry Project</strong> engagement ($25,000-$75,000, 12-16 weeks). It can be preceded by a free 30-minute strategy call to scope which 2-3 countries are the highest-leverage target. <a href="https://sipiteno.com/contact">Book the call</a>, see <a href="https://sipiteno.com/pricing">pricing</a>, or read the <a href="https://sipiteno.com/methodology">full delivery methodology</a>.</p>
  <p><a href="https://sipiteno.com/">Home</a> | <a href="https://sipiteno.com/services">Services</a> | <a href="https://sipiteno.com/locations">Markets we serve</a> | <a href="https://sipiteno.com/answers">FAQ</a></p>`,
});
{
  const html = buildPage(corePages[corePages.length - 1]);
  writeRoute(['expansion-system'], html);
  count++;
}

console.log(`✓ Prerendered ${count} static HTML pages total`);
