# HERMES TASK — sipiteno.com Conversion Repair

**Target site:** sipiteno.com
**Repo:** `~/sipiteno` — Vite + React SPA (TypeScript), branch `main`, prerendered at build time
**Vercel project:** `sipiteno` / `prj_RNHMEShbWKAOYXWcS3MoCv2E367z` (deploy mode: **prebuilt**)
**Authored:** 2026-07-22
**Executor:** Hermes Agent (DeepSeek v4 Pro), autonomous
**Objective:** Repair the lead-conversion path. This site has (a) an **analytics blackout that hides exactly the visitors most likely to convert**, (b) **four fabricated proof claims replicated across 8 language files**, (c) a **visibly broken German stat block**, and (d) an **8-field form on the only macro-conversion path**. All four are proven below against real source.

---

## 0. READ THIS FIRST — THE FOUR HARD RULES

These override everything else in this file.

### RULE 1 — NEVER FABRICATE PROOF, AND NEVER "IMPROVE" A NUMBER
This site currently ships four unverifiable claims (Section 2.2). Your job is to **remove or neutralise** them, never to replace them with different invented numbers. You may not write a new statistic, subscriber count, satisfaction score, slot count, or dollar figure unless you can point to a file in this repo that sources it. "Join 400 founders" is exactly as forbidden as "Join 1,247 founders". When in doubt, delete the claim and say so in the report.

### RULE 2 — TWO BUILD LANDMINES HAVE WHITE-SCREENED PRODUCTION BEFORE
`scripts/predeploy-check.sh` hard-fails the deploy on both, and they are in the repo for a reason:
- **Never add `manualChunks`** to `vite.config.ts`. It white-screened production **twice**.
- **Never add a `<link href=".../ux.css">`** to the SPA `index.html`. It bundles pSEO global styles into the app CSS and breaks the design system.

Do not "optimise the bundle". Do not touch `vite.config.ts` at all.

### RULE 3 — THE POSITIONING GUARDRAIL WILL FAIL YOUR BUILD
`scripts/guard-positioning.mjs` runs **first** in `npm run build` and fails the build if any scanned file contains privacy-/anonymous-browsing positioning (`private browsing`, `browser fingerprint`, `anti-tracking tool`, `zero-trace browsing`, etc.). This brand is **not** a privacy tool. None of your copy edits should go near that vocabulary — but if the build dies with `🚨 POSITIONING GUARDRAIL FAILED`, read the violation, revert the offending line, and do not attempt to weaken the guard.

### RULE 4 — EVERY COPY STRING LIVES IN 8 LANGUAGE FILES
Copy is **not** in the components. It is in i18n dictionaries:
```
src/i18n/en.ts                      <- English (base)
src/i18n/locales/{de,es,fr,it,ku,lt,ro}.ts   <- 7 translations
```
A claim removed from `en.ts` alone is **still live** for German, Spanish, French, Italian, Kurdish, Lithuanian and Romanian visitors. Every content change in this task must be applied to **all 8 files** or explicitly recorded as skipped.

---

## 1. PRE-FLIGHT (abort conditions)

```bash
cd ~/sipiteno
```

**1.1 — Is another agent working this repo?**
```bash
ps aux | grep -i hermes | grep -v grep
```
A `hermes-webui/server.py` and `hermes_cli.main serve` are normal (always-on gateway). **ABORT** only if a process references `sipiteno` or a `vercel` deploy in flight.

**1.2 — Branch clean, rollback point recorded.**
```bash
git branch --show-current      # expect: main
git status --short             # expect: CLEAN
git rev-parse HEAD             # RECORD THIS — rollback target
```
**ABORT** if the tree is dirty — someone else is mid-edit.

**1.3 — Vercel binding.**
```bash
grep projectName .vercel/project.json   # MUST read "sipiteno"
```
**ABORT** if it is anything else.

**1.4 — Git author (Vercel blocks non-team authors).**
```bash
git config user.email   # MUST be sales@sipiteno.com
```

**1.5 — Baseline the live site.**
```bash
curl -s https://sipiteno.com/ | wc -c                      # expect ~46703
curl -s https://sipiteno.com/ | grep -c "Expansion System" # expect 2 (prerender IS working)
curl -s -o /dev/null -w "%{http_code}\n" https://sipiteno.com/contact
```

**1.6 — Confirm the build is green BEFORE you change anything.**
```bash
npm run build
```
If the build fails on a clean tree, **ABORT** — you must not attribute a pre-existing breakage to your own edits.

---

## 2. THE DIAGNOSIS (verified against source — do not re-litigate)

### 2.0 — TWO AUDIT CLAIMS ARE WRONG. DO NOT ACT ON THEM.

A prior audit produced two findings that are **false**. Acting on them would waste the whole run:

- ❌ *"Raw HTML ships an empty body, the page is fully client-rendered; add SSR/prerendering."*
  **FALSE.** `scripts/prerender.mjs` already runs in the build. Live proof: `curl https://sipiteno.com/` returns **46,703 bytes** with the hero string `Expansion System` present **twice**. Prerendering works. **Do not build an SSR pipeline.**

- ❌ *"No site-specific conversion events are instrumented; add them."*
  **FALSE.** `contact_form_submitted`, `contact_form_failed`, `lead_magnet_requested`, `lead_magnet_failed` and `ai_referral_visit` are all already wired via `trackEvent` (`src/components/Contact.tsx:56,60`, `src/components/LeadMagnet.tsx:40,44`). **Do not re-instrument them.** The reason they never appear in PostHog is Section 2.1 — a delivery bug, not a missing-code bug.

### 2.1 — P0: The returning-visitor analytics blackout

PostHog reports **0** `contact_form_submitted` and **0** `lead_magnet_requested` events for this site in 90 days, despite both being correctly instrumented. Here is why.

`src/lib/posthog.ts` buffers events into a `queue[]` and only flushes them once `initPostHogDeferred()` runs:
```ts
export function capture(name, properties) {
  if (client) { client.capture(name, properties); }
  else { queue.push([name, properties]); }   // <- buffered, flushed ONLY on init
}
```

`src/components/CookieConsent.tsx` calls `initPostHogDeferred()` in **exactly one place** — inside `acceptAll()` (line 24), the click handler of the consent banner:
```ts
useEffect(() => {
  const t = setTimeout(() => { if (!hasConsented()) setVisible(true); }, 400);
  return () => clearTimeout(t);
}, []);

if (!visible) return null;          // <- returning visitors bail out here

function acceptAll() {
  setConsent({ analytics: true, experience: true });
  initPostHogDeferred();            // <- the ONLY call site
  ...
}
```

**The bug:** the `useEffect` checks `hasConsented()` only to decide whether to *show the banner*. When a returning visitor **has already consented**, the banner stays hidden, the component early-returns `null`, and **`initPostHogDeferred()` is never called again**. PostHog never initialises. Every event that visitor fires is pushed into a queue that is never flushed, then discarded on page unload.

**Consequences, in order of severity:**
1. **Every conversion by a returning visitor is permanently lost.** B2B consulting buyers essentially never convert on first visit — they research, leave, and come back. This site is structurally blind to precisely the visitors most likely to convert.
2. Only the *single session in which someone clicks Accept* is ever measured. Every later session is invisible.
3. The same early-return kills `initClarityDeferred()`, `trackAiReferral()` and `initMarketingPixels()` for returning visitors — so Clarity recordings, AI-referral attribution and retargeting pixels are all dead for repeat traffic too.

The site's reported "11.5% bounce / 2.4 pageviews per session" is therefore measured almost entirely on **first-time, banner-accepting** visitors, and is not representative.

### 2.2 — P0: Four fabricated proof claims, replicated across 8 language files

| Claim | Where (English) | Problem |
|---|---|---|
| `Join 1,247 founders using this playbook` | `src/i18n/en.ts:355` (`joinLine`) | No source. Site has had ~185 visitors in 90 days. |
| `Strategy call slots remaining this month: 5 of 12` | `src/i18n/en.ts:356-357` (`slotsLine`, `slotsValue`) | Hardcoded string — it is **not** a live counter. It has read "5 of 12" every month forever. |
| `Only 5 of 12 strategy call slots available this month` | `src/i18n/en.ts:397` (`slotCounter`) | Same hardcoded scarcity, second location. |
| `4.9/5` Average Client Satisfaction | `src/i18n/en.ts:92` (`stat2`), `:387`, `:565` (`stat4`) | No review platform, no sample size, no source. |
| `Every month you delay is ~$8,500 in unrealized pipeline` | `src/i18n/en.ts:56` (`costDelay`) | Presented as a specific figure with no derivation. |

Find every instance:
```bash
grep -rn "1,247\|5 of 12\|4\.9/5\|8,500" src/i18n/
```
Expect hits in `en.ts` **and** `locales/{de,es,fr,it,ku,lt,ro}.ts`.

These target sophisticated B2B buyers who perform diligence. A single "prove the 1,247" question destroys the engagement. Hardcoded scarcity that never changes is the easiest of all to catch.

### 2.3 — P0: The German stat block renders as broken code

`src/i18n/locales/de.ts` lines **307** and **485** contain malformed escaped quotes:
```
stat4: "4.9/5\", stat4Label: \"Durchschnittliche Kundenzufriedenheit",
stat4: "4.9/5\", stat4Label: \"Kundenzufriedenheit",
```
Because the inner quotes are escaped, the whole thing is a **single string value**. German visitors literally see:
```
4.9/5", stat4Label: "Durchschnittliche Kundenzufriedenheit
```
rendered on the page — and the `stat4Label` key **does not exist** for German at all. Compare the correct English form (`src/i18n/en.ts:387`):
```
stat4: "4.9/5", stat4Label: "Average Client Satisfaction",
```
Check for the same corruption in the other six locales:
```bash
grep -rn '\\", stat4Label' src/i18n/locales/
```

### 2.4 — P1: The 8-field contact form is the only macro-conversion path

`src/components/Contact.tsx` renders: **Full Name\***, Company, **Email\***, Phone, Country (28-option select), Service Interest (select), How-did-you-hear (select), **Message\*** (min-10-chars, validated), plus a honeypot. Three required, eight visible.

This is the single highest-friction point on the site's only real conversion path, and it sits in front of a first contact with a stranger.

### 2.5 — P2: Rule-of-One violation

The homepage inlines **6 services** and **8 pricing tiers**, with CTAs competing across `Get the Free Playbook`, `book a free 30-min strategy call`, `Download Free`, `Book a Call`, `See Pricing` (×3), `Claim Your Free Strategy Call`, `Send Me The Playbook`. No single dominant next step.

---

## 3. EXECUTION

Work in order. Each step has a gate. A failed gate → revert **that step only**, record it, continue.

### STEP 3.1 — Fix the analytics blackout (do this FIRST; nothing else is measurable until it lands)

**File:** `src/components/CookieConsent.tsx`

**Action:** In the existing `useEffect`, when `hasConsented()` returns **true**, re-run the same initialisers that `acceptAll()` runs. Respect the stored granular consent — do **not** initialise analytics for a visitor who stored `analytics: false`.

Read the stored state with `getConsent()` from `@/lib/consent` (it returns `{analytics, experience, timestamp} | null`) and gate each initialiser on the matching flag:
- `analytics: true` → `initPostHogDeferred()`, `trackAiReferral()`, `initMarketingPixels()`
- `experience: true` → `initClarityDeferred()`

Requirements:
- The banner's visibility logic must be **unchanged** — a consented visitor still sees no banner.
- The init must run **once** per page load (guard with the existing `initialized` latch inside `initPostHogDeferred`, which already self-guards; add a local ref only if you introduce a new call path).
- Import whatever is missing (`getConsent`) at the top of the file.
- Do **not** move the init out of the consent flow entirely — that would initialise analytics for people who never consented and is a GDPR violation.

**Gate 3.1 — all must pass:**
```bash
# init is now reachable from the effect, not only from acceptAll
grep -c "initPostHogDeferred" src/components/CookieConsent.tsx   # MUST be >= 2 (import + >=2 call sites)
# consent is still respected — a bare unconditional init is a FAIL
grep -n "getConsent\|hasConsented" src/components/CookieConsent.tsx
npx tsc --noEmit    # MUST pass (or `npm run lint` if tsc is not wired)
```
**FAIL the step** if you initialised analytics without checking stored consent. Revert and record.

---

### STEP 3.2 — Remove the fabricated proof from all 8 language files

Apply to `src/i18n/en.ts` **and** all seven `src/i18n/locales/*.ts`.

**3.2a — `joinLine` ("1,247 founders")**
Replace the count with a claim that needs no number. English: `"Get the playbook used to expand into emerging markets. Start reading in 5 minutes."` Translate the same meaning for each locale, preserving that locale's tone. **Do not substitute a smaller invented number.**

**3.2b — Hardcoded scarcity (`slotsLine`, `slotsValue`, `slotCounter`)**
This is fake scarcity — a constant string pretending to be a live counter. **Delete the claim.** Prefer removing the keys entirely and the JSX that renders them. If removing the key would break a component that reads it, set the value to an empty string `""` and make the component render nothing when empty — never leave a stale number on screen.

Find the render sites before editing:
```bash
grep -rn "slotsLine\|slotsValue\|slotCounter" src/
```

**3.2c — `4.9/5` satisfaction (`stat2`, `stat4`)**
There is no review source. **Remove the statistic and its label** from the stat blocks in all 8 files, and drop the now-empty stat cell in the component that renders it. If removing a cell breaks a 4-column grid layout, reflow to 3 columns rather than backfilling another invented stat.

**3.2d — `costDelay` ("~$8,500 in unrealized pipeline")**
Replace the fabricated figure with the qualitative claim. English: `"Every month you delay is pipeline you never see."` Keep the loss-aversion framing; drop the unsourced number.

**Gate 3.2:**
```bash
grep -rn "1,247\|5 of 12\|4\.9/5\|8,500" src/i18n/   # MUST return NOTHING
grep -rniE "join [0-9,]+ (founders|clients|companies)" src/i18n/ | wc -l   # MUST be 0
npx tsc --noEmit
```
If the first command returns any line, the claim is still live in some language. **Not done.**

---

### STEP 3.3 — Repair the malformed German strings

**File:** `src/i18n/locales/de.ts`, lines **307** and **485** (and any sibling found by the `grep` in 2.3).

If Step 3.2c removed `stat4`/`stat4Label` outright, this may already be resolved — verify. If the keys survive in some form, rewrite them as two properly separated keys matching the shape used in `en.ts`, with correct German labels and **no** escaped inner quotes.

**Gate 3.3:**
```bash
grep -rn '\\", stat4Label' src/i18n/     # MUST return NOTHING
node -e "import('./src/i18n/locales/de.ts').catch(e=>{console.error(e);process.exit(1)})" 2>/dev/null || npx tsc --noEmit
```

---

### STEP 3.4 — Cut the contact form from 8 fields to 3

**File:** `src/components/Contact.tsx`

**Keep visible:** `fullName` (required), `email` (required), `message` (required).
**Remove from the initial view:** `companyName`, `phone`, `country`, `service`, `hearAboutUs`.

Implementation constraints:
- **Keep the `honeypot` field.** It is spam protection. Do not remove it.
- Keep the `service` and `country` values flowing to the API — send `""`/`"not_specified"` rather than deleting the keys from the POST body, so `/api/contact` and the `trackEvent("contact_form_submitted", {service, country})` properties keep their shape. **Do not change `api/contact.js`.**
- Preserve every accessibility attribute already present on the surviving fields (`aria-required`, `aria-invalid`, `aria-describedby`, the `*-error` paragraphs, the `aria-live` char counter). This form is properly accessible today; keep it that way.
- Relax the `message` minimum-length validation from 10 characters to a soft minimum, or drop the hard block — a real enquiry can be "Can we talk Tuesday?".
- Optionally place the five removed fields behind a **"Add project details (optional)"** progressive-disclosure toggle, collapsed by default. If a toggle adds risk, simply drop the fields.

**Gate 3.4:**
```bash
grep -c "honeypot" src/components/Contact.tsx     # MUST still be >= 2
grep -c "aria-required" src/components/Contact.tsx # MUST still be >= 2
npx tsc --noEmit
git diff --stat api/                               # MUST be empty — the API is untouched
```

---

### STEP 3.5 — One dominant homepage goal (lowest priority; skip if time-boxed)

Pick **one** primary homepage CTA: **"Get the Free Expansion Playbook"** (the lead magnet). It is the lowest-friction entry to the value ladder and already has working instrumentation (`lead_magnet_requested`).

- Keep exactly **one** visually primary button in the hero.
- Demote `See Pricing`, `Book a Call`, and the service catalogue to secondary/text links.
- Do **not** delete the pricing or services sections — only reduce their CTA weight.

**Gate 3.5:** build succeeds and the hero contains a single primary-styled button. Verify visually in `dist/index.html` after build.

---

## 4. VALIDATION (before any deploy)

```bash
cd ~/sipiteno

# 4.1 No fabricated claims survive in ANY language
grep -rn "1,247\|5 of 12\|4\.9/5\|8,500" src/i18n/          # MUST be empty
grep -rn '\\", stat4Label' src/i18n/                         # MUST be empty

# 4.2 Types compile
npx tsc --noEmit

# 4.3 FULL BUILD — this runs guard-positioning, prerender, sitemap,
#     answer-engine, predeploy-check and the prebuilt sync, in order.
npm run build
```

`npm run build` must end with **`PREDEPLOY OK`** and the `sync-vercel-prebuilt` line. It hard-fails on:
- privacy-positioning contamination (`🚨 POSITIONING GUARDRAIL FAILED`),
- `<link ... ux.css>` present in `dist/index.html`,
- `manualChunks` present in `vite.config.ts`,
- missing `dist/404.html` / `dist/sitemap.xml` / entry bundle,
- a `"like Poland or India"` scaled-content artifact in `dist/`.

**Do not deploy unless the build prints `PREDEPLOY OK`.**

```bash
# 4.4 Prerender still emits real content (regression check vs the 1.5 baseline)
wc -c dist/index.html                       # expect roughly the ~46 KB baseline, NOT ~1 KB
grep -c "Expansion System" dist/index.html  # MUST be >= 1

# 4.5 Nothing outside intended scope is staged
git status --short
```

---

## 5. COMMIT & DEPLOY

**5.1 — Stage explicitly by path.**
```bash
git add src/components/CookieConsent.tsx src/components/Contact.tsx \
        src/i18n/en.ts src/i18n/locales/de.ts src/i18n/locales/es.ts \
        src/i18n/locales/fr.ts src/i18n/locales/it.ts src/i18n/locales/ku.ts \
        src/i18n/locales/lt.ts src/i18n/locales/ro.ts
git status --short   # REVIEW before committing
```

**5.2 — Commit.**
```bash
git commit -m "fix(sipiteno): restore analytics for returning visitors, remove unsourced proof, cut contact form

- CookieConsent: init PostHog/Clarity/pixels for already-consented returning visitors
  (init previously ran only inside acceptAll, so every repeat-visit conversion was dropped)
- i18n: remove 1,247-founders, 5-of-12-slots, 4.9/5 and \$8,500 claims across all 8 locales
- de.ts: repair malformed stat4/stat4Label escaped-quote strings
- Contact: 8 visible fields -> 3 (name, email, message); honeypot and a11y preserved"
```

**5.3 — Deploy (prebuilt — the build already synced `dist/` → `.vercel/output/static/`).**
```bash
vercel deploy --prebuilt --prod --archive=tgz
```
`--prebuilt` is required: the 8-stage pipeline runs locally, not on Vercel. `--archive=tgz` avoids the large-tree upload failures seen on this account.

**Known flake:** Vercel deploys from this machine get stuck reporting `UNKNOWN` roughly half the time. Wait 60s and re-run the identical command **once**. If it fails twice, stop and report — do not loop.

---

## 6. POST-DEPLOY VERIFICATION

```bash
sleep 45

# 6.1 Site is alive and still prerendered (white-screen regression check)
curl -s https://sipiteno.com/ | wc -c                       # expect ~46 KB, NOT ~1 KB
curl -s https://sipiteno.com/ | grep -c "Expansion System"  # MUST be >= 1

# 6.2 Fabricated claims are gone from the SERVED html
curl -s https://sipiteno.com/ | grep -c "1,247"   # MUST be 0
curl -s https://sipiteno.com/ | grep -c "5 of 12" # MUST be 0
curl -s https://sipiteno.com/ | grep -c "4.9/5"   # MUST be 0

# 6.3 Key routes healthy
for u in / /contact /pricing; do
  printf "%s -> %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://sipiteno.com$u)"
done   # ALL MUST be 200
```

**Rollback** if any check fails, or if the homepage renders blank:
```bash
git revert --no-edit HEAD
npm run build && vercel deploy --prebuilt --prod --archive=tgz
```

**Measurement note:** Step 3.1 will cause measured sessions, pageviews and event volume to **rise**, and the reported bounce rate to change, because returning visitors become visible for the first time. That is the fix working — it is **not** a traffic spike and must not be reported as growth. Note the deploy timestamp in the report so the discontinuity is attributable.

---

## 7. REPORT (write this file, always — even on abort)

Write `~/sipiteno/HERMES_REPORT_CONVERSION_REPAIR.md` with:

1. **Locale coverage table** — for each of the 8 i18n files: which of the four claims were found, and which were removed. Any file you could not fully clean must be named explicitly.
2. **Consent-init fix** — the exact new call sites, and confirmation that stored `analytics:false` / `experience:false` are still respected.
3. **Contact form** — fields before/after, and confirmation that `api/contact.js` was untouched and the honeypot survives.
4. **Steps completed vs skipped**, with the gate output that caused each skip.
5. **Before/after** of the Section 1.5 and Section 6 curl baselines.
6. **Owner-gated / out-of-scope items to escalate:**
   - Testimonials are fully anonymised ("Testimonials anonymized per client request"). For a high-ticket B2B buyer this carries little weight — the owner should obtain **1–2 named, logo'd, LinkedIn-verifiable** references. You must not invent these.
   - No risk-reversal exists on engagements priced $15K–$100K. The sister site gitdealflow uses an explicit "30-day Signal-or-It's-Free" guarantee; the owner should decide on equivalent milestone-based terms. **Do not invent guarantee terms** — they are a contractual commitment.
   - sipiteno.com is still on the **old Resend team** (all other portfolio domains migrated to the "sipiteno" Pro team); a Cloudflare verification step is pending. Deliverability of `/api/contact` notifications may be affected.
   - No exit-intent capture exists on this site. Worth adding later, but only after Step 3.1 makes its effect measurable.

---

## 8. WHAT SUCCESS LOOKS LIKE

- `grep -rn "1,247\|5 of 12\|4\.9/5\|8,500" src/i18n/` returns **nothing** — in all 8 languages.
- German no longer renders `4.9/5", stat4Label: "…` as visible text.
- `initPostHogDeferred()` runs for **returning consented** visitors, and `contact_form_submitted` / `lead_magnet_requested` begin appearing in PostHog for the first time.
- Stored consent is still honoured — nothing initialises for a visitor who declined.
- The contact form asks for **3** fields, keeps its honeypot, and keeps every ARIA attribute.
- `npm run build` prints `PREDEPLOY OK`; the live homepage still returns ~46 KB of prerendered HTML.
- `api/contact.js` and `vite.config.ts` are **unmodified**.

**The deepest point:** this site's copy, value ladder and pricing honesty are genuinely good — the audit rated the writing well above the portfolio average, and the accessibility work in the contact form is better than most commercial sites. It generates no measurable leads because **the analytics stop recording the moment a visitor becomes a returning visitor, and the proof on the page won't survive thirty seconds of buyer diligence.** Fix the measurement and the credibility; leave the persuasion alone.
