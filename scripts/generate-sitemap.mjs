#!/usr/bin/env node
/**
 * Generates sitemap.xml from all prerendered/static HTML pages in dist/.
 * Run AFTER `vite build` + `prerender.mjs` + `copy-pseo.sh`.
 *
 * Scans dist/ for all index.html and *.html files, converts paths to URLs,
 * and writes a complete sitemap.xml to dist/sitemap.xml.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { execSync } from 'child_process';

const DIST = join(process.cwd(), 'dist');
const BASE = 'https://sipiteno.com';
const LOCALES = ['de', 'es', 'fr', 'it', 'ku', 'lt', 'ro'];

// Pages with noindex that should never appear in the sitemap
const NOINDEX_PAGES = ['terms', 'privacy'];

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

  // Skip noindex pages (terms, privacy) — they must never appear in the sitemap
  if (NOINDEX_PAGES.some(np => relPath === np + '.html' || relPath === np + '/index.html')) continue;

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
