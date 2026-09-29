#!/usr/bin/env python3.11
"""Regenerate llms-full.txt for sipiteno.com from the live sitemap, HTTP-200-verified.

History: the July-vintage llms-full.txt was a raw text-dump of stale prerendered
pages. It carried zero links, raw &amp; entities, a "20%%" typo, and — worst —
it re-published the fabricated "local teams in <capital>" claims that were
truthified out of the real pages on 2026-08-15 (commit 8adc19e4) and 2026-08-22
(commit 6118b3a1). It was serving AI crawlers the exact claims the site had to
remove. Fixed 2026-09-29: this generator emits a linked index of sitemap URLs,
each verified HTTP 200 before inclusion, with an identity block that states the
remote-delivery model truthfully.

This is the sibling of the hand-maintained llms.txt (which stays hand-maintained
per the 2026-09-19 fix). Unlike scripts/generate-llms-txt.py, THIS script is
safe to re-run: it derives everything from sitemap.xml and filters on HTTP 200.
It is NOT wired into `npm run build` — the build stays hermetic/offline; re-run
this script manually when the sitemap changes, then rebuild+redeploy.
"""

import concurrent.futures
import re
import sys
import urllib.request
from datetime import date, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SITEMAP_CANDIDATES = [REPO / "dist" / "sitemap.xml", REPO / "public" / "sitemap.xml"]
OUT = REPO / "llms-full.txt"
DOMAIN = "https://sipiteno.com"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15"}

# 28 country hubs (matches scripts/copy-pseo.sh)
COUNTRIES = [
    ("albania", "Albania"), ("armenia", "Armenia"), ("azerbaijan", "Azerbaijan"),
    ("bosnia-and-herzegovina", "Bosnia and Herzegovina"), ("bulgaria", "Bulgaria"),
    ("croatia", "Croatia"), ("cyprus", "Cyprus"), ("czech-republic", "Czech Republic"),
    ("estonia", "Estonia"), ("ethiopia", "Ethiopia"), ("georgia", "Georgia"),
    ("greece", "Greece"), ("hungary", "Hungary"), ("india", "India"),
    ("kazakhstan", "Kazakhstan"), ("kyrgyzstan", "Kyrgyzstan"), ("latvia", "Latvia"),
    ("lithuania", "Lithuania"), ("moldova", "Moldova"), ("montenegro", "Montenegro"),
    ("north-macedonia", "North Macedonia"), ("poland", "Poland"), ("romania", "Romania"),
    ("serbia", "Serbia"), ("slovakia", "Slovakia"), ("slovenia", "Slovenia"),
    ("ukraine", "Ukraine"), ("uzbekistan", "Uzbekistan"),
]
SERVICES = [
    ("ai-consulting", "AI consulting"),
    ("business-development", "Business development"),
    ("digital-marketing", "Digital marketing"),
    ("it-consulting", "IT consulting"),
    ("project-management", "Project management"),
    ("sales-funnel", "Sales funnel setup"),
]
COUNTRY_SLUGS = {slug for slug, _ in COUNTRIES}
COUNTRY_NAMES = dict(COUNTRIES)
SERVICE_NAMES = dict(SERVICES)

CORE_TITLES = {
    "/": "Homepage",
    "/about": "About Sipiteno",
    "/contact": "Contact",
    "/pricing": "Pricing",
    "/services": "All services",
    "/case-studies": "Case studies",
    "/expansion-system": "The 3-Door Expansion System",
    "/methodology": "Delivery methodology",
    "/story": "Our story",
    "/builds": "Builds ( shipped products )",
    "/calculator": "Market entry calculator",
    "/market-entry-scorecard": "Market entry scorecard",
    "/affiliates": "Affiliates programme",
    "/alternatives": "Competitor comparisons index",
    "/free": "Free tools index",
    "/locations": "All locations",
    "/blog": "Blog",
    "/glossary": "Glossary",
    "/industries": "Industries",
}

# Guardrail 5.1/5.8 self-check: these must never appear in the output again.
BANNED = [
    "local teams in",
    "active local teams",
    "The Data Nerd",
    "&amp;",  # raw HTML entities leaked into plain text
    "%%",
    "from our team in",
    "our base in",
    "team lives in",
]


def load_sitemap() -> list[str]:
    for p in SITEMAP_CANDIDATES:
        if p.is_file():
            urls = re.findall(r"<loc>(.*?)</loc>", p.read_text())
            if urls:
                return sorted(set(urls))
    raise SystemExit(f"no sitemap found in {[str(p) for p in SITEMAP_CANDIDATES]}")


def check(url: str) -> tuple[str, int]:
    req = urllib.request.Request(url, headers=UA, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return url, r.status
    except Exception as e:  # noqa: BLE001 - report any failure as a status
        return url, getattr(e, "code", 0)


def verify_all(urls: list[str]) -> dict[str, int]:
    status: dict[str, int] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for url, code in pool.map(check, urls):
            status[url] = code
    return status


def title_for(path: str) -> str:
    if path in CORE_TITLES:
        return CORE_TITLES[path]
    parts = [p for p in path.split("/") if p]
    if len(parts) == 2 and parts[0] == "services":
        return SERVICE_NAMES.get(parts[1], parts[1].replace("-", " ").title())
    if len(parts) == 2 and parts[0] in COUNTRY_SLUGS:
        return f"{SERVICE_NAMES.get(parts[1], parts[1])} in {COUNTRY_NAMES[parts[0]]}"
    if len(parts) == 2 and parts[0] == "locations":
        return f"{COUNTRY_NAMES.get(parts[1], parts[1])} (location hub)"
    if len(parts) == 2 and parts[0] == "industries":
        return f"Industries: {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "learn":
        return f"Learn: {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "glossary":
        return f"Glossary: {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "for":
        return f"For {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "vs":
        return f"Sipiteno vs {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "alternatives-to":
        return f"Alternatives to {parts[1].replace('-', ' ')}"
    if len(parts) == 2 and parts[0] == "free":
        return f"Free tool: {parts[1].replace('-', ' ')}"
    if len(parts) >= 2 and parts[0] == "blog":
        return f"Blog: {parts[1].replace('-', ' ')}"
    if len(parts) >= 2 and parts[0] == "research":
        return "Research: " + " ".join(parts[1:]).replace("-", " ")
    return parts[-1].replace("-", " ").title() if parts else "Homepage"


def classify(urls: list[str]) -> list[tuple[str, list[str]]]:
    """Return ordered (section, paths) covering every URL exactly once."""
    buckets: dict[str, list[str]] = {}
    for u in urls:
        path = u.replace(DOMAIN, "") or "/"
        parts = [p for p in path.split("/") if p]
        if path == "/":
            key = "Core pages"
        elif parts[0] == "services":
            key = "Services"
        elif parts[0] == "blog":
            key = "Blog posts"
        elif parts[0] == "research":
            key = "Research"
        elif parts[0] == "industries":
            key = "Industries"
        elif parts[0] == "learn":
            key = "Learn"
        elif parts[0] == "glossary":
            key = "Glossary"
        elif parts[0] == "for":
            key = "Audience pages"
        elif parts[0] == "vs":
            key = "Competitor comparisons"
        elif parts[0] == "alternatives-to":
            key = "Competitor alternatives"
        elif parts[0] == "free":
            key = "Free tools"
        elif parts[0] == "locations":
            key = "Location hubs"
        elif parts[0] in COUNTRY_SLUGS:
            key = "Country service pages (28 countries x 6 services)"
        else:
            key = "Core pages"
        buckets.setdefault(key, []).append(path)
    order = [
        "Core pages", "Services", "Research", "Location hubs",
        "Country service pages (28 countries x 6 services)", "Industries",
        "Learn", "Glossary", "Audience pages", "Competitor comparisons",
        "Competitor alternatives", "Free tools", "Blog posts",
    ]
    return [(k, buckets[k]) for k in order if k in buckets]


def main() -> int:
    today = date.today().isoformat()
    urls = load_sitemap()
    print(f"sitemap urls: {len(urls)}")
    status = verify_all(urls)
    dead = {u: c for u, c in status.items() if c != 200}
    live = [u for u in urls if status.get(u) == 200]
    for u, c in sorted(dead.items()):
        print(f"EXCLUDED (HTTP {c}): {u}")

    lines = [
        "# Sipiteno — Full Site Index",
        "",
        "> Sipiteno is a digital product studio and business development consultancy",
        "> helping B2B technology companies enter and operate in 28 countries across",
        "> Eastern Europe, the Caucasus, and Central Asia.",
        "> Delivery is remote from HQ in Larnaca, Cyprus. Sipiteno does not operate",
        "> local offices in these markets.",
        ">",
        f"> This file indexes every page on the site ({len(live)} URLs as of {today}).",
        "> It is generated from sitemap.xml by scripts/generate-llms-full-txt.py, and",
        f"> every URL below was verified to return HTTP 200 on {today}.",
        "> For a curated short index see " + DOMAIN + "/llms.txt.",
        "> Contact: sales@sipiteno.com",
        "",
    ]
    for section, paths in classify(live):
        lines.append(f"## {section}")
        lines.append("")
        for p in paths:
            lines.append(f"- [{title_for(p)}]({DOMAIN}{p})")
        lines.append("")
    lines.append(f"Machine-readable URL list: {DOMAIN}/sitemap.xml")
    lines.append("")

    text = "\n".join(text_line for text_line in lines)
    hits = [b for b in BANNED if b in text]
    if hits:
        print(f"FAIL: banned phrases in generated output: {hits}")
        return 1
    if len(live) != len(urls):
        print(f"WARN: advertising {len(live)} of {len(urls)} sitemap URLs ({len(dead)} excluded)")

    OUT.write_text(text)
    print(f"wrote {OUT} ({len(text)} bytes, {len(live)} URLs)")
    return 1 if dead else 0


if __name__ == "__main__":
    sys.exit(main())
