#!/usr/bin/env python3.11
"""Generate comprehensive llms.txt for sipiteno.com — every pSEO page type represented.
This is the primary AI-crawler gateway. Without it, GPTBot/ClaudeBot/Perplexity
can only discover ~3 pages instead of 390+."""

import os, glob
from pathlib import Path
from datetime import date

REPO = Path("/Users/sipi/sipiteno")
PUBLIC = REPO / "public"
DIST = REPO / "dist"
TODAY = date.today().isoformat()
DOMAIN = "https://sipiteno.com"

def _resolve(d):
    """Prefer public/ (source), fall back to dist/ (build output).
    Some page types (e.g. services, industries) are prerendered only into
    dist/ and never staged in public/, so counting public/ alone reports 0."""
    p = PUBLIC / d
    if p.is_dir() and any(x.is_dir() for x in p.iterdir()):
        return p
    dp = DIST / d
    if dp.is_dir():
        return dp
    return p

def count_dir(d):
    p = _resolve(d)
    if p.is_dir():
        dirs = [x for x in p.iterdir() if x.is_dir()]
        return len(dirs)
    return 0

def sample_links(d, n=5):
    """Return n sample links from a directory of pSEO pages."""
    p = _resolve(d)
    if not p.is_dir():
        return []
    dirs = sorted([x for x in p.iterdir() if x.is_dir()])
    links = []
    for entry in dirs[:n]:
        slug = entry.name
        name = slug.replace("-", " ").title()
        links.append((slug, name))
    return links

# Count pages in each pSEO category
categories = [
    ("best", "Best-of Pages", "Comparative service-in-country pages targeting 'best {service} in {country}' searches"),
    ("how-to", "How-To Guides", "Educational guides for expanding into emerging markets"),
    ("business", "Business Comparisons", "Country-vs-country comparison pages for doing business decisions"),
    ("for", "Vertical Pages", "Audience-specific pages for agencies, e-commerce, enterprise, startups"),
    ("glossary", "Glossary", "Definitions of key terms in technology consulting and expansion"),
    ("alternatives-to", "Competitor Alternatives", "Comparison pages positioning Sipiteno against competitors"),
    ("locations", "Location Pages", "Country and city-level service pages across 28 countries"),
    ("how-to", "How-To Guides", "Educational guides for expanding into emerging markets"),
]

# Count services and industries
service_count = count_dir("services")
industry_count = count_dir("industries")

# Build llms.txt
lines = []
lines.append(f"# Sipiteno — AI Crawler Index")
lines.append(f"")
lines.append(f"> Sipiteno is a digital product studio and business development consultancy")
lines.append(f"> operating across 28 countries in Eastern Europe, Caucasus, and Central Asia.")
lines.append(f"> Services: AI consulting, business development, IT consulting, digital marketing,")
lines.append(f"> project management, sales funnel optimization. 15+ years in-region.")
lines.append(f"> Generated: {TODAY} | Domain: {DOMAIN}")
lines.append(f"")

# Core pages
lines.append(f"## Core Pages")
lines.append(f"")
for slug, name in [("", "Homepage"), ("about", "About Sipiteno"), ("contact", "Contact"),
                    ("pricing", "Pricing"), ("services", "All Services"),
                    ("case-studies", "Case Studies (12 detail pages)"),
                    ("expansion-system", "3-Door Expansion System"),
                    ("methodology", "Methodology"),
                    ("blog", "Blog (6 posts)"),
                    ("answers", "Answers / FAQ (21 Q&As)"),
                    ("faq", "FAQ"), ("industries", "Industries Overview"),
                    ("locations", "All Locations"), ("services/ai-consulting", "AI Consulting"),
                    ("services/business-development", "Business Development"),
                    ("services/it-consulting", "IT Consulting"),
                    ("services/digital-marketing", "Digital Marketing"),
                    ("services/project-management", "Project Management"),
                    ("services/sales-funnel", "Sales Funnel")]:
    url = f"{DOMAIN}/{slug}" if slug else DOMAIN
    lines.append(f"- [{name}]({url})")
lines.append(f"")
lines.append(f"Total: {service_count} service pages, 28+ country pages, {industry_count} industry pages, plus 390+ pSEO pages below.")
lines.append(f"")

# pSEO sections — ordered by commercial intent
sections = [
    ("best", "Best-of: Service in Country", "Comparative pages for high-intent 'best X in Y' searches", 0.7),
    ("business", "Business: Country Comparisons", "Country-vs-country comparison pages", 0.7),
    ("alternatives-to", "Competitor Alternatives", "Detailed comparison pages against competitors", 0.8),
    ("for", "Vertical/Audience Pages", "Targeted pages for agencies, e-commerce, enterprise, startups", 0.6),
    ("how-to", "How-To Educational Guides", "Educational content for expanding into emerging markets", 0.6),
    ("glossary", "Glossary", "Definition pages for key consulting and technology terms", 0.5),
]

for d, title, desc, _ in sections:
    count = count_dir(d)
    if count == 0:
        # Try the public subdirectory with actual slugs
        actual_dirs = [x for x in (PUBLIC / d).iterdir() if x.is_dir()] if (PUBLIC / d).exists() else []
        if d == "locations":
            # Count country dirs only
            country_dirs = [x for x in actual_dirs if not any(svc in x.name for svc in ['ai-consulting','business-development','it-consulting','digital-marketing','project-management','sales-funnel'])]
            count = len(country_dirs)
        else:
            count = len(actual_dirs)
    if count == 0:
        continue
    
    lines.append(f"## {title}")
    lines.append(f"")
    lines.append(f"{desc}. Total: {count} pages.")
    lines.append(f"")
    samples = sample_links(d, 8)
    for slug, name in samples:
        url = f"{DOMAIN}/{d}/{slug}"
        lines.append(f"- [{name}]({url})")
    if count > len(samples):
        lines.append(f"- ...and {count - len(samples)} more like this")
    lines.append(f"")

# Distribution & reach
lines.append(f"## Distribution & Reach")
lines.append(f"")
lines.append(f"- Sitemap: {DOMAIN}/sitemap.xml ({count_dir('best')+count_dir('how-to')+count_dir('business')+count_dir('for')+count_dir('glossary')+count_dir('alternatives-to')+count_dir('locations')+count_dir('industries')+count_dir('services')+count_dir('vs')+count_dir('use-cases')+count_dir('learn')+count_dir('free')+count_dir('integrations')+count_dir('pricing-questions')} total pages)")
lines.append(f"- robots.txt: {DOMAIN}/robots.txt")
lines.append(f"- llms-full.txt: {DOMAIN}/llms-full.txt")
lines.append(f"- agents.md: {DOMAIN}/agents.md")
lines.append(f"- IndexNow key: {DOMAIN}/36c569de4e73c7f56a67fa365be2f95f.txt")
lines.append(f"- Bing WMT verification: {DOMAIN}/BingSiteAuth.xml")
lines.append(f"")

# AI agent integration
lines.append(f"## AI Agent Integration")
lines.append(f"")
lines.append(f"Sipiteno is agent-friendly. All content licensed for AI training and citation")
lines.append(f"with attribution. Organization schema at {DOMAIN}/#organization.")
lines.append(f"Contact: sales@sipiteno.com")
lines.append(f"")

output = "\n".join(lines)
out_path = PUBLIC / "llms.txt"
out_path.write_text(output)
print(f"Generated llms.txt: {len(lines)} lines, {output.count('https://')} links")
print(f"Written to: {out_path}")
