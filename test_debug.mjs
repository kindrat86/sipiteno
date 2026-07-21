import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Let me directly test: what does the localBusinessSchema variable actually contain
// when the script runs?
const txt = readFileSync('/Users/sipi/sipiteno/scripts/prerender.mjs', 'utf-8');

// Find the line that defines priceRange
const lines = txt.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('priceRange')) {
    console.log(`Line ${i+1}:`, JSON.stringify(lines[i]));
  }
}

// Check the exact characters around priceRange in the localBusinessSchema definition
const startDef = txt.indexOf('const localBusinessSchema');
const endDef = txt.indexOf(';\n', startDef);
const def = txt.slice(startDef, endDef + 1);
console.log('\n--- localBusinessSchema definition bytes ---');
console.log(Buffer.from(def).slice(0, 200).toString('hex'));
console.log(def.slice(0, 200));
