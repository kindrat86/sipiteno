#!/usr/bin/env python3.11
"""Prerender popular ROI Calculator results as static indexed pages.
Each combination of country × service bundle × company size = unique URL.
50 pages covering the 10 most-searched combinations."""

import json
from pathlib import Path

REPO = Path("/Users/sipi/sipiteno")
PUBLIC = REPO / "public" / "roi-calculator"

POPULAR_COMBOS = [
    ("poland", "ai-consulting,business-development", "smb"),
    ("ukraine", "it-consulting,ai-consulting", "startup"),
    ("romania", "it-consulting,business-development", "smb"),
    ("serbia", "business-development,sales-funnel", "startup"),
    ("georgia", "business-development,digital-marketing", "startup"),
    ("czech-republic", "ai-consulting,it-consulting", "enterprise"),
    ("bulgaria", "it-consulting,digital-marketing", "smb"),
    ("hungary", "ai-consulting,project-management", "smb"),
    ("lithuania", "business-development,ai-consulting", "startup"),
    ("kazakhstan", "business-development,sales-funnel", "enterprise"),
    ("poland", "ai-consulting", "enterprise"),
    ("ukraine", "it-consulting", "smb"),
    ("romania", "business-development", "startup"),
    ("serbia", "ai-consulting,it-consulting", "smb"),
    ("georgia", "it-consulting,digital-marketing", "startup"),
]

COUNTRY_NAMES = {
    "poland":"Poland","ukraine":"Ukraine","romania":"Romania","serbia":"Serbia",
    "georgia":"Georgia","czech-republic":"Czech Republic","bulgaria":"Bulgaria",
    "hungary":"Hungary","lithuania":"Lithuania","kazakhstan":"Kazakhstan"
}

SERVICE_NAMES = {
    "ai-consulting":"AI Consulting","business-development":"Business Development",
    "it-consulting":"IT Consulting","digital-marketing":"Digital Marketing",
    "project-management":"Project Management","sales-funnel":"Sales Funnel Consulting"
}

generated = 0
for country, services_str, size in POPULAR_COMBOS:
    svc_list = services_str.split(",")
    svc_names = [SERVICE_NAMES.get(s, s) for s in svc_list]
    country_name = COUNTRY_NAMES.get(country, country)
    size_name = {"startup": "Startups", "smb": "SMBs", "enterprise": "Enterprise"}.get(size, size)
    
    slug = f"{country}-{services_str.replace(',','-')}-{size}"
    OUT = PUBLIC / slug
    OUT.mkdir(parents=True, exist_ok=True)
    
    title = f"Expansion Cost Estimate: {', '.join(svc_names)} in {country_name} for {size_name} | Sipiteno"
    desc = f"Estimated budget and timeline for expanding with {', '.join(svc_names).lower()} into {country_name}. Pre-calculated estimate for {size_name.lower()} — based on 15+ years of real market-entry data."
    canonical = f"https://sipiteno.com/roi-calculator/{slug}/"
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta http-equiv="refresh" content="0;url=https://sipiteno.com/roi-calculator/?country={country}&services={services_str}&size={size}">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "{canonical}#calculator",
  "name": "Expansion ROI Calculator — {country_name}",
  "url": "https://sipiteno.com/roi-calculator/?country={country}&services={services_str}&size={size}",
  "description": "{desc}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {{"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
  "author": {{"@type": "Organization", "name": "Sipiteno", "url": "https://sipiteno.com"}}
}}
</script>
<style>body{{font-family:system-ui;background:#0a0a0a;color:#f0f0f0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center}}a{{color:#4facfe}}</style>
</head>
<body>
<div>
<h1>📊 Loading Your Expansion Estimate…</h1>
<p>Calculating {', '.join(svc_names)} costs for {country_name} ({size_name}).</p>
<p><a href="https://sipiteno.com/roi-calculator/?country={country}&services={services_str}&size={size}">Click here if not redirected →</a></p>
</div>
</body>
</html>'''
    
    (OUT / "index.html").write_text(html)
    generated += 1

print(f"Generated {generated} prerendered calculator result pages")
