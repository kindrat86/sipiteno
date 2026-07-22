#!/bin/bash
# IndexNow submit for sipiteno.com
# Posts up to 200 URLs from sitemap to IndexNow (Bing + Yandex)
set -euo pipefail
KEY="36c569de4e73c7f56a67fa365be2f95f"
HOST="sipiteno.com"
URL_LIST="/tmp/sipiteno-indexnow-urls.txt"

# Extract first 200 URLs from sitemap
python3 -c "
import re, sys, urllib.request
with open('dist/sitemap.xml') as f:
    xml = f.read()
urls = re.findall(r'<loc>(https://[^<]+)</loc>', xml)[:200]
with open('$URL_LIST', 'w') as out:
    for u in urls:
        out.write(u + '\n')
print(f'Extracted {len(urls)} URLs')
"

# Submit to IndexNow
echo "=== Submitting to IndexNow ==="
python3 -c "
import json, urllib.request, sys
with open('$URL_LIST') as f:
    urls = [l.strip() for l in f if l.strip()]
body = json.dumps({
    'host': '$HOST',
    'key': '$KEY',
    'keyLocation': f'https://$HOST/$KEY.txt',
    'urlList': urls
}).encode()
req = urllib.request.Request(
    'https://api.indexnow.org/indexnow',
    data=body,
    headers={'Content-Type': 'application/json; charset=utf-8'}
)
try:
    resp = urllib.request.urlopen(req, timeout=30)
    print(f'IndexNow response: {resp.status} {resp.read().decode()[:200]}')
except Exception as e:
    print(f'IndexNow error: {e}')
"
echo "Done"
