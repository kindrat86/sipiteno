import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Rebuild JUST the prerender (not vite) and check immediately
execSync('node scripts/prerender.mjs', { cwd: '/Users/sipi/sipiteno', stdio: ['pipe', 'pipe', 'pipe'] });

// Check before and after
const html = readFileSync('/Users/sipi/sipiteno/dist/locations/poland/index.html', 'utf-8');
const m = html.match(/"priceRange":\s*"(\$+)"/);
console.log('After standalone prerender:');
console.log('Match:', m ? m[0] : 'NOT FOUND');
console.log('$ count:', m ? m[1].length : 0);

// Check ALL priceRange occurrences
let idx = 0;
const positions = [];
while ((idx = html.indexOf('priceRange', idx)) !== -1) {
  positions.push(idx);
  idx += 10;
}
console.log('priceRange at positions:', positions);
for (const pos of positions) {
  console.log(`  pos ${pos}:`, JSON.stringify(html.slice(pos, pos + 30)));
}
