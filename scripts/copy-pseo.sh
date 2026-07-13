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
# Copy flat static pSEO families (previously only reached prod as stale
# leftovers in .vercel/output/static — copy them explicitly)
for d in for alternatives-to vs glossary free; do
  test -d "$d" || continue
  mkdir -p "dist/$d"
  for html in "$d"/*.html; do
    test -f "$html" && cp "$html" "dist/$d/$(basename "$html")"
  done
  for sub in "$d"/*/; do
    test -f "${sub}index.html" || continue
    mkdir -p "dist/${sub}"
    cp "${sub}index.html" "dist/${sub}index.html"
  done
done
echo "Copied sipiteno pSEO pages: $(find dist -name 'index.html' | wc -l) total"
# Copy IndexNow key files
cp *.txt dist/ 2>/dev/null
echo "Copied key files to dist"
