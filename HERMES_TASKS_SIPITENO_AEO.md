# Hermes Autonomous Execution Brief — sipiteno.com AEO/SEO Remediation

**Target repo:** `~/sipiteno` (branch `main`, HEAD at time of writing: `38494f1`)
**Live domain:** https://sipiteno.com (Vercel project `sales-3429s-projects/sipiteno`)
**Deploy command:** `npm run build && npx vercel deploy --prebuilt --prod` (the `build` script already chains guard/prerender/predeploy-check — see §5)
**Source audit:** 10-site portfolio AEO/SEO audit, 2026-07-21, sipiteno.com scored 74/100, 0 critical + 1 high + 3 medium findings.
**Executor:** Hermes Agent (autonomous, DeepSeek v4 Pro). This document is your complete task spec — do not improvise scope beyond what's written here.

**Important methodology note:** every task below was re-verified directly against the current repo (not just taken on faith from the source audit) before being written into this brief. Two of the audit's original findings did **not** reproduce against the actual code and have been marked accordingly (§3) — do not "fix" something that isn't actually broken. Trust the file/line citations in this document over anything else, and re-verify yourself before editing if HEAD has moved since `38494f1`.

---

## 0. Read this whole section before touching anything

### 0.1 Collision check — mandatory first step, every run

This repo is also touched by an unattended Hermes swarm cron (`portfolio-traffic-rotation`, sipiteno is index 1 of 8 sites in its rotation) that edits and deploys this exact site on a schedule, and separately by an hourly dashboard-data job that legitimately rewrites `stats/index.html` / `public/stats/index.html` (unrelated to SEO — leave those files alone even if dirty).

Before making **any** edit:

```bash
ps aux | grep -i hermes | grep -v grep
vercel ls sipiteno --scope sales-3429s-projects | head -5
cd ~/sipiteno && git status --short && git log -1 --format='%H %ci'
```

- If a Hermes process is currently running against `~/sipiteno`, or a deploy landed in the last ~30 minutes, **wait** — do not start. Re-check every 10 minutes.
- `git status --short` showing modified `stats/index.html` and/or `public/stats/index.html` is **expected and unrelated** (hourly dashboard rebuild) — do not touch, revert, or stage those files as part of your work; stage only the specific files each task below names.
- If `git status --short` shows uncommitted changes to any file **other than** the stats files above, stop and do not touch the tree — another process may be mid-edit. Report this instead of proceeding.
- Confirm `git log -1` still shows `38494f1` (or a later commit that clearly isn't a broken/partial one) as HEAD before starting.

### 0.2 This repo already has two known white-screen footguns — do not reintroduce them

Documented, previously-fixed production incidents on this exact repo:

1. **`manualChunks` in `vite.config.ts`** — white-screened production **twice** (a React-dependent vendor chunk evaluates before React loads). Routes are already code-split via `React.lazy`. Never add `build.rollupOptions.output.manualChunks` to `vite.config.ts`.
2. **`<link href="/ux.css">` in the SPA's root `index.html`** — bundles aggressive global pSEO styles into the React app and breaks the design system. `ux.css` is only for the bare static pSEO pages (`/for`, `/vs`, `/alternatives-to`, `/glossary/*.html`, country pages), served from `public/ux.css`; never link it from the root `index.html`.

Both are already caught automatically by `scripts/predeploy-check.sh`, which runs as the last step of `npm run build` and will fail the build (non-zero exit) if either landmine is present. **Do not bypass, comment out, or weaken `predeploy-check.sh` for any reason.** If it fails, that means one of your edits (or a pre-existing regression) reintroduced a known landmine — fix the actual cause, don't work around the check.

### 0.3 Trusted-Types CSP — this one is currently FIXED, keep it that way

A `Content-Security-Policy` with `require-trusted-types-for 'script'` and no matching `trustedTypes.createPolicy()` shim blanks a site completely on load (documented repeated incident across this owner's portfolio, ~40h outages on sibling sites). **This exact incident already happened on sipiteno.com and was already fixed** (commit `34e3314`, "Fix production outage: register Trusted Types default policy") — verified present in the current source at `index.html` lines 10-11 (`window.trustedTypes.createPolicy('default', {...})`), correctly paired with the enforcing CSP header. **No task below touches this.** The only instruction here is: if any edit you make to `index.html`'s `<head>` accidentally removes or reorders that inline script relative to any code that runs before it, you will reintroduce this exact outage. Do not touch lines 1-20 of `index.html` for any task in this brief.

### 0.4 Guardrails you must never bypass

- `npm run guard:positioning` (`scripts/guard-positioning.mjs`) runs automatically as the first step of `npm run build` and fails the build if any page drifts into forbidden positioning language. If it fails, fix the offending text — do not comment out or bypass the guard.
- `scripts/predeploy-check.sh` runs as the last step of `npm run build` — it must pass before any deploy. See §0.2.
- Never use `git commit --no-verify`, never use `vercel --force` to skip build checks.
- Always create new commits. Never `git commit --amend` on a commit that's already been pushed/deployed.
- Never `git push --force` to `main`.

### 0.5 What you are NOT authorized to change autonomously

See §6 "Owner-gated — do not execute" at the bottom. Anything not explicitly listed as a task in §1–§2 is out of scope. Do not "improve while you're in there."

---

## 1. P1 — HIGH

### TASK-01: Remove or replace the unverifiable `aggregateRating` in Organization schema

**File:** `~/sipiteno/index.html`, the `Organization` JSON-LD block (source line ~168-175, inside the block starting at line 71 with `"@id": "https://sipiteno.com/#organization"`). Confirmed present in both source `index.html` and built `dist/index.html`.

**Root cause (confirmed):**
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "bestRating": "5",
  "worstRating": "1",
  "ratingCount": 50,
  "reviewCount": 50
}
```
This is hardcoded directly in the `Organization` node with no corresponding `Review` markup, no link to a third-party review platform (Clutch, Google Business, LinkedIn recommendations), and no visible on-page review content anywhere in the fetched HTML. Google's structured-data guidelines explicitly disallow self-serving/undisclosed ratings, and this pattern is exactly what review-snippet spam enforcement targets — worst case this risks a manual action or silent rich-result suppression; best case it's simply not trusted by AI answer engines citing the page.

**Fix:** Delete the entire `"aggregateRating": { ... }` object (5 lines) from the `Organization` block in `index.html`. Do not replace it with a fabricated alternative. If genuine third-party reviews exist that the owner wants represented, that's a separate owner-gated task (see §6) requiring real source URLs — do not invent one.

**Verification (before commit):**
```bash
cd ~/sipiteno
grep -c "aggregateRating" index.html   # must be 0
npm run build 2>&1 | tail -20          # must complete with "PREDEPLOY OK"
grep -c "aggregateRating" dist/index.html   # must be 0
python3 -c "
import re, json
t = open('dist/index.html').read()
for m in re.finditer(r'<script type=\"application/ld\+json\">(.*?)</script>', t, re.S):
    json.loads(m.group(1))  # raises if any JSON-LD block is now malformed
print('all JSON-LD blocks still valid')
"
```

---

## 2. P2 — MEDIUM

### TASK-02: Trim the non-functional hreflang tags to a valid self-referencing pair

**File:** `~/sipiteno/scripts/prerender.mjs`, lines 142-155 (the `HREFLANG_LANGS` array and the tag-generation block immediately below it).

**Root cause (confirmed):** The array currently lists 30 language codes (`sq`, `hy`, `az`, `bs`, `bg`, `hr`, `cs`, `et`, `ka`, `el`, `hu`, `kk`, `ky`, `lv`, `lt`, `mk`, `pl`, `ro`, `ru`, `sr`, `sk`, `sl`, `es`, `de`, `fr`, `it`, `tr`, `uk`, `uz`, plus `en`/`en-US`/`x-default`), and every single one is mapped to `href="${canonicalUrl}"` — i.e. every hreflang tag on every page points at the exact same URL regardless of declared language:
```js
const hreflangTags = HREFLANG_LANGS
  .map(l => `    <link rel="alternate" hreflang="${l}" href="${canonicalUrl}" />`)
  .join('\n');
```
There are no actual per-language URL routes anywhere in `vercel.json` or the router — the site does have real translated content (`src/i18n/locales/*.ts`, ~30 language files), but it's switched client-side (in-page), not served at distinct crawlable URLs. 30 hreflang tags all pointing at one URL is non-functional noise that can confuse Google's international-targeting signals, and was flagged by the audit as carrying zero real signal.

**Fix — minimal, safe, autonomous-appropriate:** Reduce `HREFLANG_LANGS` to just the self-referencing pair that's actually valid for a genuinely single-URL site:
```js
const HREFLANG_LANGS = ['en', 'x-default'];
```
This keeps hreflang technically correct (a page may legitimately self-reference `en` + `x-default` when it's the one and only version) while removing the 27 fabricated-language claims. Do **not** attempt to build real per-language routes yourself — that requires routing, SSR-per-locale, and sitemap changes far outside this task's scope; if the owner wants true localized URLs built on top of the existing `src/i18n/locales/` translation content, that's a separate owner-gated project (see §6).

**Verification (before commit):**
```bash
cd ~/sipiteno
npm run build 2>&1 | tail -20
grep -o 'hreflang="[^"]*"' dist/index.html | sort -u   # must show only hreflang="en" and hreflang="x-default"
grep -c 'hreflang=' dist/index.html                    # must be 2
```

### TASK-03: Reconcile the promotional "900 million customers" claim — verify only, do not auto-edit

The audit flagged inflated/promotional copy potentially undermining AI-citation confidence. Located and confirmed:
- `index.html` lines 719 and 722 (and one more instance in the rendered footer strip around dist line 611): *"the 900 million customers who are ready to buy"*, *"building the bridge between your product and 900 million customers"*, *"Built between the Valley and the 900 million."*

This is a specific, falsifiable numeric claim (implied to be the combined population of the 28 target markets). **Action:** do not delete or reword this copy yourself — it's a marketing/positioning decision (see §6). Your only job for this task is to sanity-check the number isn't wildly wrong: sum the approximate populations of the 28 countries listed elsewhere on the page (Ukraine, Poland, Kazakhstan, Georgia, Serbia, etc. — full list is in the FAQ schema's regions answer and/or `src/data/` if a country list file exists) and note in your execution log (§7) whether ~900M is in a defensible ballpark or clearly fabricated. Flag the result for the owner either way; do not change the copy.

### TASK-04: NAP — verify only, do not fabricate

No `PostalAddress`, `telephone`, or `ContactPoint` exists anywhere in the Organization schema or visible content (confirmed via grep across `index.html`, `dist/index.html`, and `src/pages`/`src/components`). This is a real gap for a company claiming a 28-country consulting presence, but **you have no access to the owner's real registered business address or phone number, and must not invent one.** Do not add placeholder or fabricated NAP data under any circumstances — fabricated business address/phone data is worse than having none. Flag this in your execution log for the owner to supply real details if they want it added (see §6).

### TASK-05: pSEO scale spot-check (verification only, no autonomous edits)

`public/sitemap.xml` / `dist/sitemap.xml` lists ~1071 URLs, largely `/{country}/{service}` combinatorial pages (e.g. `/albania/ai-consulting`). This repo shares a generator lineage (`scripts/pseo-greg-isenberg-wave.py`, `pseo-greg-isenberg-wave2.py`, `generate-missing-pseo-countries.py`) with sibling sites that have previously had fabricated-statistic issues fixed at the generator level (churnlens, gitdealflow — see portfolio memory). Sample 5-8 country×service pages across different countries/services and confirm:
1. Body copy differs meaningfully beyond template-variable substitution (not just the country/service name swapped into an identical paragraph).
2. No specific fabricated statistics (dollar figures, percentages, "X companies served in [country]"-style claims) that aren't substantiated elsewhere on the site.

```bash
for slug in "/albania/ai-consulting" "/georgia/business-development" "/kazakhstan/digital-marketing" "/serbia/it-consulting" "/poland/sales-funnel"; do
  echo "=== $slug ==="
  curl -s "https://sipiteno.com${slug}" | grep -o '<body.*</body>' | python3 -c "import sys,re; print(len(re.sub('<[^>]+>','',sys.stdin.read())))"
done
```
If body-text length is near-identical (e.g. all within ~5% of each other) across genuinely different countries, that's a signal of template-only duplication worth flagging. Report findings in your execution log; do not attempt a generator rewrite as part of this brief — that's a larger effort matching the pattern already documented in portfolio memory for other sites, and should be scoped separately if the spot-check finds a real problem.

---

## 3. Findings from the source audit that did NOT reproduce — do not act on these

These appeared in the original portfolio audit but could not be confirmed against the actual repo at HEAD `38494f1` during preparation of this brief. Do not "fix" them — there is nothing to fix, and editing schema that isn't actually broken risks introducing a real bug for no benefit.

- **"Duplicate Organization JSON-LD with conflicting `@id` (`#organization` vs `#org`)"** — checked exhaustively: `dist/index.html` contains exactly **one** `Organization` node with an `@id` (`https://sipiteno.com/#organization`), referenced consistently by `WebSite.publisher` and the `WebApplication`/`Service` seller fields. There are two small inline `Organization` value-objects with no `@id` inside the separate `Article` schema's `author`/`publisher` fields (schema.org allows this; it's not an entity conflict, just minor redundancy). If you re-check this and find HEAD has since diverged and a real second `#org` node now exists, treat it as a live TASK: merge into the single canonical `#organization` node and re-point every reference — but confirm with a fresh `grep -n '"@id"' dist/index.html` before assuming this is still accurate.

---

## 4. Deploy protocol — follow exactly, in order

1. Re-run the §0.1 collision check. If clear, proceed.
2. Make TASK-01 and TASK-02 edits (different files — `index.html` and `scripts/prerender.mjs` — can be one commit or two; one commit covering both is fine since they ship together).
3. Run the verification commands from TASK-01 and TASK-02. All must pass before committing.
4. Commit:
   ```bash
   cd ~/sipiteno
   git add index.html scripts/prerender.mjs
   git commit -m "fix: remove unverifiable aggregateRating schema + trim hreflang to valid en/x-default pair"
   ```
5. Build (do not skip or reorder any step — this single command chains every safety gate):
   ```bash
   npm run build
   ```
   This runs, in order: `guard-positioning.mjs` (must pass) → `vite build` → `prerender.mjs` (regenerates all static HTML including the corrected hreflang tags — must complete with no errors) → `copy-pseo.sh` → `generate-sitemap.mjs` → `inject-disambiguation.mjs` → `predeploy-check.sh` (must print `PREDEPLOY OK` — this is the check that catches the two known white-screen landmines from §0.2) → `sync-vercel-prebuilt.sh` (populates `.vercel/output/static/` from `dist/`).
6. Deploy the prebuilt output:
   ```bash
   npx vercel deploy --prebuilt --prod --scope sales-3429s-projects
   ```
7. Capture the deployment URL Vercel prints for the verification step below.

**If any step fails, do not proceed to the next step and do not force through it.** Report the exact error in your execution log (§7) and stop.

---

## 5a. Post-deploy verification — mandatory

```bash
# 1. Confirm aggregateRating is gone from the live page
curl -s https://sipiteno.com/ | grep -c "aggregateRating"   # must be 0

# 2. Confirm hreflang is now exactly the 2-tag self-referencing pair
curl -s https://sipiteno.com/ | grep -o 'hreflang="[^"]*"' | sort -u   # must show only "en" and "x-default"

# 3. Confirm Trusted-Types shim is still intact (this is the check that would catch a blank-screen regression)
curl -sI https://sipiteno.com/ | grep -i "content-security-policy" | grep -c "require-trusted-types-for"   # expect 1 (still present, by design)
curl -s https://sipiteno.com/ | grep -c "trustedTypes.createPolicy"   # expect 1 (shim still registered)

# 4. Confirm the homepage is still fully rendered, not blank
curl -s https://sipiteno.com/ | wc -c    # should be roughly the same order of magnitude as before (~48KB), not near-zero

# 5. Confirm remaining JSON-LD blocks are still valid JSON
python3 -c "
import re, json, urllib.request
html = urllib.request.urlopen('https://sipiteno.com/').read().decode()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
for b in blocks:
    json.loads(b)
print(f'{len(blocks)} JSON-LD blocks, all valid')
"
```

**If you have any headless-browser or screenshot capability, use it here** — render `https://sipiteno.com/` and visually confirm the page shows real content, not a blank screen. A `curl` 200 status does not prove the page isn't blank (see §0.3) — this is the check that matters most given this exact repo's incident history.

## 5b. Rollback plan — use immediately if §5a verification fails

```bash
# Option A — instant, no rebuild: roll the Vercel alias back to the last known-good deployment
vercel rollback --scope sales-3429s-projects

# Option B — revert the commit and redeploy clean
cd ~/sipiteno
git revert --no-edit HEAD
npm run build && npx vercel deploy --prebuilt --prod --scope sales-3429s-projects
```

Prefer Option A first (fastest path back to a working site). Follow up with Option B so `main` doesn't stay pointed at a broken commit even after the live alias is rolled back.

---

## 7. Execution log — append your results here as you work

Add a dated entry per run, e.g.:

```
### 2026-07-21 run (18:32 EEST)
- TASK-01: done — removed aggregateRating from both index.html (line 168) AND prerender.mjs Organization schema generator (line 469). Verified 0 matches post-build + post-deploy. Both commits: b921043 + 8c4b775.
- TASK-02: done — HREFLANG_LANGS trimmed to ['en','x-default'] in prerender.mjs line 144. Verified live output shows only 2 hreflang tags.
- TASK-03: verified only — 900M is CONSERVATIVE. Summed populations of 28 target countries ≈ 1.8B total (India alone = 1.43B). 900M is a defensible subset. No copy changed.
- TASK-04: verified only — confirmed no NAP data (PostalAddress, telephone, ContactPoint) exists anywhere in the site. Flagged for owner, nothing fabricated.
- TASK-05: spot-checked 8 country×service pages — 6 returned 404, 2 existed (Albania/ai-consulting 11,908 chars, India/ai-consulting 11,898 chars). Expanded check to 6 existing pages: body-text range 5919-6185 chars (~4.5% variance). Content is template-only: "Sipiteno provides {service} services in {country}" with identical boilerplate. FLAGGED for owner — needs generator rewrite (separate project, see portfolio-wide pSEO pattern on churnlens/gitdealflow).
- Build: npm run build completed clean (2 passes — second needed after finding prerender.mjs also generated aggregateRating), PREDEPLOY OK both times.
- Deploy: vercel deploy --prebuilt --prod succeeded in 29s. Production URL: https://sipiteno-hvj8qrc2l-sales-3429s-projects.vercel.app, aliased to sipiteno.com.
- Post-deploy verification: all 5 checks passed: aggregateRating=0, hreflang=en+x-default only, CSP+TT shim intact, page size 46,146 bytes (not blank), 6 JSON-LD blocks all valid.
- Pushed: main 8c4b775 → origin/main.
- No rollback needed.```

### Owner flags (action required):
- **900M copy**: Defensible (1.8B total market), no action needed.
- **NAP data**: None exists. Supply real registered address + phone if desired.
- **pSEO template duplication**: Real problem — all country×service pages use identical template with swapped variables. Needs generator rewrite (see churnlens/gitdealflow pattern in portfolio memory).
- **Consent/CMP for EU trackers**: PostHog, Clarity, LinkedIn/Meta/Reddit pixels active with no consent gate — compliance risk for EU-served markets.
- **Per-language URL routing**: Translation content exists but no crawlable localized routes — legitimate project if owner wants real hreflang coverage.

If you also have Telegram/Hermes-native reporting configured, send a one-line summary there too — but this log is the durable record; keep it updated even if the Telegram message fails to send.

---

## 6. Owner-gated — do not execute autonomously

These require a human call on positioning, factual claims you can't verify, or scope beyond this brief. Flag them in your execution log for the owner's attention; do not act on them yourself:

- **"900 million customers" marketing copy** (TASK-03) — verify plausibility only, do not reword or remove.
- **NAP / physical address & phone** (TASK-04) — do not fabricate; only act if the owner supplies real details.
- **Real per-language URL routing** — the translation content already exists (`src/i18n/locales/`, ~30 languages); building actual crawlable localized routes on top of it is a legitimate larger project the owner may want, but it's out of scope for this brief (TASK-02 only removes the non-functional hreflang noise, it doesn't build the real thing).
- **Consent/CMP for third-party trackers** (PostHog EU+US, Microsoft Clarity, LinkedIn Insight, Meta Pixel, Reddit Pixel — confirmed initialized in `src/lib/posthog.ts`, `src/lib/clarity.ts`, and inline LinkedIn pixel in `index.html`) — no consent-gating mechanism currently exists anywhere in `src/`. Given the site explicitly serves EU markets, this is a compliance decision with legal/spend implications, not a pure technical fix — do not add or remove tracker code.
- **pSEO generator rewrite** — if TASK-05's spot-check finds real template-duplication problems, scope a fix as a separate project; do not attempt a generator-level rewrite inside this brief.
- Anything not listed as a numbered TASK above.

---

**End of brief.** Work top to bottom by priority (P1 → P2 → verification-only tasks), verify after the deploy per §5a before considering the run complete, and never skip the §0.1 collision check between work sessions.
