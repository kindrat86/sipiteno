#!/bin/bash
# Pre-deploy gate for sipiteno.com — run after `npm run build`, before any
# `vercel deploy`. Exits non-zero (blocking the deploy) if the build output
# is missing or carries a known landmine. Used by CI and deploy automation.
set -euo pipefail
cd "$(dirname "$0")/.."

fail() { echo "PREDEPLOY FAIL: $1" >&2; exit 1; }

test -f dist/index.html || fail "dist/index.html missing — build did not run"
grep -q "<title>Sipiteno" dist/index.html || fail "dist/index.html lacks '<title>Sipiteno' — broken template"
# Landmine: linking /ux.css from the SPA index bundles pSEO global styles into
# the app CSS and breaks the design system (see index.html comment — the
# warning comment itself contains the string, so match only real <link> tags).
if grep -Eq '<link[^>]*href="[^"]*ux\.css"' dist/index.html; then fail "dist/index.html links /ux.css — known white-screen/design-break landmine"; fi
# Landmine: manualChunks in vite config white-screened production twice.
# (ignore comment lines — the config carries a warning comment naming it)
if grep -v '^\s*//' vite.config.ts | grep -q "manualChunks"; then fail "vite.config.ts contains manualChunks — known white-screen landmine"; fi
test -f dist/404.html || fail "dist/404.html missing — branded 404 not copied"
test -f dist/sitemap.xml || fail "dist/sitemap.xml missing"
# Entry JS bundle referenced by index.html must exist on disk
entry=$(grep -o 'src="/assets/[^"]*\.js"' dist/index.html | head -1 | sed 's|src="/||;s|"||')
test -n "$entry" || fail "no /assets/*.js reference in dist/index.html"
test -f "dist/$entry" || fail "referenced entry bundle dist/$entry missing"

echo "PREDEPLOY OK: dist sanity checks passed (entry: $entry)"

# --- scaled-content-artifact guard (added by answer-engine task) ---
if grep -rq "like Poland or India" dist; then
  echo "PREDEPLOY FAIL: hardcoded 'Poland or India' artifact present in dist/"; exit 1; fi
if grep -rqE "compares favorably to [A-Za-z]+'s [0-9]" dist; then
  echo "PREDEPLOY FAIL: broken price self-comparison present in dist/"; exit 1; fi
