#!/usr/bin/env python3
"""Force re-enrichment of existing country×service pSEO pages.
Strips the old enriched content (between <main> and </main> or before </main>)
then re-injects the new richer content.
"""
import json, re, os, sys

HTML_ROOT = "/Users/sipi/sipiteno"

COUNTRY_SLUGS = [
    "armenia","azerbaijan","bulgaria","croatia","georgia",
    "greece","kazakhstan","montenegro","poland","portugal",
    "romania","serbia","slovakia","ukraine","uzbekistan"
]
SERVICE_SLUGS = ["ai-consulting","b2b-partnerships","digital-transformation","market-entry","mvp-development","tech-recruiting"]

def count_words(html):
    """Count visible words in HTML."""
    text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return len(text.split())

def strip_enriched(html):
    """Remove the enriched-content section and any content after the last paragraph before </main> back to original."""
    # Remove <section class="enriched-content">...</section>
    html = re.sub(r'\s*<section class="enriched-content">.*?</section>\s*', '\n', html, flags=re.DOTALL)
    # Remove the extra CTA paragraph we added
    html = re.sub(r'<p>Ready to discuss.*?</p>\s*', '', html)
    return html

TOTAL = 0
for cs in COUNTRY_SLUGS:
    for svc in SERVICE_SLUGS:
        path = os.path.join(HTML_ROOT, cs, svc, "index.html")
        if not os.path.exists(path):
            continue
        with open(path) as f:
            html = f.read()
        
        # Check current state
        has_new = "Our AI Consulting Services in" in html or "Our B2B Partnerships Services in" in html or "Client Success Story:" in html
        if has_new:
            print(f"  HAS-NEW (skip): {path}")
            continue
        
        # Strip old enriched content
        html = strip_enriched(html)
        
        # Add a marker so the enrich script will process it (remove enriched-content)
        # The enrich script checks for class="enriched-content" - our strip removed it
        
        with open(path, "w") as f:
            f.write(html)
        
        wc = count_words(html)
        print(f"  STRIPPED ({wc}w → ready for re-enrich): {path}")
        TOTAL += 1

print(f"\nTotal pages stripped and ready for re-enrichment: {TOTAL}")
