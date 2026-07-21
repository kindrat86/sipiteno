import { readFileSync, writeFileSync } from 'fs';

// Rerun the prerender step only and capture all schema output for poland
import { execSync } from 'child_process';
execSync('node scripts/prerender.mjs 2>&1', { cwd: '/Users/sipi/sipiteno', stdio: 'pipe' });

const html = readFileSync('/Users/sipi/sipiteno/dist/locations/poland/index.html', 'utf-8');

// Find the full LocalBusiness JSON-LD
const ldStart = html.indexOf('"@type": "LocalBusiness"');
if (ldStart < 0) { console.log('Not found!'); process.exit(1); }

// Go back to find the <script tag
const scriptStart = html.lastIndexOf('<script', ldStart);
const scriptEnd = html.indexOf('</script>', ldStart);
console.log('Full script tag (from LocalBusiness to end):');
console.log(html.slice(scriptStart, scriptEnd + 9));
