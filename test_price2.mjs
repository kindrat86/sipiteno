import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// Rebuild just the prerender part to trace the issue
// First, let me check if the LOCALBUSINESS schema literal is actually $$$ or $$
const srctxt = readFileSync('scripts/prerender.mjs', 'utf-8');
const idx = srctxt.indexOf('priceRange');
console.log('Source priceRange string:', JSON.stringify(srctxt.slice(idx, idx+30)));

// Now simulate what happens — inject a fresh localBusiness
const country = { name: 'Poland', slug: 'poland', region: 'Central Europe', capital: 'Warsaw', languages: ['Polish', 'English', 'German'] };
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "priceRange": "$$$",
};
const json = JSON.stringify(localBusinessSchema, null, 2);
console.log('Schema JSON (priceRange section):', json.slice(json.indexOf('price'), json.indexOf('price') + 30));
console.log('Number of $:', (json.match(/\$/g) || []).length);
