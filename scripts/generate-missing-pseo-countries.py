#!/usr/bin/env python3
"""Generate base pSEO country×service pages for missing countries on sipiteno.com.
Creates 14 missing country dirs × 6 services = 84 new pages, each matching
the established template so _enrich_thin_pages.py can expand them to 800+ words.
"""

import os
from pathlib import Path

BASE = Path("/Users/sipi/sipiteno")

# Countries that already exist (have pSEO dirs)
EXISTING = {"armenia", "azerbaijan", "bulgaria", "croatia", "georgia", 
            "greece", "kazakhstan", "montenegro", "poland", "portugal",
            "romania", "serbia", "slovakia", "ukraine", "uzbekistan"}

# Full country list from _enrich_thin_pages.py COUNTRY_DATA
ALL_COUNTRIES = {
    "albania": {"name": "Albania", "hub": "Tirana", "region": "Southeast Europe"},
    "armenia": {"name": "Armenia", "hub": "Yerevan", "region": "Caucasus"},
    "azerbaijan": {"name": "Azerbaijan", "hub": "Baku", "region": "Caucasus"},
    "bulgaria": {"name": "Bulgaria", "hub": "Sofia", "region": "Southeast Europe"},
    "croatia": {"name": "Croatia", "hub": "Zagreb", "region": "Southeast Europe"},
    "georgia": {"name": "Georgia", "hub": "Tbilisi", "region": "Caucasus"},
    "greece": {"name": "Greece", "hub": "Athens", "region": "Southeast Europe"},
    "kazakhstan": {"name": "Kazakhstan", "hub": "Almaty", "region": "Central Asia"},
    "montenegro": {"name": "Montenegro", "hub": "Podgorica", "region": "Southeast Europe"},
    "poland": {"name": "Poland", "hub": "Warsaw", "region": "Central Europe"},
    "portugal": {"name": "Portugal", "hub": "Lisbon", "region": "Southern Europe"},
    "romania": {"name": "Romania", "hub": "Bucharest", "region": "Central Europe"},
    "serbia": {"name": "Serbia", "hub": "Belgrade", "region": "Southeast Europe"},
    "slovakia": {"name": "Slovakia", "hub": "Bratislava", "region": "Central Europe"},
    "ukraine": {"name": "Ukraine", "hub": "Kyiv", "region": "Eastern Europe"},
    "uzbekistan": {"name": "Uzbekistan", "hub": "Tashkent", "region": "Central Asia"},
    # Missing countries to generate
    "bosnia-and-herzegovina": {"name": "Bosnia and Herzegovina", "hub": "Sarajevo", "region": "Southeast Europe"},
    "cyprus": {"name": "Cyprus", "hub": "Nicosia", "region": "Mediterranean"},
    "czech-republic": {"name": "Czech Republic", "hub": "Prague", "region": "Central Europe"},
    "estonia": {"name": "Estonia", "hub": "Tallinn", "region": "Northern Europe"},
    "ethiopia": {"name": "Ethiopia", "hub": "Addis Ababa", "region": "East Africa"},
    "hungary": {"name": "Hungary", "hub": "Budapest", "region": "Central Europe"},
    "india": {"name": "India", "hub": "Bengaluru", "region": "South Asia"},
    "kyrgyzstan": {"name": "Kyrgyzstan", "hub": "Bishkek", "region": "Central Asia"},
    "latvia": {"name": "Latvia", "hub": "Riga", "region": "Northern Europe"},
    "lithuania": {"name": "Lithuania", "hub": "Vilnius", "region": "Northern Europe"},
    "moldova": {"name": "Moldova", "hub": "Chisinau", "region": "Eastern Europe"},
    "north-macedonia": {"name": "North Macedonia", "hub": "Skopje", "region": "Southeast Europe"},
    "slovenia": {"name": "Slovenia", "hub": "Ljubljana", "region": "Central Europe"},
}

SERVICES = [
    {"slug": "ai-consulting", "name": "AI Consulting", "short": "ai consulting"},
    {"slug": "b2b-partnerships", "name": "B2B Partnerships", "short": "b2b partnerships"},
    {"slug": "digital-transformation", "name": "Digital Transformation", "short": "digital transformation"},
    {"slug": "market-entry", "name": "Market Entry", "short": "market entry"},
    {"slug": "mvp-development", "name": "MVP Development", "short": "mvp development"},
    {"slug": "tech-recruiting", "name": "Tech Recruiting", "short": "tech recruiting"},
]

TEMPLATE_BEFORE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{service_name} in {country_name} — Sipiteno</title>
<link rel="stylesheet" href="/ux.css">
    <meta name="description" content="Sipiteno: {service_short} services in {country_name}. Strategic Business Development & AI Consulting across 28 emerging markets.">
    <link rel="canonical" href="https://sipiteno.com/{country_slug}/{service_slug}">
    <link rel="alternate" hreflang="en" href="https://sipiteno.com/{country_slug}/{service_slug}" />
    <link rel="alternate" hreflang="en-US" href="https://sipiteno.com/{country_slug}/{service_slug}" />
    <link rel="alternate" hreflang="x-default" href="https://sipiteno.com/{country_slug}/{service_slug}" />
    <meta property="og:title" content="{service_name} in {country_name} — Sipiteno">
    <meta property="og:description" content="Sipiteno: {service_short} services in {country_name}. Strategic Business Development & AI Consulting across 28 emerging markets.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sipiteno.com/{country_slug}/{service_slug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{service_name} in {country_name} — Sipiteno">
    <meta name="twitter:description" content="Sipiteno: {service_short} services in {country_name}. Strategic Business Development & AI Consulting across 28 emerging markets.">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "{service_name} in {country_name} — Sipiteno",
    "description": "Sipiteno: {service_short} services in {country_name}. Strategic Business Development & AI Consulting across 28 emerging markets.",
    "url": "https://sipiteno.com/{country_slug}/{service_slug}",
    "isPartOf": {{"@type": "WebSite", "name": "Sipiteno", "url": "https://sipiteno.com"}},
    "about": {{"@type": "Thing", "name": "{service_name} in {country_name}"}}
}}
</script>
<!-- canonical-disambiguation --><script type="application/ld+json">{{"@context": "https://schema.org", "@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com", "description": "Sipiteno is a digital product studio that designs and builds SaaS tools, web apps, and AI-powered products end-to-end for founders and companies — an accountable product team that ships, not a marketplace where you hire and manage individual freelancers.", "disambiguatingDescription": "Sipiteno is a digital product studio that builds SaaS, web, and AI products end-to-end as an accountable team — not a freelance/talent marketplace (Toptal, Upwork, Turing) or a staff-augmentation body shop where you hire and manage individual contractors yourself.","aggregateRating":{{"@type":"AggregateRating","ratingValue":"4.9","bestRating":"5","worstRating":"1","ratingCount":50,"reviewCount":50}}}}</script>
<script src="/ux.js" defer></script>
  </head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:60px auto;padding:0 20px;line-height:1.7;color:#1a1a1a;background:#fff">
    <header style="margin-bottom:40px">
        <a href="https://sipiteno.com" style="text-decoration:none;color:#555;font-size:.9em">← Back to Sipiteno</a>
    </header>

    <main>
        <h1 style="font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2">{service_name} in {country_name}</h1>
        <p style="font-size:1.1em;color:#555;margin-bottom:2em">Sipiteno provides {service_short} services in {country_name}. Strategic Business Development & AI Consulting across 28 emerging markets.</p>
        <p>Looking for {service_short} in {country_name}? Sipiteno has delivered 50+ projects across 28 countries with a 4.9/5 rating. Local expertise, global standards.</p><p><a href="https://sipiteno.com" style="color:#0066cc">Contact Sipiteno about {service_short} in {country_name} →</a></p>
'''

TEMPLATE_AFTER = '''    </main>

    <footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">
        <p><strong>Sipiteno</strong> — Strategic Business Development & AI Consulting across 28 emerging markets.</p>
        <p><a href="https://sipiteno.com" style="color:#555">Home</a> · <a href="https://sipiteno.com/sitemap.xml" style="color:#555">Sitemap</a></p>
    </footer>

<!-- BRUNSON TRUST BAR — idempotency:trust-bar-v1 -->
<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">50+</span><br><span style="font-size:.82rem;color:#94a3b8">Projects delivered</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">28</span><br><span style="font-size:.82rem;color:#94a3b8">Countries active</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">4.9/5</span><br><span style="font-size:.82rem;color:#94a3b8">Avg satisfaction</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">7 wks</span><br><span style="font-size:.82rem;color:#94a3b8">Median MVP launch</span></div>
    </div>
    <p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">Every quarter you wait costs you a whole market. Start with the free playbook.</p>
    <a href="https://sipiteno.com/#free-playbook" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get the Free Expansion Playbook →</a>
    <p style="margin-top:18px;font-size:.78rem;color:#6b7178">🛡️ Every engagement starts with a free 30-minute scoping call. No risk.</p>
  </div>
</section>
<!-- /BRUNSON TRUST BAR -->

</body>
</html>'''

def main():
    missing = [s for s in ALL_COUNTRIES if s not in EXISTING]
    print(f"Missing countries ({len(missing)}): {', '.join(missing)}")
    
    total = 0
    for cs in ALL_COUNTRIES:
        if cs in EXISTING:
            continue  # skip existing
        cd = ALL_COUNTRIES[cs]
        for svc in SERVICES:
            dir_path = BASE / cs / svc["slug"]
            dir_path.mkdir(parents=True, exist_ok=True)
            file_path = dir_path / "index.html"
            
            if file_path.exists():
                print(f"  SKIP (exists): {file_path}")
                continue
            
            html = (TEMPLATE_BEFORE + TEMPLATE_AFTER).format(
                country_slug=cs,
                country_name=cd["name"],
                service_slug=svc["slug"],
                service_name=svc["name"],
                service_short=svc["short"],
            )
            file_path.write_text(html)
            print(f"  CREATED: {file_path}")
            total += 1
    
    print(f"\nTotal pages generated: {total}")
    print(f"Total country×service pages now: {len([s for s in ALL_COUNTRIES]) * len(SERVICES)}")

if __name__ == "__main__":
    main()
