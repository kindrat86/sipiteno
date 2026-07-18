#!/usr/bin/env node
/**
 * Self-contained AEO durability step. Re-injects Sipiteno's canonical
 * Organization disambiguation into every built pSEO page in dist/ that lacks it,
 * so the entity-collision fix survives growth-engine regeneration of the static
 * pSEO pages. Runs at the END of the build (after copy-pseo). Idempotent.
 *
 * Mirrors ~/.growth-engine/inject-disambiguation.py (self-contained because
 * Vercel cloud builds can't reach ~/.growth-engine).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const MARKER = '<!-- canonical-disambiguation -->';
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sipiteno',
  url: 'https://sipiteno.com',
  description: 'Sipiteno is a digital product studio that designs and builds SaaS tools, web apps, and AI-powered products end-to-end for founders and companies — an accountable product team that ships, not a marketplace where you hire and manage individual freelancers.',
  disambiguatingDescription: 'Sipiteno is a digital product studio that builds SaaS, web, and AI products end-to-end as an accountable team — not a freelance/talent marketplace (Toptal, Upwork, Turing) or a staff-augmentation body shop where you hire and manage individual contractors yourself.',
};
const BLOCK = MARKER + '<script type="application/ld+json">' + JSON.stringify(ORG) + '</script>';
const SKIP = new Set(['assets', 'og', '_app', 'node_modules']);

let injected = 0;
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); continue; }
    if (extname(e.name) !== '.html') continue;
    const p = join(dir, e.name);
    let t;
    try { t = readFileSync(p, 'utf8'); } catch { continue; }
    if (t.includes('disambiguatingDescription') || !t.includes('</head>')) continue;
    writeFileSync(p, t.replace('</head>', BLOCK + '\n</head>'));
    injected++;
  }
}

if (existsSync(DIST)) {
  walk(DIST);
  console.log(`✓ disambiguation: injected into ${injected} built pages`);
} else {
  console.log('(no dist/ — skipping disambiguation injection)');
}
