import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Re-run the prerender in isolation and check immediately
execSync('node scripts/prerender.mjs', { cwd: '/Users/sipi/sipiteno', stdio: 'pipe' });

const html = readFileSync('/Users/sipi/sipiteno/dist/locations/poland/index.html', 'utf-8');
const mc = html.match(/"priceRange":\s*"(\$+)"/);
console.log('After standalone prerender:');
console.log('Full match:', mc ? mc[0] : 'NOT FOUND');
console.log('$ count:', mc ? mc[1].length : 0);
