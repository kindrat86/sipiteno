#!/bin/bash
# Copy pSEO country×service combo pages into dist/
for country in serbia kazakhstan azerbaijan ukraine poland georgia uzbekistan armenia romania bulgaria croatia montenegro; do
  for svc in ai-consulting mvp-development digital-transformation market-entry b2b-partnerships tech-recruiting; do
    test -f "$country/$svc/index.html" && mkdir -p "dist/$country/$svc" && cp "$country/$svc/index.html" "dist/$country/$svc/index.html"
  done
done
# Copy learn pages
for d in learn; do
  for html in "$d"/*/index.html; do
    test -f "$html" || continue
    slug=$(basename $(dirname "$html"))
    mkdir -p "dist/$d/$slug"
    cp "$html" "dist/$d/$slug/index.html"
  done
done
echo "Copied sipiteno pSEO pages: $(find dist -name 'index.html' | wc -l) total"
# Copy IndexNow key files
cp *.txt dist/ 2>/dev/null
echo "Copied key files to dist"
