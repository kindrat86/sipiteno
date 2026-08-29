#!/usr/bin/env node

import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const COUNTRIES = [
  'albania', 'armenia', 'azerbaijan', 'bosnia-and-herzegovina', 'bulgaria',
  'croatia', 'cyprus', 'czech-republic', 'estonia', 'ethiopia', 'georgia',
  'greece', 'hungary', 'india', 'kazakhstan', 'kyrgyzstan', 'latvia',
  'lithuania', 'moldova', 'montenegro', 'north-macedonia', 'poland',
  'romania', 'serbia', 'slovakia', 'slovenia', 'ukraine', 'uzbekistan',
];
const SERVICES = [
  'ai-consulting',
  'business-development',
  'digital-marketing',
  'it-consulting',
  'project-management',
  'sales-funnel',
];
const EXPECTED_DUPLICATES = COUNTRIES.length * SERVICES.length;

if (!existsSync(DIST)) {
  throw new Error('dist/ not found. Run the build pipeline first.');
}

let removed = 0;
for (const country of COUNTRIES) {
  for (const service of SERVICES) {
    // writeRoute() intentionally emits both directory-index and flat artifacts.
    // Remove both physical representations while counting one public URL.
    const artifacts = [
      join(DIST, 'locations', country, service, 'index.html'),
      join(DIST, 'locations', country, `${service}.html`),
    ];
    for (const artifact of artifacts) {
      if (!existsSync(artifact)) {
        throw new Error(`Expected duplicate artifact is missing: ${artifact}`);
      }
      rmSync(artifact);
    }
    removed += 1;
  }
}

if (removed !== EXPECTED_DUPLICATES) {
  throw new Error(`Expected to remove ${EXPECTED_DUPLICATES} duplicates, removed ${removed}`);
}

const htmlFiles = [];
function collectHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) collectHtml(fullPath);
    else if (entry.endsWith('.html')) htmlFiles.push(fullPath);
  }
}
collectHtml(DIST);

let filesChanged = 0;
let linksRewritten = 0;
for (const file of htmlFiles) {
  const before = readFileSync(file, 'utf8');
  let after = before;

  for (const country of COUNTRIES) {
    for (const service of SERVICES) {
      const oldAbsolute = `https://sipiteno.com/locations/${country}/${service}`;
      const newAbsolute = `https://sipiteno.com/${country}/${service}`;
      const oldRelative = `/locations/${country}/${service}`;
      const newRelative = `/${country}/${service}`;

      const absoluteMatches = after.split(oldAbsolute).length - 1;
      if (absoluteMatches) {
        after = after.replaceAll(oldAbsolute, newAbsolute);
        linksRewritten += absoluteMatches;
      }

      const relativeMatches = after.split(oldRelative).length - 1;
      if (relativeMatches) {
        after = after.replaceAll(oldRelative, newRelative);
        linksRewritten += relativeMatches;
      }
    }
  }

  if (after !== before) {
    writeFileSync(file, after);
    filesChanged += 1;
  }
}

if (linksRewritten === 0) {
  throw new Error('No internal location-service links were found to rewrite.');
}

console.log(
  `Consolidated location-service family: ${removed} duplicate pages removed; ` +
  `${linksRewritten} links rewritten across ${filesChanged} HTML files.`,
);