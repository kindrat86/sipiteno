#!/usr/bin/env node
/**
 * Generates sitemap.xml from all prerendered/static HTML pages in dist/.
 * Run AFTER `vite build` + `prerender.mjs` + `copy-pseo.sh`.
 *
 * Scans dist/ for all index.html and *.html files, converts paths to URLs,
 * and writes a complete sitemap.xml to dist/sitemap.xml.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, realpathSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { execSync } from 'child_process';

const DIST = join(process.cwd(), 'dist');
const BASE = 'https://sipiteno.com';
const LOCALES = ['de', 'es', 'fr', 'it', 'ku', 'lt', 'ro'];

// Pages with noindex that should never appear in the sitemap
const NOINDEX_PAGES = ['terms', 'privacy', 'embed'];

// Deploy-context guard (2026-10-06): production deploys build inside `git
// archive` exports that have no .git/, so every gitDate() lookup below fails
// and the whole sitemap gets stamped with the build date. Live evidence:
// 2026-09-29→10-03 a redirect-only change restamped 279/280 URLs, teaching
// Google that sitemap lastmod is meaningless on this domain. In a git-less
// context we therefore keep the COMMITTED public/sitemap.xml (generated in
// the real repo, where git works) when its URL set matches this build, and
// FAIL the build when it does not — a changed URL set must never ship with
// build-date lastmods silently.
// True only when git can answer for THIS repo: a .git must exist here AND
// `git rev-parse --show-toplevel` must resolve to this exact directory.
// Without the toplevel check, a git-less deploy export nested under any git
// work tree (e.g. ~/.hermes, this Mac's config repo) silently borrows the
// PARENT repo's dates — verified live in a git-archive export test.
function gitWorksHere() {
  if (!existsSync(join(process.cwd(), '.git'))) return false;
  try {
    // Constant command string, no interpolation (lint: exec-safety noted).
    const top = execSync('git rev-parse --show-toplevel', { cwd: process.cwd(), encoding: 'utf8' }).trim();
    if (!top) return false;
    return realpathSync(top) === realpathSync(process.cwd());
  } catch {
    return false;
  }
}

function readCommittedSitemap() {
  const p = join(process.cwd(), 'public', 'sitemap.xml');
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}
function locSet(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
}

// Real per-page lastmod: instead of stamping every URL with "today" (which
// changes on every deploy and teaches Google to distrust the signal), look
// up the git commit date of whichever source file actually governs that
// URL's content. Most of the fleet is generated from a handful of shared
// data files / page templates, so this gives real, varied dates without
// needing a 1:1 file per URL.
const gitDateCache = new Map();
function gitDate(file) {
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let date = null;
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: process.cwd(), encoding: 'utf8' }).trim();
    date = out || null;
  } catch {
    date = null;
  }
  gitDateCache.set(file, date);
  return date;
}

function maxDate(...dates) {
  const valid = dates.filter(Boolean);
  return valid.length ? valid.sort().pop() : null;
}

const SERVICE_FILES = {
  'ai-consulting': 'src/pages/services/AIConsulting.tsx',
  'business-development': 'src/pages/services/BusinessDevelopment.tsx',
  'digital-marketing': 'src/pages/services/DigitalMarketing.tsx',
  'it-consulting': 'src/pages/services/ITConsulting.tsx',
  'project-management': 'src/pages/services/ProjectManagement.tsx',
  'sales-funnel': 'src/pages/services/SalesFunnel.tsx',
};

const HUB_FILES = {
  '': 'src/pages/Index.tsx',
  'about': 'src/pages/About.tsx',
  'alternatives': 'src/pages/Alternatives.tsx',
  'blog': 'src/pages/Blog.tsx',
  'case-studies': 'src/pages/CaseStudies.tsx',
  'contact': 'src/pages/Contact.tsx',
  'glossary': 'src/pages/Glossary.tsx',
  'industries': 'src/pages/Industries.tsx',
  'locations': 'src/pages/Locations.tsx',
  'methodology': 'src/pages/Methodology.tsx',
  'pricing': 'src/pages/Pricing.tsx',
  'privacy': 'src/pages/Privacy.tsx',
  'services': 'src/pages/Locations.tsx', // no dedicated hub file found; closest sibling
  'terms': 'src/pages/Terms.tsx',
};

// Fallback for clusters with no locatable source file in this repo (vs/,
// for/, alternatives-to/, learn/, dream100, expansion-system, free,
// affiliates) — the pSEO build pipeline's own last-touched date, which is
// still real and varies across deploys, just coarser than per-page.
const FALLBACK_FILE = 'scripts/prerender.mjs';

function lastmodFor(urlPath) {
  // Strip locale prefix (e.g. /de/locations/x -> /locations/x)
  let path = urlPath;
  for (const loc of LOCALES) {
    if (path === '/' + loc) { path = '/'; break; }
    if (path.startsWith('/' + loc + '/')) { path = path.slice(loc.length + 1); break; }
  }
  const segs = path.split('/').filter(Boolean);

  if (segs.length === 0) return gitDate(HUB_FILES['']) || gitDate(FALLBACK_FILE);

  const [first, second] = segs;

  if (first === 'services' && second && SERVICE_FILES[second]) {
    return gitDate(SERVICE_FILES[second]) || gitDate(FALLBACK_FILE);
  }
  if (first === 'locations') {
    return maxDate(
      gitDate('src/data/countries.ts'),
      gitDate('src/data/countryServices.ts'),
      gitDate('src/pages/LocationService.tsx'),
    ) || gitDate(FALLBACK_FILE);
  }
  if (first === 'industries' && second) {
    return maxDate(gitDate('src/data/industries.ts'), gitDate('src/pages/Industries.tsx')) || gitDate(FALLBACK_FILE);
  }
  if (first === 'case-studies' && second) {
    return maxDate(gitDate('src/data/projects.ts'), gitDate('src/pages/CaseStudyDetail.tsx')) || gitDate(FALLBACK_FILE);
  }
  if (first === 'blog' && second) {
    return maxDate(gitDate('src/data/blogTopics.ts'), gitDate('src/pages/BlogPost.tsx')) || gitDate(FALLBACK_FILE);
  }
  if (first === 'research' && second === 'organic-growth-experiment') {
    try {
      const manifest = JSON.parse(readFileSync('research/organic-growth-experiment/sources.json', 'utf8'));
      return manifest.published_at;
    } catch {
      return maxDate(
        gitDate('research/organic-growth-experiment/index.html'),
        gitDate('research/organic-growth-experiment/sources.json'),
      ) || gitDate(FALLBACK_FILE);
    }
  }
  if (segs.length === 1 && HUB_FILES[first]) {
    return gitDate(HUB_FILES[first]) || gitDate(FALLBACK_FILE);
  }

  // Unmapped clusters (vs/, for/, alternatives-to/, glossary/{term}, learn/,
  // dream100, expansion-system, free, affiliates, etc.)
  return gitDate(FALLBACK_FILE);
}

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run build first.');
  process.exit(1);
}

// Collect all HTML file paths relative to dist/
const htmlFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}
walk(DIST);

// Convert file paths to URLs
const urls = new Set();

// Always include the homepage
urls.add(BASE + '/');

for (const filePath of htmlFiles) {
  const relPath = relative(DIST, filePath);

  // Skip files we don't want in sitemap
  if (relPath.startsWith('admin') || relPath.startsWith('auth')) continue;
  if (relPath === '404.html') continue;

  // Skip locale-prefixed pages (de/, es/, fr/, etc.) — they duplicate English
  // content under locale prefixes with self-referencing canonicals, and Google
  // correctly flags them as "Alternative page with proper canonical tag."
  // Google discovers them via hreflang tags on the English canonical pages.
  if (LOCALES.some(loc => relPath.startsWith(loc + '/'))) continue;

  // Skip locale root pages (de.html, es.html, etc.) — same content issue
  if (LOCALES.some(loc => relPath === loc + '.html' || relPath === loc + '/index.html')) continue;

  // Skip noindex pages (terms, privacy, embed) — they must never appear in the sitemap
  if (NOINDEX_PAGES.some(np => relPath === np + '.html' || relPath === np + '/index.html' || relPath.startsWith(np + '/'))) continue;

  let urlPath;

  if (relPath === 'index.html') {
    urlPath = '/'; // already added
    continue;
  } else if (basename(relPath) === 'index.html') {
    // Directory-based: foo/bar/index.html -> /foo/bar
    urlPath = '/' + dirname(relPath).replace(/\\/g, '/');
  } else {
    // File-based: foo/bar.html -> /foo/bar
    const withoutExt = relPath.replace(/\.html$/, '');
    urlPath = '/' + withoutExt.replace(/\\/g, '/');
  }

  // Normalize: no trailing slash (matches vercel.json trailingSlash: false)
  // except homepage
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    urlPath = urlPath.slice(0, -1);
  }

  // Skip API and internal routes
  if (urlPath.startsWith('/api/') || urlPath.startsWith('/dashboard')) continue;

  urls.add(BASE + urlPath);
}

// Sort URLs for readability
const sortedUrls = Array.from(urls).sort();

// Build sitemap XML
const today = new Date().toISOString().split('T')[0];

const urlEntries = sortedUrls.map(url => {
  const urlPath = url.replace(BASE, '') || '/';
  const lastmod = lastmodFor(urlPath) || today;
  // Determine priority based on page type
  let priority = '0.6';
  let changefreq = 'monthly';

  if (url === BASE + '/') {
    priority = '1.0';
    changefreq = 'weekly';
  } else if (url.includes('/services/')) {
    priority = '0.9';
    changefreq = 'monthly';
  } else if (url.includes('/locations/') && url.split('/').length === 6) {
    // Country + service pages (SPA routes)
    priority = '0.8';
    changefreq = 'monthly';
  } else if (url.includes('/locations/') || url === BASE + '/locations') {
    priority = '0.7';
    changefreq = 'monthly';
  // Static country+service pages at /{country}/{service} (pSEO gen)
  } else if (url.split('/').length === 5 && !url.includes('/locations/') && !url.includes('/services/') && !url.includes('/api/') && !url.includes('/vs/') && !url.includes('/for/') && !url.includes('/glossary/') && !url.includes('/best/') && !url.includes('/learn/')) {
    priority = '0.8';
    changefreq = 'monthly';
  } else if (url === BASE + '/locations') {
    priority = '0.7';
    changefreq = 'monthly';
  } else if (url.includes('/alternatives-to/') || url.includes('/vs/') || url.includes('/for/')) {
    priority = '0.8';
    changefreq = 'monthly';
  } else if (url.includes('/industries/')) {
    priority = '0.7';
    changefreq = 'monthly';
  } else if (url.includes('/best/') || url.includes('/cost-analysis/') || url.includes('/hire/')) {
    priority = '0.6';
    changefreq = 'monthly';
  } else if (url.includes('/learn/') || url.includes('/glossary/') || url.includes('/use-cases/')) {
    priority = '0.7';
    changefreq = 'monthly';
  } else if (['/about', '/contact', '/pricing', '/methodology', '/case-studies', '/blog', '/glossary', '/alternatives', '/locations', '/industries'].includes(url.replace(BASE, ''))) {
    priority = '0.8';
    changefreq = 'monthly';
  }

  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

// In git-archive deploy exports there is no .git/ at the export root, so
// every gitDate() above returns null and urlEntries would carry `today` on
// all 280 rows. Detect that context with the toplevel-anchored probe.
const gitWorks = gitWorksHere();

if (!gitWorks) {
  const committedXml = readCommittedSitemap();
  if (!committedXml) {
    console.error('FATAL: git-less build context (deploy export?) and no committed public/sitemap.xml exists. Generate the sitemap inside the real repo, commit it, then deploy that commit.');
    process.exit(1);
  }
  const committedSet = locSet(committedXml);
  const generatedSet = new Set(sortedUrls);
  const onlyInBuild = [...generatedSet].filter(u => !committedSet.has(u));
  const onlyCommitted = [...committedSet].filter(u => !generatedSet.has(u));
  if (onlyInBuild.length || onlyCommitted.length) {
    console.error('FATAL: this build\'s URL set differs from committed public/sitemap.xml, and this git-less deploy context cannot generate truthful lastmods. Shipping build-date lastmods on a changed URL set would poison the signal.');
    if (onlyInBuild.length) console.error(`  in build, not in committed sitemap (${onlyInBuild.length}): ${onlyInBuild.slice(0, 10).join(' ')}${onlyInBuild.length > 10 ? ' ...' : ''}`);
    if (onlyCommitted.length) console.error(`  in committed sitemap, not in build (${onlyCommitted.length}): ${onlyCommitted.slice(0, 10).join(' ')}${onlyCommitted.length > 10 ? ' ...' : ''}`);
    console.error('  Fix: run `npm run build` in the real repo, verify dist/sitemap.xml, commit public/sitemap.xml, deploy from that commit.');
    process.exit(1);
  }
  // URL sets match: ship the committed sitemap with its truthful per-page lastmods.
  writeFileSync(join(DIST, 'sitemap.xml'), committedXml);
  console.log(`✓ sitemap.xml: ${sortedUrls.length} URLs — git-less build context: kept committed public/sitemap.xml (URL set verified identical, truthful lastmods preserved)`);
  process.exit(0);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml: ${sortedUrls.length} URLs written to dist/sitemap.xml`);

// Also write to public/ so it's available for dev/preview
writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml: ${sortedUrls.length} URLs copied to public/sitemap.xml`);
