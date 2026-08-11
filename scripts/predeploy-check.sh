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

# --- hidden-text / cloaking gate (spam policy) ---
# On 2026-08-11 prerender.mjs was found wrapping the ENTIRE prerendered body —
# h1, content, everything — in
#   position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)
# with aria-hidden="true", on 230 of 446 URLs including the homepage. That is
# hidden text under Google's spam policies, and it shipped for months because
# nothing checked the built bytes. curl and a browser both render the page
# "fine" — the violation is only visible in the markup. This gate makes the fix
# self-enforcing: any future change that re-hides the prerendered block fails
# the build instead of reaching production.
#
# Scope: INLINE styles in HTML only. Deliberately NOT the compiled CSS, because
# Tailwind's `sr-only` utility uses the same declarations legitimately — the
# skip-link and "required" form labels on this site are sr-only and must keep
# working. Screen-reader-only text is explicitly permitted; hiding the page's
# own body content is not. A gate that false-positives on a11y utilities gets
# switched off by the next person who hits it, so it only scans what matters.
CLOAK_RE='style="[^"]*(clip:rect\(0 0 0 0\)|clip-path:inset\(50%\)|width:1px;height:1px;overflow:hidden)'
if grep -rlIE --include='*.html' "$CLOAK_RE" dist >/dev/null 2>&1; then
  echo "PREDEPLOY FAIL: hidden-text/cloaking inline style in dist/ HTML — see scripts/prerender.mjs" >&2
  grep -rlIE --include='*.html' "$CLOAK_RE" dist | head -5 >&2
  exit 1
fi
# The same injector emitted a fabricated E-E-A-T byline ("By The Data Nerd,
# Sipiteno Research") on every prerendered page and inside llms-full.txt, which
# is the file served to AI assistants. There is no such author. Never re-add it.
if grep -rq "The Data Nerd" dist; then
  echo "PREDEPLOY FAIL: fabricated author byline present in dist/" >&2
  grep -rl "The Data Nerd" dist | head -5 >&2
  exit 1
fi

# --- structured-data gate (~/.growth-engine/GUARDRAILS.md rule 3) ---
# Broken JSON-LD in dist/ is a landmine of exactly the kind this script exists
# to catch: it is introduced by the pSEO copy + inject-disambiguation steps, so
# the source-only lint in CI (validate_jsonld.py, runs at checkout) cannot see
# it. That is how "Unparsable structured data" reached Search Console on
# voicelogpro.com. verify-jsonld.mjs exits non-zero on any bad block.
node scripts/verify-jsonld.mjs dist || fail "dist/ contains invalid JSON-LD (see verify-jsonld output above)"
