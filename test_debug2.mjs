import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Test JSON.stringify behavior with the actual source
// The priceRange is "$$$" — is there a way this gets consumed?
const txt = readFileSync('/Users/sipi/sipiteno/scripts/prerender.mjs', 'utf-8');

// Simulate what buildPage does: run it on poland country
// Find the localBusinessSchema definition and extract it
const start = txt.indexOf('const localBusinessSchema');
const end = txt.indexOf('\n\n', start); // end of object
console.log('=== Definition snippet for priceRange ===');
const defPart = txt.slice(start, end);

// Use regex to find priceRange in the def
const m = defPart.match(/"priceRange":\s*"(\$+)"/);
if (m) console.log('$ count in source:', m[1].length, 'string:', JSON.stringify(m[0]));

// Now test: what if we eval this?
// Just execute a simpler test
const result = execSync('node -e \'const x = {"priceRange": "$$$"}; console.log(JSON.stringify(x));\'', { encoding: 'utf-8' });
console.log('Eval test:', result);
