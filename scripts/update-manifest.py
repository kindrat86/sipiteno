#!/usr/bin/env python3
"""Update the thin-content-manifest.json to include all country×service pSEO pages."""
import json, os, re, glob

HTML_ROOT = "/Users/sipi/sipiteno"
COUNTRY_SLUGS = [
    "albania","armenia","azerbaijan","bosnia-and-herzegovina","bulgaria",
    "croatia","cyprus","czech-republic","estonia","ethiopia","georgia",
    "greece","hungary","india","kazakhstan","kyrgyzstan","latvia","lithuania",
    "moldova","montenegro","north-macedonia","poland","portugal","romania",
    "serbia","slovakia","slovenia","ukraine","uzbekistan"
]
SERVICE_SLUGS = ["ai-consulting","b2b-partnerships","digital-transformation","market-entry","mvp-development","tech-recruiting"]

MANIFEST = "/tmp/thin-content-manifest.json"

# Load existing
with open(MANIFEST) as f:
    manifest = json.load(f)

existing_urls = {p["url"] for p in manifest["sipiteno.com"]["thin_pages"]}
new_pages = []

def count_words(html):
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return len(text.split())

def extract(html, pattern):
    m = re.search(pattern, html)
    return m.group(1) if m else ""

# Country×service pages
for c in COUNTRY_SLUGS:
    for s in SERVICE_SLUGS:
        url = f"https://sipiteno.com/{c}/{s}"
        if url in existing_urls:
            continue
        path = os.path.join(HTML_ROOT, c, s, "index.html")
        if not os.path.exists(path):
            continue
        with open(path) as f:
            html = f.read()
        new_pages.append({
            "url": url,
            "path": path,
            "words": count_words(html),
            "title": extract(html, r"<title>(.*?)</title>"),
            "h1": "",
            "description": extract(html, r'<meta name="description" content="(.*?)"'),
        })

# Also check learn, for, vs, glossary, free for missing
OTHER = {
    "learn": "/learn/", "for": "/for/", "vs": "/vs/",
    "glossary": "/glossary/", "free": "/free/",
    "use-cases": "/use-cases/", "integrations": "/integrations/",
    "pricing-questions": "/pricing-questions/",
}
for base_dir, url_prefix in OTHER.items():
    base_path = os.path.join(HTML_ROOT, base_dir)
    if not os.path.isdir(base_path):
        continue
    for html_file in glob.glob(os.path.join(base_path, "*", "index.html")) + glob.glob(os.path.join(base_path, "*.html")):
        if os.path.basename(html_file) == "index.html":
            slug = os.path.basename(os.path.dirname(html_file))
        else:
            slug = os.path.basename(html_file).replace(".html", "")
        url = f"https://sipiteno.com{url_prefix}{slug}"
        if url in existing_urls:
            continue
        with open(html_file) as f:
            html = f.read()
        new_pages.append({
            "url": url,
            "path": html_file,
            "words": count_words(html),
            "title": extract(html, r"<title>(.*?)</title>"),
            "h1": "",
            "description": extract(html, r'<meta name="description" content="(.*?)"'),
        })

manifest["sipiteno.com"]["thin_pages"].extend(new_pages)
with open(MANIFEST, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"Existing: {len(existing_urls)}, Added: {len(new_pages)}, Total: {len(manifest['sipiteno.com']['thin_pages'])}")
print(f"Updated: {MANIFEST}")
