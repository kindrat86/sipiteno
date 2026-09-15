#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const pagePath = 'research/organic-growth-experiment/index.html';
const manifestPath = 'research/organic-growth-experiment/sources.json';
const html = readFileSync(pagePath, 'utf8');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const observations = new Map(manifest.observations.map((item) => [item.id, item]));

if (!html.includes('<h1>The organic growth experiment</h1>')) {
  throw new Error('growth log must contain its real h1');
}

const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
if (!bodyMatch) throw new Error('growth log body is missing');
const visibleText = bodyMatch[0]
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();
if (visibleText.length < 1800) {
  throw new Error(`growth log has only ${visibleText.length} visible characters; minimum is 1800`);
}

const sourceIds = [...html.matchAll(/data-source-id="([^"]+)"/g)].map((match) => match[1]);
if (sourceIds.length === 0) throw new Error('growth log has no source annotations');
for (const id of new Set(sourceIds)) {
  const observation = observations.get(id);
  if (!observation) throw new Error(`growth log references missing source id: ${id}`);
  if (!observation.source_url) throw new Error(`source id ${id} has no source_url`);
}

let unannotated = bodyMatch[0]
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ');
for (const tag of ['p', 'table']) {
  unannotated = unannotated.replace(
    new RegExp(`<${tag}[^>]*data-source-id="[^"]+"[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'),
    ' ',
  );
}
unannotated = unannotated
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ');
const unsourcedNumber = unannotated.match(/\b\d[\d,.%:-]*\b/);
if (unsourcedNumber) {
  throw new Error(`numeric content is missing data-source-id: ${unsourcedNumber[0]}`);
}

console.log(`Growth log OK: ${visibleText.length} visible characters, ${new Set(sourceIds).size} source records`);
