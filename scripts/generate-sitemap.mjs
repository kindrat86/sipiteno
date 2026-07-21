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

const DIST = join(process.cwd(), 'dist');
const BASE = 'https://sipiteno.com';

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
    <lastmod>${today}</lastmod>
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
