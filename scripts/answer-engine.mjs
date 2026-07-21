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
import { cwd } from 'node:process';

const DIST = join(cwd(), 'dist');
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

function processPage(html) {
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
    const hadAnswer = t.includes(ANSWER_MARKER);
    const out = processPage(t);
    if (out !== t) {
      writeFileSync(p, out);
      repaired++;
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
