import { readFileSync } from 'fs';
// Read a country page and check priceRange
const html = readFileSync('dist/locations/poland/index.html', 'utf-8');
const idx = html.indexOf('priceRange');
if (idx >= 0) {
  console.log('Found at', idx, ':', JSON.stringify(html.slice(idx, idx+40)));
}
// Check how many $ in the priceRange field
const match = html.match(/"priceRange":\s*"(\$+)"/);
if (match) {
  console.log('Number of $ signs:', match[1].length);
  console.log('Full match:', match[0]);
}
