# HERMES TASK — sipiteno.com: AI Answer-Engine + Scaled-Content Repair Layer

> **Runbook for:** Hermes Agent running DeepSeek v4 Pro
> **Repo:** `~/sipiteno` (Vite + React SPA + ~827 static pSEO pages)
> **Deploy:** Vercel **prebuilt** (built locally, synced — NOT a git-push build)
> **Author of runbook:** Claude (2026-07-21). Grounded in a live audit of the repo.
> **Estimated effort:** 1 focused session. Everything here is deterministic and safe.

---

## 0. TL;DR — what you are building and why

sipiteno.com has **827 live pages** with rich schema already. It does **not** need more pages or more schema. A live audit found the whole pSEO fleet is carrying **template-generation artifacts** that make it look machine-spun to Google's *scaled-content-abuse* system — the single most likely reason organic traffic is near-zero despite the page count.

You will ship **one new build-time script** (`scripts/answer-engine.mjs`) plus a few small edits that do two things:

1. **REPAIR** (remove the suppression fingerprint) — deterministically fix the template artifacts across all built pages.
2. **DIFFERENTIATE** (the new growth lever we don't have) — inject a visible, machine-extractable **"Short answer" block** right under each page's `<h1>`, optimized to win **Google AI Overviews and featured snippets**, reusing copy that's already on the page.

This mirrors the repo's existing proven pattern (`scripts/inject-disambiguation.mjs`): an **idempotent post-build injector that runs on `dist/` every build**, so it survives any future regeneration by the growth-engine.

---

## 1. 🚨 HARD GUARDRAILS — READ BEFORE TOUCHING ANYTHING

These are non-negotiable. Violating any one of them has broken this site or misled users before.

### 1a. NEVER fabricate. This is the #1 rule.
- **Do NOT invent** statistics, numbers, percentages, prices, client names, testimonials, founder names, dates, employee counts, or "X,000+ developers" style claims.
- Every "Short answer" block you inject must be built **only from text already present on that same page** (its existing `Article` schema `description`). You are re-surfacing existing copy, not writing new claims.
- If a fact isn't already on the page, it does not go on the page. When in doubt, leave it out.
- (This project has a documented history of fabricated-stat incidents — e.g. "2,400+ SaaS businesses", "3,200 contractors". Do not add to that list.)

### 1b. Respect the positioning guard.
- `scripts/guard-positioning.mjs` runs first in the build and **fails the build** if positioning language is wrong. Sipiteno is a **"digital product studio that builds SaaS/web/AI products end-to-end"** — NOT a freelancer marketplace, NOT a staff-augmentation body shop. Do not introduce copy that contradicts this.
- After any edit to `index.html`, run `npm run guard:positioning` and make sure it passes.

### 1c. Known site-breaking gotchas — do not trip these.
- **NEVER link `/ux.css` from the SPA `index.html`.** It bundles global button/link/img rules into the app CSS and breaks the design system. (You may freely use `/ux.css` styles inside the static pSEO pages — the ban is only the SPA shell.)
- **NEVER add `manualChunks`** to the Vite config — it has white-screened this site twice.
- **Do not remove or reorder the Trusted-Types `createPolicy` script** at the very top of `index.html`. The CSP enforces `require-trusted-types-for 'script'`; without that policy the whole page throws and renders blank.
- Your injected HTML must be **static markup only** (no inline `<script>` that assigns innerHTML/src), so Trusted Types can't trip on it. JSON-LD `<script type="application/ld+json">` is fine (it's not executed).

### 1d. Idempotency is mandatory.
- The script runs on **every** build. It MUST detect already-processed pages and skip them (marker-based), and MUST be safe to run twice with no double-injection and no drift. Test this (Section 6).

### 1e. Deploy discipline.
- This site deploys **Vercel prebuilt** (build locally → sync). Do **not** `git push` expecting a cloud build.
- Before any deploy, confirm git author is set (`git config user.email` → must be a team member, e.g. `sales@sipiteno.com`; Vercel blocks deploys from unknown authors).
- **Do NOT deploy automatically.** Build locally, run all validations in Section 6, then STOP and report results. A human approves the deploy.

---

## 2. The exact problems you are fixing (verified 2026-07-21)

| # | Artifact | Where | Count | Fix |
|---|---|---|---|---|
| A | `over better-known tech destinations like Poland or India` — hardcoded; wrong on every non-Poland page and self-referential on the Poland page | visible body **and** FAQPage JSON-LD | 336 pages / 673 hits | Replace with a generic, true phrasing (no country names) |
| B | `compares favorably to Poland's 40-70/hr` — every country compared to Poland, including Poland to itself | visible body **and** JSON-LD | 336 pages | Replace with `Western European and North American rates` |
| C | Lowercase service names mid-sentence: `ai consulting`, `it consulting`, `mvp development`, etc. | prose + JSON-LD text | 79+ pages | Capitalize known acronym/service phrases |
| D | Duplicate `"description"` key in the homepage `Organization` JSON-LD (invalid — silently drops one) | `index.html` `<head>` | 1 | Remove the redundant key by hand |
| E | **No visible, extractable answer block** under any `<h1>` (answers are buried only in schema) | all pSEO pages | 827 | Inject a "Short answer" block from existing copy (the new lever) |

> Note on scope: the *source-of-truth* generators (`_gen_country_services.py`, `_pseo_expand.py`) still contain bugs A–C, so a raw regen would reintroduce them. The post-build injector below neutralizes this on `dist/` **every build**, which keeps production clean regardless. Fixing the Python generators is an OPTIONAL durability task (Section 7).

---

## 3. Deliverable 1 — create `scripts/answer-engine.mjs`

Create this file **exactly**. It is self-contained Node ESM (no dependencies), mirrors `inject-disambiguation.mjs`, and is idempotent.

```js
#!/usr/bin/env node
/**
 * answer-engine.mjs — sipiteno.com AI Answer-Engine + scaled-content repair.
 *
 * Post-build, idempotent. Runs on dist/ AFTER copy-pseo + inject-disambiguation,
 * BEFORE predeploy-check. Two jobs, both deterministic:
 *   1) REPAIR template artifacts (A/B/C) that create a scaled-content-abuse
 *      fingerprint across the pSEO fleet.
 *   2) DIFFERENTIATE: inject a visible, extractable "Short answer" block under
 *      each <h1> (AI Overviews / featured-snippet optimization), built ONLY from
 *      the page's existing Article schema description. Never invents facts.
 *
 * Safe to run any number of times. Self-contained (Vercel cloud can't reach
 * ~/.growth-engine — same reason inject-disambiguation.mjs is self-contained).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const SKIP = new Set(['assets', 'og', '_app', 'node_modules']);
const ANSWER_MARKER = 'data-sip-answer';

// --- REPAIR RULES (deterministic string/regex replacements) ------------------
// Order matters: run acronym casing last so it also fixes replacement text.
const REPAIRS = [
  // A) hardcoded self-referential peer comparison -> generic, true phrasing
  [/over better-known tech destinations like Poland or India/g,
   'over better-known, higher-cost tech destinations'],
  // B) broken price self-comparison -> the true intended meaning (no fake number)
  [/compares favorably to [A-Za-z][A-Za-z .]*?'s \$?\d[\d\-–]*\s*\/?\s*hr/g,
   'compares favorably to Western European and North American rates'],
  // C) acronym / service-name casing. Slugs use hyphens, so spaced prose only.
  [/\bai consulting\b/g, 'AI consulting'],
  [/\bai implementation\b/g, 'AI implementation'],
  [/\bai roadmaps?\b/g, 'AI roadmap'],
  [/\bit consulting\b/g, 'IT consulting'],
  [/\bmvp development\b/g, 'MVP development'],
  [/\bb2b partnerships\b/g, 'B2B partnerships'],
  [/\bsaas development\b/g, 'SaaS development'],
];

// --- helpers -----------------------------------------------------------------
function unescapeJson(s) {
  return s.replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/\\\\/g, '\\')
          .replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// Pull the Article schema description, trim to <=~55 words / 2 sentences.
function extractAnswer(html) {
  const m = html.match(/"@type":\s*"Article"[\s\S]*?"description":\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let text = unescapeJson(m[1]);
  if (!text || text.length < 40) return null;
  // Prefer first 2 sentences; hard-cap length.
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) text = (sentences[0] + sentences[1]).trim();
  const words = text.split(/\s+/);
  if (words.length > 55) text = words.slice(0, 55).join(' ').replace(/[,;:]$/, '') + '…';
  return text;
}

// HTML-escape for safe insertion into markup.
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pageUrl(html) {
  const c = html.match(/<link rel="canonical" href="([^"]+)"/);
  return c ? c[1] : null;
}

function injectAnswer(html) {
  if (html.includes(ANSWER_MARKER)) return html;      // idempotent
  const h1End = html.indexOf('</h1>');
  if (h1End === -1) return html;
  const answer = extractAnswer(html);
  if (!answer) return html;
  const url = pageUrl(html);

  const block =
    `<div ${ANSWER_MARKER}="1" style="margin:1rem 0 1.5rem;padding:1rem 1.25rem;` +
    `border-left:3px solid #f97316;background:rgba(249,115,22,.06);border-radius:6px;` +
    `font-size:1.05rem;line-height:1.6;max-width:65ch">` +
    `<strong>Short answer:</strong> ${esc(answer)}</div>`;

  const speakable = url
    ? `<script type="application/ld+json">` +
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': url,
        'speakable': { '@type': 'SpeakableSpecification', 'cssSelector': ['h1', `[${ANSWER_MARKER}]`] }
      }) + `</script>`
    : '';

  const after = h1End + '</h1>'.length;
  return html.slice(0, after) + block + html.slice(after) + speakable;
}

function process(html) {
  let out = html;
  for (const [re, rep] of REPAIRS) out = out.replace(re, rep);
  out = injectAnswer(out);
  return out;
}

// --- walk dist/ --------------------------------------------------------------
let repaired = 0, answered = 0, scanned = 0;
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); continue; }
    if (extname(e.name) !== '.html') continue;
    const p = join(dir, e.name);
    let t; try { t = readFileSync(p, 'utf8'); } catch { continue; }
    scanned++;
    const before = t;
    const hadAnswer = t.includes(ANSWER_MARKER);
    const out = process(t);
    if (out !== before) {
      writeFileSync(p, out);
      if (out !== before) repaired++;
      if (!hadAnswer && out.includes(ANSWER_MARKER)) answered++;
    }
  }
}

if (existsSync(DIST)) {
  walk(DIST);
  console.log(`✓ answer-engine: scanned ${scanned} pages, changed ${repaired}, answer-blocks added ${answered}`);
} else {
  console.log('(no dist/ — skipping answer-engine)');
}
```

**Make it executable:** `chmod +x scripts/answer-engine.mjs`

---

## 4. Deliverable 2 — wire it into the build chain

Edit `package.json`. Insert `node scripts/answer-engine.mjs` **after** `inject-disambiguation.mjs` and **before** `predeploy-check.sh`.

**Before:**
```
"build": "node scripts/guard-positioning.mjs && vite build && node scripts/prerender.mjs && bash scripts/copy-pseo.sh && node scripts/generate-sitemap.mjs && node scripts/inject-disambiguation.mjs && bash scripts/predeploy-check.sh && bash scripts/sync-vercel-prebuilt.sh"
```

**After:**
```
"build": "node scripts/guard-positioning.mjs && vite build && node scripts/prerender.mjs && bash scripts/copy-pseo.sh && node scripts/generate-sitemap.mjs && node scripts/inject-disambiguation.mjs && node scripts/answer-engine.mjs && bash scripts/predeploy-check.sh && bash scripts/sync-vercel-prebuilt.sh"
```

Change ONLY that one line. Do not touch other scripts.

---

## 5. Deliverable 3 — small hand-edits

### 5a. Fix the homepage duplicate `description` (problem D)
In `index.html`, inside the `Organization` JSON-LD block (`"@id": "https://sipiteno.com/#organization"`), there are **two** `"description":` keys. Keep the **first** one (the "digital product studio… accountable product team that ships" text — it matches the positioning guard). **Delete the second** `"description": "...founded in 2009… 28 countries…"` line entirely (including its trailing comma handling so the JSON stays valid).

After editing, verify:
```bash
node -e "const h=require('fs').readFileSync('index.html','utf8');const m=h.match(/<script type=\"application\/ld\+json\">([\s\S]*?#organization[\s\S]*?)<\/script>/);JSON.parse(m[1]);console.log('✓ homepage Organization JSON-LD is valid');"
npm run guard:positioning
```
Both must pass. If `guard:positioning` fails, you removed the wrong description — restore and remove the other one.

### 5b. (Optional, owner-gated) Founder `Person` entity — DO NOT auto-fill
A `Person` (founder) node is the strongest E-E-A-T + entity signal, but it requires a **real name** the owner must supply. **Do not invent one.** Leave this TODO in the runbook output for the owner:

> TODO(owner): provide founder display name to add a canonical `Person` node
> (`@id: https://sipiteno.com/#founder`, `worksFor` → `#organization`, `sameAs`:
> LinkedIn personal + GitHub `kindrat86`). Until provided, skip.

---

## 6. VALIDATION — run all of these; every one must pass before you stop

```bash
cd ~/sipiteno

# 1) Build (this runs the whole chain including answer-engine)
npm run build

# 2) Artifacts A & B must be GONE from dist/
echo "A remaining:"; grep -rc "like Poland or India" dist | grep -v ':0' | wc -l   # expect 0
echo "B remaining:"; grep -rEc "compares favorably to [A-Za-z]+'s [0-9]" dist | grep -v ':0' | wc -l  # expect 0

# 3) Answer blocks were injected (expect a large number, ~800+)
echo "answer blocks:"; grep -rl 'data-sip-answer' dist | wc -l

# 4) Idempotency: run the injector again — counts of NEW changes must be ~0
node scripts/answer-engine.mjs   # "answer-blocks added 0" on second run

# 5) No accidental double blocks on any page
echo "double-injected pages (must be 0):"; grep -rc 'data-sip-answer="1"' dist | awk -F: '$2>1' | wc -l

# 6) Validate a sample page's JSON-LD still parses
node -e "const h=require('fs').readFileSync('dist/poland/ai-consulting/index.html','utf8');const b=[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];b.forEach((m,i)=>{JSON.parse(m[1]);});console.log('✓ all',b.length,'JSON-LD blocks parse on sample page');"

# 7) Positioning guard still green
npm run guard:positioning

# 8) Spot-check the rendered answer block visually
grep -o 'data-sip-answer="1"[^>]*>[^<]*<strong>Short answer:</strong>[^<]*' dist/georgia/mvp-development/index.html | head -c 400; echo
```

If any check fails, **fix and rebuild** — do not deploy a failing build. If check #2 is not 0, the regex didn't match; print an offending line with `grep -rn "like Poland or India" dist | head -3` and adjust.

---

## 7. (Optional) Deliverable 4 — durable source fix + regression guard

These make the fix permanent even at the Python-generator layer. Do them only after 1–6 are green.

### 7a. Regression guard in `scripts/predeploy-check.sh`
Append (so a future regen that reintroduces the artifacts **fails the build** loudly):
```bash
# --- scaled-content-artifact guard (added by answer-engine task) ---
if grep -rq "like Poland or India" dist; then
  echo "PREDEPLOY FAIL: hardcoded 'Poland or India' artifact present in dist/"; exit 1; fi
if grep -rqE "compares favorably to [A-Za-z]+'s [0-9]" dist; then
  echo "PREDEPLOY FAIL: broken price self-comparison present in dist/"; exit 1; fi
```
(Place this BEFORE the final success echo. Since `answer-engine.mjs` runs first, these pass — the guard only fires on future regressions.)

### 7b. Fix the generators (source of truth)
Find the offending templates and correct the same three strings there:
```bash
grep -rn "better-known tech destinations like" _gen_country_services.py _pseo_expand.py
grep -rn "compares favorably to" _gen_country_services.py _pseo_expand.py
```
Replace the hardcoded `Poland or India` / `Poland's {rate}` template literals with the generic phrasings from Section 3's REPAIRS (or, better, with correctly-substituted per-country variables if the template has them). **Do not introduce new fabricated numbers.** This is optional because the post-build injector already keeps prod clean.

---

## 8. DEPLOY (only after human approval)

Do not deploy autonomously. When approved:
```bash
cd ~/sipiteno
git config user.email    # must print a team email (e.g. sales@sipiteno.com); if blank, STOP and report
git add -A && git commit -m "Add AI answer-engine + scaled-content repair layer"
# Deploy is Vercel PREBUILT (dist already built + synced by the build chain's
# sync-vercel-prebuilt.sh). Follow the repo's normal prebuilt deploy command.
```
After deploy: fetch 2–3 live URLs and confirm the "Short answer" block renders and the artifacts are gone:
```bash
curl -s https://sipiteno.com/poland/ai-consulting/ | grep -c "like Poland or India"   # expect 0
curl -s https://sipiteno.com/georgia/mvp-development/ | grep -c "data-sip-answer"      # expect 1
```

---

## 9. Post-deploy: submit for re-crawl (accelerates recovery)
- Google Search Console → **Sitemaps** → resubmit `https://sipiteno.com/sitemap.xml`.
- Use **URL Inspection → Request indexing** on 5–10 representative pages (highest-value country×service combos).
- Bing Webmaster Tools → resubmit sitemap.
- These don't create rankings; they tell the engines to re-evaluate the now-clean pages sooner.

---

## 10. Expected results (honest, mechanism-based estimates — not guarantees)

**This is a recovery + eligibility play, not an overnight spike.** Search systems re-evaluate quality over crawl cycles.

| Effect | Mechanism | Realistic outcome | When |
|---|---|---|---|
| **Removal of scaled-content-abuse fingerprint** | 827 pages stop sharing identical broken template text; each reads as intentional | The highest-upside item. If the fleet was algorithmically suppressed (most likely cause of near-zero organic despite 827 pages), impressions/clicks can **step-change up** as pages are re-crawled and re-scored | 3–8 weeks (crawl + re-eval) |
| **Featured snippets / AI Overviews** | Extractable 45-word "Short answer" directly under H1, backed by existing FAQPage schema | Pages that already rank on page 1 become **eligible to be the cited answer** → typically **+15–35% CTR** on those queries | 2–6 weeks after re-crawl |
| **AI-engine citation** (ChatGPT/Perplexity/Gemini) | Clean, factual, entity-consistent copy + concise answer blocks are far more quotable than broken template spam | Gradual increase in being **named/cited** for "AI consulting in {country}" style prompts | 6–16 weeks |
| **Per-page quality (E-E-A-T)** | Correct casing + coherent comparisons remove obvious low-quality signals | Compounding trust lift across the fleet | ongoing |

**Straight talk on limits:**
- If the fleet was **not** algorithmically suppressed, the repair still helps CTR and AI-citation but the lift is smaller. Either way the artifacts are pure downside removed.
- Answer blocks only help pages that **already earn impressions** — they raise CTR, they don't manufacture rankings from nothing.
- The biggest *remaining* lever after this (out of scope here) is **off-site authority/backlinks** — the on-site work removes the tax; external signals raise the ceiling.
- **Measure it:** in PostHog + Search Console, watch (a) total pSEO impressions, (b) average CTR, (c) pages getting ≥1 click/week. Compare 4-week windows before/after. Expect the impressions line to move first, clicks second.

---

## 11. If something goes wrong (rollback)
- The injector only writes to `dist/` (regenerated each build) plus one line in `package.json`, one JSON-LD edit in `index.html`, and optionally `predeploy-check.sh`. All are git-tracked.
- To roll back: `git revert` the commit, rebuild, redeploy. `dist/` is rebuilt clean from source on the next `npm run build`.
- If a build fails at `guard:positioning` or `predeploy-check`, the deploy never happens — that's by design. Read the failure message, fix, rebuild.

---

### Definition of done
- [ ] `scripts/answer-engine.mjs` created, executable, idempotent (Section 6 #4 shows "added 0" on 2nd run).
- [ ] `package.json` build chain includes it in the right position.
- [ ] Homepage `Organization` JSON-LD has exactly one `description`; guard passes.
- [ ] `npm run build` succeeds; validation checks #2 = 0 remaining artifacts, #3 ≈ 800+ answer blocks, #5 = 0 double-injects, #6/#7 pass.
- [ ] (Optional) regression guard + generator fixes done.
- [ ] Results reported to the human; **deploy left for human approval** (do not auto-deploy).
- [ ] No fabricated facts anywhere. (Re-read Section 1a.)
