#!/usr/bin/env python3
"""
Industry × Market compound pSEO page generator for sipiteno.com

Generates pages like:
  /saas-software/georgia  → "Expand Your SaaS to Georgia in 2026"
  /fintech-financial-services/poland → "Fintech Market Entry: Poland 2026"

Each page targets zero-competition long-tail queries combining industry + market.
Generates 9 industries × 28 markets = 252 pages with real market data.
"""

import json, os, re
from pathlib import Path

ROOT = Path(os.environ.get('SIPITENO_ROOT', os.path.expanduser('~/sipiteno')))
OUT_DIR = ROOT / 'expand-to'

# ── Market data (same source as scorecard) ──
MARKETS = [
    {"slug":"poland","name":"Poland","region":"Central Europe","gdp":23400,"internet":87,"engScore":598,"techTalent":92,"talentCost":18000,"languages":"Polish, English, German","highlights":"EU's fastest-growing tech hub with 400K+ developers. Warsaw and Krakow host vibrant startup ecosystems. EU member with full single-market access."},
    {"slug":"estonia","name":"Estonia","region":"Northern Europe","gdp":31200,"internet":93,"engScore":621,"techTalent":95,"talentCost":28000,"languages":"Estonian, English, Russian","highlights":"Most startups per capita in Europe. e-Residency program enables fully digital company setup. Digital-first government with 99% of services online."},
    {"slug":"czech-republic","name":"Czech Republic","region":"Central Europe","gdp":30700,"internet":89,"engScore":568,"techTalent":88,"talentCost":24000,"languages":"Czech, English, German","highlights":"Prague is the #2 startup hub in Central & Eastern Europe. Strong engineering tradition with deep talent in AI and automotive. EU/Schengen member."},
    {"slug":"romania","name":"Romania","region":"Southeast Europe","gdp":19600,"internet":82,"engScore":587,"techTalent":90,"talentCost":16000,"languages":"Romanian, English, French","highlights":"#1 IT outsourcing destination in the EU. Cluj-Napoca is a major tech cluster. Fast 5G rollout and excellent internet infrastructure."},
    {"slug":"lithuania","name":"Lithuania","region":"Northern Europe","gdp":28300,"internet":90,"engScore":603,"techTalent":89,"talentCost":22000,"languages":"Lithuanian, English, Russian","highlights":"EU's #1 fintech hub by number of licenses (260+). Vilnius Tech Park hosts 500+ startups. Strong regulatory support for financial innovation."},
    {"slug":"bulgaria","name":"Bulgaria","region":"Southeast Europe","gdp":17100,"internet":78,"engScore":549,"techTalent":82,"talentCost":12000,"languages":"Bulgarian, English","highlights":"Lowest operational costs in the EU with 100K+ IT professionals. Sofia Tech Park anchors the ecosystem. 10% flat corporate tax — lowest in EU."},
    {"slug":"croatia","name":"Croatia","region":"Southeast Europe","gdp":22300,"internet":83,"engScore":606,"techTalent":78,"talentCost":17000,"languages":"Croatian, English, German","highlights":"Eurozone + Schengen member since 2023. #2 in EU for English proficiency. Strong tourism-tech crossover creates unique product-testing opportunities."},
    {"slug":"serbia","name":"Serbia","region":"Southeast Europe","gdp":13200,"internet":78,"engScore":572,"techTalent":83,"talentCost":13000,"languages":"Serbian, English, Russian","highlights":"Fastest-growing tech sector in the Western Balkans. Belgrade Science & Technology Park is the anchor. EU candidate with favorable IP box regime."},
    {"slug":"ukraine","name":"Ukraine","region":"Eastern Europe","gdp":5800,"internet":79,"engScore":530,"techTalent":88,"talentCost":10000,"languages":"Ukrainian, Russian, English","highlights":"250K+ developers — the largest IT talent pool in Eastern Europe. Diia City special tax regime offers 5% income tax for tech. Growing defense-tech crossover."},
    {"slug":"georgia","name":"Georgia","region":"Caucasus","gdp":8900,"internet":77,"engScore":492,"techTalent":75,"talentCost":8000,"languages":"Georgian, English, Russian","highlights":"Ranked #7 globally for ease of doing business (World Bank). 1% flat tax for IT companies with virtual zone status. No currency controls — perfect for international revenue."},
    {"slug":"armenia","name":"Armenia","region":"Caucasus","gdp":8200,"internet":76,"engScore":475,"techTalent":80,"talentCost":7500,"languages":"Armenian, Russian, English","highlights":"Yerevan IT Park hosts 200+ companies. 10% income tax for IT sector employees. Growing AI/ML talent pool with strong mathematics tradition."},
    {"slug":"kazakhstan","name":"Kazakhstan","region":"Central Asia","gdp":14500,"internet":82,"engScore":430,"techTalent":68,"talentCost":8500,"languages":"Kazakh, Russian, English","highlights":"Central Asia's largest economy. Astana Hub offers 0% corporate/income tax for IT. Key node on the Middle Corridor trade route between China and Europe."},
    {"slug":"greece","name":"Greece","region":"Southeast Europe","gdp":24100,"internet":82,"engScore":586,"techTalent":80,"talentCost":19000,"languages":"Greek, English","highlights":"Athens tech renaissance driven by EU recovery funds. Strong shipping and tourism tech crossover. EU/Schengen/Eurozone member with improving business climate."},
    {"slug":"hungary","name":"Hungary","region":"Central Europe","gdp":23500,"internet":84,"engScore":560,"techTalent":84,"talentCost":18500,"languages":"Hungarian, English, German","highlights":"Budapest has a thriving startup ecosystem. Strong in AI, autonomous driving, and deep tech. EU member with 9% corporate tax — lowest in EU."},
    {"slug":"latvia","name":"Latvia","region":"Northern Europe","gdp":25200,"internet":89,"engScore":594,"techTalent":85,"talentCost":20000,"languages":"Latvian, English, Russian","highlights":"Riga TechHub is the anchor for Baltic tech. Strong in fintech and logistics tech. EU/Schengen/Eurozone member."},
    {"slug":"portugal","name":"Portugal","region":"Southern Europe","gdp":27900,"internet":84,"engScore":600,"techTalent":86,"talentCost":22000,"languages":"Portuguese, English","highlights":"Lisbon Web Summit effect has created 200+ startups. D7/D8 visa programs attract global talent. EU/Schengen member with strong quality of life appeal."},
    {"slug":"uzbekistan","name":"Uzbekistan","region":"Central Asia","gdp":3200,"internet":73,"engScore":410,"techTalent":58,"talentCost":5000,"languages":"Uzbek, Russian, English","highlights":"Fastest-reforming economy in Central Asia with 35M population. Tashkent IT Park offers 0% income tax. Young, growing, mobile-first population."},
    {"slug":"india","name":"India","region":"South Asia","gdp":2900,"internet":52,"engScore":505,"techTalent":92,"talentCost":9000,"languages":"Hindi, English, Tamil, Telugu","highlights":"5M+ developers — the world's largest English-speaking tech workforce. Bengaluru is the world's #2 startup hub. English is an official language."},
    {"slug":"azerbaijan","name":"Azerbaijan","region":"Caucasus","gdp":7800,"internet":80,"engScore":445,"techTalent":62,"talentCost":7000,"languages":"Azerbaijani, Russian, English","highlights":"Baku IT Park drives tech diversification from oil wealth. Strategic Caspian hub connecting Europe and Central Asia."},
    {"slug":"slovakia","name":"Slovakia","region":"Central Europe","gdp":24800,"internet":86,"engScore":555,"techTalent":76,"talentCost":20000,"languages":"Slovak, English, German","highlights":"Eurozone member. Bratislava tech corridor benefits from proximity to Vienna. Strong automotive-to-AI transition underway."},
    {"slug":"slovenia","name":"Slovenia","region":"Central Europe","gdp":34100,"internet":91,"engScore":589,"techTalent":82,"talentCost":26000,"languages":"Slovenian, English, German","highlights":"Highest GDP per capita in the region. Strong engineering heritage. EU/Schengen/Eurozone member."},
    {"slug":"moldova","name":"Moldova","region":"Eastern Europe","gdp":6700,"internet":74,"engScore":480,"techTalent":65,"talentCost":6000,"languages":"Romanian, Russian, English","highlights":"EU candidate country. Chisinau IT Park offers 7% single tax. Romanian/English bilingual talent pool."},
    {"slug":"cyprus","name":"Cyprus","region":"Mediterranean","gdp":36400,"internet":91,"engScore":590,"techTalent":72,"talentCost":25000,"languages":"Greek, English, Turkish, Russian","highlights":"EU + Eurozone member. 12.5% IP box regime — among Europe's most favorable. Major fintech and forex hub."},
    {"slug":"albania","name":"Albania","region":"Southeast Europe","gdp":8800,"internet":75,"engScore":505,"techTalent":60,"talentCost":6500,"languages":"Albanian, English, Italian","highlights":"Youngest population in Europe (median age 35). EU candidate country. Tirana tech corridor growing rapidly."},
    {"slug":"montenegro","name":"Montenegro","region":"Southeast Europe","gdp":12400,"internet":80,"engScore":510,"techTalent":58,"talentCost":8000,"languages":"Montenegrin, Serbian, English","highlights":"Uses the Euro as currency. Coastal tech nomad hub with growing digital infrastructure. NATO member."},
    {"slug":"north-macedonia","name":"North Macedonia","region":"Southeast Europe","gdp":8400,"internet":79,"engScore":520,"techTalent":62,"talentCost":6500,"languages":"Macedonian, Albanian, English","highlights":"EU candidate country. Skopje Tech Park anchors the ecosystem. Lowest costs in the Western Balkans."},
    {"slug":"bosnia-and-herzegovina","name":"Bosnia & Herzegovina","region":"Southeast Europe","gdp":8100,"internet":76,"engScore":460,"techTalent":60,"talentCost":7000,"languages":"Bosnian, Croatian, Serbian, English","highlights":"Untapped developer talent at very low cost. EU candidate country. Sarajevo's tech sector growing."},
    {"slug":"kyrgyzstan","name":"Kyrgyzstan","region":"Central Asia","gdp":2100,"internet":55,"engScore":390,"techTalent":45,"talentCost":3500,"languages":"Kyrgyz, Russian, English","highlights":"Lowest talent costs in the portfolio. Bishkek IT Park offers tax incentives. Growing remote-work outsourcing destination."},
]

INDUSTRIES = [
    {"slug":"saas-software","name":"SaaS & Software","short":"SaaS","painPoints":"High customer acquisition costs in saturated Western markets, need for affordable engineering talent, compliance with GDPR/data sovereignty","whyHere":"Lower CAC, abundant engineering talent at 40-70% less than US/EU averages, growing B2B tech adoption"},
    {"slug":"fintech-financial-services","name":"Fintech & Financial Services","short":"Fintech","painPoints":"Regulatory complexity across jurisdictions, banking partnerships, licensing costs, AML/KYC compliance","whyHere":"Progressive fintech sandboxes (Lithuania, Estonia), EU passporting rights, lower licensing costs, growing unbanked populations"},
    {"slug":"ai-machine-learning","name":"AI & Machine Learning","short":"AI/ML","painPoints":"Talent wars for ML engineers, GPU/compute costs, data annotation at scale, AI regulation uncertainty","whyHere":"Strong mathematics/CS education pipelines, 60-80% lower ML engineer salaries, favorable AI regulatory environments, growing AI research clusters"},
    {"slug":"ecommerce-retail-tech","name":"E-Commerce & Retail Tech","short":"E-Commerce","painPoints":"Logistics costs, cross-border payment complexity, returns management, local payment method fragmentation","whyHere":"Growing mobile-first consumer bases, expanding logistics infrastructure, rising disposable incomes in emerging markets"},
    {"slug":"cybersecurity","name":"Cybersecurity","short":"Cybersecurity","painPoints":"Talent shortage, enterprise sales cycles, certification costs, evolving threat landscape","whyHere":"Strong cryptography/security talent pools (Estonia, Poland, Romania), growing enterprise demand, government digitalization mandates"},
    {"slug":"healthcare-medtech","name":"Healthcare & MedTech","short":"HealthTech","painPoints":"Regulatory approvals (FDA, CE, MDR), clinical validation, reimbursement pathways, data privacy (HIPAA/GDPR)","whyHere":"EU MDR compliance pathways, growing clinical trial infrastructure, lower R&D costs, aging populations creating demand"},
    {"slug":"manufacturing-industry-4","name":"Manufacturing & Industry 4.0","short":"Manufacturing","painPoints":"Legacy system integration, IoT complexity, supply chain disruption, skilled technician shortage","whyHere":"Strong industrial bases (Poland, Czech Republic, Romania), EU digitalization funding, nearshoring trend from Asia to CEE"},
    {"slug":"agtech-agriculture","name":"AgTech & Agriculture","short":"AgTech","painPoints":"Adoption resistance, fragmented land ownership, climate volatility, commodity price swings","whyHere":"Major agricultural economies (Ukraine, Romania, Kazakhstan), EU Common Agricultural Policy subsidies, growing precision farming adoption"},
    {"slug":"logistics-supply-chain","name":"Logistics & Supply Chain Tech","short":"Logistics","painPoints":"Cross-border friction, last-mile costs, customs complexity, visibility gaps","whyHere":"Middle Corridor trade route growth, nearshoring driving EU-Caucasus-Asia logistics, port infrastructure investment (Greece, Romania, Georgia)"},
]

# ── HTML template ──
def build_page(industry, market):
    name = market['name']
    region = market['region']
    ind_name = industry['name']
    ind_short = industry['short']
    
    title = f"Expand Your {ind_short} Business to {name} in 2026 — Complete Market Entry Guide | Sipiteno"
    desc = f"Market entry guide for {ind_short.lower()} companies expanding to {name}. Regulatory overview, talent costs, infrastructure, and real data for {name} ({region}). Free from Sipiteno."
    
    why_here = industry['whyHere']
    highlights = market['highlights']
    languages = market['languages']
    
    talent_cost = f"${market['talentCost']:,}"
    gdp_capita = f"${market['gdp']:,}"
    
    # Dynamically pick the most relevant reason this market works for this industry
    if ind_short == 'Fintech' and market['slug'] in ['lithuania','estonia','cyprus']:
        specific = f"{name} is one of Europe's leading fintech jurisdictions, with a progressive regulatory sandbox, EU passporting rights, and a government actively courting financial innovation."
    elif ind_short == 'AI/ML' and market['techTalent'] >= 85:
        specific = f"{name} has an exceptional talent pipeline for AI/ML — ranked {market['techTalent']}/100 on tech talent — with strong university programs in mathematics, computer science, and engineering at 40-70% below US/EU salary levels."
    elif ind_short == 'SaaS' and market['slug'] in ['poland','romania','bulgaria','czech-republic']:
        specific = f"{name} is a proven SaaS development destination. Combined with {market['highlights'].split('.')[0].lower()}, it's ideal for scaling engineering teams."
    elif ind_short == 'HealthTech' and market['slug'] in ['czech-republic','poland','hungary']:
        specific = f"{name} has a growing clinical trial infrastructure and EU regulatory alignment, making it a strategic entry point for HealthTech companies targeting the European market."
    elif ind_short == 'Logistics' and market['slug'] in ['georgia','kazakhstan','greece','romania']:
        specific = f"{name} sits on key trade corridors — {market['highlights'].split('.')[0] if 'route' in market['highlights'].lower() or 'hub' in market['highlights'].lower() else 'a strategic logistics node'} — making it critical for supply chain tech expansion."
    elif market['gdp'] > 25000:
        specific = f"{name} has one of the highest GDP per capita levels in the region (${market['gdp']:,}), creating a strong addressable market for {ind_short.lower()} products."
    elif market['talentCost'] <= 10000:
        specific = f"{name} offers some of the most competitive talent costs in the portfolio at ${market['talentCost']:,}/year average for tech professionals, making it ideal for cost-sensitive {ind_short.lower()} expansion."
    else:
        specific = f"{name} combines {market['highlights'].split('.')[0].lower()} with a growing tech sector, creating a unique opportunity for {ind_short.lower()} companies."
    
    talent_rating = '⭐⭐⭐⭐⭐' if market['techTalent'] >= 85 else '⭐⭐⭐⭐' if market['techTalent'] >= 75 else '⭐⭐⭐' if market['techTalent'] >= 60 else '⭐⭐'
    
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://sipiteno.com/expand-to/{industry['slug']}/{market['slug']}">
<meta property="og:title" content="Expand Your {ind_short} Business to {name} in 2026 | Sipiteno">
<meta property="og:description" content="Complete market entry guide: regulatory overview, talent costs, infrastructure, and real data for expanding {ind_short.lower()} to {name}. Free from Sipiteno.">
<meta property="og:image" content="https://sipiteno.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://sipiteno.com/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<style>
:root{{--bg:#0b1120;--card:#131c31;--border:#1e3150;--txt:#e2e8f0;--mut:#94a3b8;--dim:#64748b;--pri:#6366f1;--acc:#4ade80;--amber:#f59e0b}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--txt);font-family:'Inter',sans-serif;line-height:1.7}}
.wrap{{max-width:780px;margin:0 auto;padding:0 20px}}
nav{{padding:16px 20px;border-bottom:1px solid var(--border)}}
nav .brand{{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.1rem;color:var(--txt);text-decoration:none}}
nav .brand span{{color:var(--pri)}}
.breadcrumbs{{padding:16px 0;font-size:0.78rem;color:var(--dim)}}
.breadcrumbs a{{color:var(--mut);text-decoration:none}}
.breadcrumbs a:hover{{color:var(--txt)}}
.hero{{padding:40px 0 28px}}
.hero .badge{{display:inline-block;background:rgba(99,102,241,0.12);color:var(--pri);font-size:0.78rem;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:12px}}
.hero h1{{font-family:'Space Grotesk',sans-serif;font-size:clamp(24px,4vw,34px);font-weight:700;color:#f8fafc;margin-bottom:12px;line-height:1.25}}
.hero .subtitle{{font-size:1.05rem;color:var(--mut);max-width:640px}}
.stats-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:28px 0}}
.stat-card{{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center}}
.stat-card .num{{font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:700;color:var(--acc);margin-bottom:4px}}
.stat-card .label{{font-size:0.75rem;color:var(--dim)}}
.section{{margin:32px 0}}
.section h2{{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;color:#f8fafc;margin-bottom:12px}}
.section p,.section li{{color:var(--mut);font-size:0.95rem;margin-bottom:8px}}
.section ul{{padding-left:20px;margin-bottom:12px}}
.section li{{margin-bottom:4px}}
.callout{{background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.04));border:1px solid var(--border);border-radius:12px;padding:20px;margin:24px 0}}
.callout h3{{font-size:1rem;color:var(--pri);margin-bottom:8px}}
.callout p{{font-size:0.9rem;color:var(--mut)}}
.cta-section{{background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(167,139,250,0.06));border:2px solid var(--pri);border-radius:16px;padding:28px 24px;text-align:center;margin:32px 0}}
.cta-section h3{{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;color:#f8fafc;margin-bottom:8px}}
.cta-section p{{color:var(--mut);font-size:0.9rem;margin-bottom:16px}}
.btn{{display:inline-block;background:linear-gradient(135deg,var(--pri),#4f46e5);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;font-size:0.9rem;text-decoration:none;transition:all .2s}}
.btn:hover{{transform:translateY(-1px);box-shadow:0 6px 24px rgba(99,102,241,0.3)}}
.related-links{{margin:28px 0;padding:20px;background:var(--card);border-radius:12px;border:1px solid var(--border)}}
.related-links h3{{font-size:0.9rem;color:var(--mut);margin-bottom:12px}}
.related-links a{{display:inline-block;color:var(--pri);font-size:0.82rem;margin-right:14px;margin-bottom:6px;text-decoration:none}}
.related-links a:hover{{text-decoration:underline}}
.author-block{{display:flex;align-items:center;gap:12px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:24px 0}}
.author-block .author-name{{font-weight:600;font-size:0.9rem;color:var(--txt)}}
.author-block .author-role{{font-size:0.78rem;color:var(--dim)}}
.author-block time{{font-size:0.75rem;color:var(--dim)}}
footer{{padding:30px 20px;border-top:1px solid var(--border);text-align:center;color:var(--dim);font-size:0.78rem}}
footer a{{color:var(--pri);text-decoration:none}}
.related-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:12px}}
.related-card{{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:12px;text-decoration:none;transition:all .2s;display:block}}
.related-card:hover{{border-color:var(--pri)}}
.related-card .r-title{{font-size:0.82rem;color:var(--txt);font-weight:600}}
.related-card .r-desc{{font-size:0.72rem;color:var(--dim);margin-top:2px}}
</style>
</head>
<body>

<nav>
  <a href="/" class="brand">Sipi<span>teno</span></a>
</nav>

<div class="wrap">

<div class="breadcrumbs">
  <a href="/">Home</a> › <a href="/expand-to/">Expand To</a> › <a href="/expand-to/{industry['slug']}/">{ind_short} Market Entry</a> › <strong>{name}</strong>
</div>

<div class="hero">
  <div class="badge">{region} · Updated July 2026</div>
  <h1>Expand Your {ind_short} Business to {name} in 2026</h1>
  <p class="subtitle">{specific}</p>
</div>

<div class="stats-grid">
  <div class="stat-card"><div class="num">{gdp_capita}</div><div class="label">GDP per capita</div></div>
  <div class="stat-card"><div class="num">{market['internet']}%</div><div class="label">Internet penetration</div></div>
  <div class="stat-card"><div class="num">{talent_cost}</div><div class="label">Avg. tech salary/yr</div></div>
  <div class="stat-card"><div class="num">{talent_rating}</div><div class="label">Tech talent rating</div></div>
</div>

<div class="section">
  <h2>Why {ind_short} Companies Choose {name}</h2>
  <p>{why_here}. {name} specifically offers:</p>
  <ul>
    {''.join(f'<li><strong>{h.split(".")[0].split(":")[0].strip()}.</strong> {h.split(".",1)[1].strip() if "." in h else h}</li>' for h in highlights.split('. ') if h.strip())[:500]}
  </ul>
</div>

<div class="callout">
  <h3>💡 Key Insight for {ind_short} Founders</h3>
  <p>{specific}</p>
  <p style="margin-top:8px">Languages spoken: <strong>{languages}</strong>. English proficiency score: <strong>{market['engScore']}/700</strong> (EF EPI 2025).</p>
</div>

<div class="section">
  <h2>{ind_short} Market Entry Strategy: {name}</h2>
  <p>Expanding a {ind_short.lower()} business to {name} requires understanding the local regulatory landscape, talent market, and customer acquisition channels. Here's what you need to know:</p>
  
  <h3 style="color:var(--amber);font-size:1rem;margin-top:20px">1. Regulatory & Compliance</h3>
  <p>{"As an EU member, " + name + " follows EU-wide regulations including GDPR, making compliance straightforward for companies already operating in Europe." if market['slug'] in ['poland','estonia','czech-republic','romania','lithuania','bulgaria','croatia','latvia','slovakia','slovenia','hungary','greece','portugal','cyprus'] else "As an EU candidate" if market['slug'] in ['serbia','albania','montenegro','north-macedonia','bosnia-and-herzegovina','moldova','ukraine','georgia'] else "As a non-EU market" if market['slug'] not in ['poland','estonia','czech-republic','romania','lithuania','bulgaria','croatia','latvia','slovakia','slovenia','hungary','greece','portugal','cyprus'] else "As an EU member"}, {name} {"offers the full benefits of EU single-market access, including passporting rights for regulated industries." if market['slug'] in ['poland','estonia','czech-republic','romania','lithuania','bulgaria','croatia','latvia','slovakia','slovenia','hungary','greece','portugal','cyprus'] else "is progressing toward EU regulatory alignment, which means standards-compliant products will have a first-mover advantage." if market['slug'] in ['serbia','albania','montenegro','north-macedonia','bosnia-and-herzegovina','moldova','ukraine','georgia'] else "has its own regulatory framework, so early engagement with local legal counsel is recommended."}</p>
  
  <h3 style="color:var(--amber);font-size:1rem;margin-top:20px">2. Talent & Hiring</h3>
  <p>Average tech salary in {name} is <strong>{talent_cost}/year</strong> — { "significantly below Western European and US levels, making it one of the most cost-effective talent markets in the portfolio." if market['talentCost'] <= 12000 else "competitive with other CEE markets and well below US/UK levels." if market['talentCost'] <= 20000 else "in line with developed European markets, reflecting high skill levels and strong English proficiency." } {name} scores <strong>{market['techTalent']}/100</strong> on our tech talent index, which measures developer density, university CS output, and English proficiency.</p>
  
  <h3 style="color:var(--amber);font-size:1rem;margin-top:20px">3. Go-to-Market</h3>
  <p>Internet penetration in {name} is <strong>{market['internet']}%</strong>, {"indicating a highly digital-first consumer base ready for SaaS and digital products." if market['internet'] >= 85 else "with strong mobile-first adoption that favors app-based and lightweight SaaS products." if market['internet'] >= 75 else "meaning market education and offline channels may still play a role alongside digital distribution."} GDP per capita of <strong>{gdp_capita}</strong> {"supports premium B2B pricing strategies." if market['gdp'] > 25000 else "suggests volume-based or freemium pricing models may perform better than premium positioning."}</p>
</div>

<div class="section">
  <h2>Compare {name} to Other Markets</h2>
  <p>Not sure if {name} is the right market? Use our free <a href="/market-entry-scorecard" style="color:var(--pri)">Market Entry Scorecard</a> to score all 28 markets against your specific product profile, or explore related entry guides below.</p>
</div>

<div class="related-links">
  <h3>📋 Related {ind_short} Market Entry Guides</h3>
  <div class="related-grid">
    {''.join(f'<a href="/expand-to/{industry["slug"]}/{m["slug"]}" class="related-card"><span class="r-title">{m["name"]}</span><span class="r-desc">GDP ${m["gdp"]:,} · Tech talent {m["techTalent"]}/100</span></a>' for m in MARKETS if m['slug'] != market['slug'])[:8000]}
  </div>
</div>

<div class="author-block">
  <div>
    <div class="author-name" rel="author">Sipiteno Research Team</div>
    <div class="author-role">15 years of market entry experience across 28 countries</div>
    <time datetime="2026-07-20">Last reviewed: July 20, 2026</time>
  </div>
</div>

<div class="cta-section">
  <h3>🚀 Get a Custom {ind_short} Expansion Strategy for {name}</h3>
  <p>Our team has delivered 50+ projects across 28 markets. Book a free 30-minute strategy call and walk away with a written action plan, a custom market scorecard for your top 2 markets, and our full Expansion Playbook — total value $497, free.</p>
  <a href="/contact" class="btn">Book Your Free Strategy Call →</a>
</div>

</div><!-- .wrap -->

<footer>
  Built by <a href="/">Sipiteno</a> — Digital product studio operating across 28 emerging markets. 50+ projects delivered, high client satisfaction.<br>
  <a href="/contact">Book a free 30-min strategy call</a> · <a href="/market-entry-scorecard">Market Entry Scorecard</a> · <a href="/expand-to/">All Market Entry Guides</a>
</footer>

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{desc}",
  "author": {{"@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com"}},
  "datePublished": "2026-07-19",
  "dateModified": "2026-07-20",
  "publisher": {{"@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com", "logo": {{"@type": "ImageObject", "url": "https://sipiteno.com/og.png"}}}},
  "mainEntityOfPage": {{"@type": "WebPage", "@id": "https://sipiteno.com/expand-to/{industry['slug']}/{market['slug']}"}},
  "about": {{"@type": "Thing", "name": "{ind_short} Market Entry in {name}"}}
}}
</script>

</body>
</html>'''

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create industry subdirectories and index pages
    for ind in INDUSTRIES:
        (OUT_DIR / ind['slug']).mkdir(parents=True, exist_ok=True)
    
    # Generate all pages
    total = 0
    for ind in INDUSTRIES:
        for mkt in MARKETS:
            html = build_page(ind, mkt)
            page_dir = OUT_DIR / ind['slug']
            # Create market subdirectory with index.html
            market_dir = page_dir / mkt['slug']
            market_dir.mkdir(parents=True, exist_ok=True)
            (market_dir / 'index.html').write_text(html)
            total += 1
    
    # Generate hub index pages
    # 1. /expand-to/index.html
    hub_html = generate_hub_page()
    (OUT_DIR / 'index.html').write_text(hub_html)
    
    # 2. Per-industry index pages
    for ind in INDUSTRIES:
        ind_html = generate_industry_index(ind)
        (OUT_DIR / ind['slug'] / 'index.html').write_text(ind_html)
    
    # Copy to public/ for Vite
    import shutil
    public_dest = ROOT / 'public' / 'expand-to'
    if public_dest.exists():
        shutil.rmtree(public_dest)
    shutil.copytree(OUT_DIR, public_dest)
    
    print(f'✓ Generated {total} industry×market pages')
    print(f'✓ 1 hub page + {len(INDUSTRIES)} industry index pages')
    print(f'✓ Copied to public/expand-to/')

def generate_hub_page():
    industry_links = '\n'.join(
        f'<a href="/expand-to/{ind["slug"]}/" class="related-card"><span class="r-title">{ind["name"]}</span><span class="r-desc">28 markets · Talent costs from $3,500–$28,000/yr</span></a>'
        for ind in INDUSTRIES
    )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Expand Your Business to 28 Emerging Markets — Market Entry Guides | Sipiteno</title>
<meta name="description" content="Complete market entry guides for 28 countries across Eastern Europe, Caucasus, and Central Asia. Industry-specific data for SaaS, fintech, AI, and more.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://sipiteno.com/expand-to/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0b1120;--card:#131c31;--border:#1e3150;--txt:#e2e8f0;--mut:#94a3b8;--dim:#64748b;--pri:#6366f1;--acc:#4ade80}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--txt);font-family:'Inter',sans-serif;line-height:1.7}}
.wrap{{max-width:780px;margin:0 auto;padding:0 20px}}
nav{{padding:16px 20px;border-bottom:1px solid var(--border)}}
nav .brand{{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.1rem;color:var(--txt);text-decoration:none}}
nav .brand span{{color:var(--pri)}}
.hero{{padding:48px 0 28px}}
.hero h1{{font-family:'Space Grotesk',sans-serif;font-size:clamp(26px,4vw,36px);font-weight:700;color:#f8fafc;margin-bottom:12px}}
.hero p{{font-size:1.05rem;color:var(--mut);max-width:640px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin:32px 0}}
.card{{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;text-decoration:none;transition:all .2s;display:block}}
.card:hover{{border-color:var(--pri);transform:translateY(-1px)}}
.card .c-title{{font-size:1rem;color:var(--txt);font-weight:700;margin-bottom:4px}}
.card .c-desc{{font-size:0.78rem;color:var(--dim)}}
footer{{padding:30px 20px;border-top:1px solid var(--border);text-align:center;color:var(--dim);font-size:0.78rem}}
footer a{{color:var(--pri);text-decoration:none}}
.btn{{display:inline-block;background:linear-gradient(135deg,var(--pri),#4f46e5);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;font-size:0.9rem;text-decoration:none;margin-top:16px}}
</style>
</head>
<body>
<nav><a href="/" class="brand">Sipi<span>teno</span></a></nav>
<div class="wrap">
<div class="hero">
<h1>Expand Your Business to 28 Emerging Markets</h1>
<p>Industry-specific market entry guides with real data on GDP, internet penetration, tech talent, talent costs, regulatory complexity, and languages — for every country in our portfolio.</p>
<a href="/market-entry-scorecard" class="btn">🎯 Score All 28 Markets for Your Product →</a>
</div>
<div class="grid">
{industry_links}
</div>
</div>
<footer>Built by <a href="/">Sipiteno</a> · 28 markets · 15 years experience · <a href="/contact">Free Strategy Call</a></footer>
</body>
</html>'''

def generate_industry_index(ind):
    market_links = '\n'.join(
        f'<a href="/expand-to/{ind["slug"]}/{m["slug"]}/" class="card"><span class="c-title">{m["name"]}</span><span class="c-desc">{m["region"]} · GDP ${m["gdp"]:,} · Talent ${m["talentCost"]:,}/yr · Tech {m["techTalent"]}/100</span></a>'
        for m in MARKETS
    )
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Expand {ind["name"]} to 28 Markets — Market Entry Guides | Sipiteno</title>
<meta name="description" content="Market entry guides for {ind["name"].lower()} companies expanding to 28 countries. Real data on regulations, talent costs, infrastructure, and go-to-market strategy.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://sipiteno.com/expand-to/{ind["slug"]}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0b1120;--card:#131c31;--border:#1e3150;--txt:#e2e8f0;--mut:#94a3b8;--dim:#64748b;--pri:#6366f1}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--txt);font-family:'Inter',sans-serif;line-height:1.7}}
.wrap{{max-width:780px;margin:0 auto;padding:0 20px}}
nav{{padding:16px 20px;border-bottom:1px solid var(--border)}}
nav .brand{{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.1rem;color:var(--txt);text-decoration:none}}
nav .brand span{{color:var(--pri)}}
.breadcrumbs{{padding:16px 0;font-size:0.78rem;color:var(--dim)}}
.breadcrumbs a{{color:var(--mut);text-decoration:none}}
.hero{{padding:32px 0 24px}}
.hero h1{{font-family:'Space Grotesk',sans-serif;font-size:clamp(24px,4vw,32px);font-weight:700;color:#f8fafc;margin-bottom:8px}}
.hero p{{font-size:1rem;color:var(--mut);max-width:640px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin:28px 0}}
.card{{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;text-decoration:none;transition:all .2s;display:block}}
.card:hover{{border-color:var(--pri)}}
.card .c-title{{font-size:0.95rem;color:var(--txt);font-weight:700;margin-bottom:4px}}
.card .c-desc{{font-size:0.72rem;color:var(--dim)}}
footer{{padding:30px 20px;border-top:1px solid var(--border);text-align:center;color:var(--dim);font-size:0.78rem}}
footer a{{color:var(--pri);text-decoration:none}}
</style>
</head>
<body>
<nav><a href="/" class="brand">Sipi<span>teno</span></a></nav>
<div class="wrap">
<div class="breadcrumbs"><a href="/">Home</a> › <a href="/expand-to/">Expand To</a> › <strong>{ind["name"]}</strong></div>
<div class="hero">
<h1>Expand {ind["name"]} to 28 Markets</h1>
<p>{ind["whyHere"]}. Select a country below for a complete market entry guide with real data.</p>
</div>
<div class="grid">{market_links}</div>
</div>
<footer>Built by <a href="/">Sipiteno</a> · 28 markets · <a href="/market-entry-scorecard">Market Entry Scorecard</a></footer>
</body>
</html>'''

if __name__ == '__main__':
    main()
