import { readFileSync } from 'fs';
// Read the prerender.mjs, find the country loop section, extract the literal
const txt = readFileSync('scripts/prerender.mjs', 'utf-8');

// Find the localBusinessSchema definition and confirm it uses $$$
const priceIdx = txt.indexOf('priceRange');
console.log('At source position', priceIdx);
console.log('Context:', JSON.stringify(txt.slice(priceIdx - 20, priceIdx + 40)));

// Count $ signs in the source for localBusinessSchema priceRange
const localBusinessSection = txt.slice(txt.indexOf('const localBusinessSchema'));
const priceMatch = localBusinessSection.match(/"priceRange":\s*"(\$+)"/);
if (priceMatch) {
  console.log('Source has', priceMatch[1].length, '$ signs');
}
