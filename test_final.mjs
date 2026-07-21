import { execSync } from 'child_process';

// Patch the prerender file temporarily to add logging
import { readFileSync, writeFileSync } from 'fs';

const txt = readFileSync('/Users/sipi/sipiteno/scripts/prerender.mjs', 'utf-8');

// Insert a debug line right after localBusinessSchema is created
const debugLine = `\n  console.log('priceRange in localBusinessSchema:', JSON.stringify(localBusinessSchema.priceRange));\n  console.log('priceRange chars:', [...localBusinessSchema.priceRange].map(c => c.charCodeAt(0)));\n`;

const insertPoint = txt.indexOf('const html = buildPage({');

// Don't actually modify the file — just test in isolation
// Let me directly eval the relevant codepath
const testCode = `
const country = { name: 'Poland', slug: 'poland', region: 'Central Europe', capital: 'Warsaw', languages: ['Polish', 'English', 'German'], keyIndustries: ['IT Outsourcing', 'Fintech', 'Gaming'], techHub: 'Warsaw Business Hub & Krakow Tech Park' };

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": \`https://sipiteno.com/locations/\${country.slug}/#localbusiness\`,
    "name": \`Sipiteno in \${country.name}\`,
    "priceRange": "$$$",
};

console.log('Object', JSON.stringify(localBusinessSchema, null, 2));

const allSchemas = [localBusinessSchema];

const schemaScripts = allSchemas
    .map(s => \`    <script type="application/ld+json">\\n\${JSON.stringify(s, null, 2).split('\\n').map(l => '    ' + l).join('\\n')}\\n    </script>\`)
    .join('\\n');

console.log('Script output:');
console.log(schemaScripts);

// Check number of $ in the output
const matches = schemaScripts.match(/\\$/g);
console.log('Total $ in output:', matches ? matches.length : 0);
`;

execSync(`node -e '${testCode}'`, { encoding: 'utf-8', stdio: 'pipe' });
