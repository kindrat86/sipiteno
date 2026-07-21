// Direct test of the exact codepath
const country = { name: 'Poland', slug: 'poland', region: 'Central Europe', capital: 'Warsaw', languages: ['Polish', 'English', 'German'], keyIndustries: ['IT Outsourcing', 'Fintech', 'Gaming'], techHub: 'Warsaw Business Hub & Krakow Tech Park' };

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://sipiteno.com/locations/${country.slug}/#localbusiness`,
    "name": `Sipiteno in ${country.name}`,
    "priceRange": "$$$",
};

console.log('priceRange source chars:', [...localBusinessSchema.priceRange].map(c => c + '=' + c.charCodeAt(0)).join(', '));
console.log('JSON priceRange:', JSON.stringify(localBusinessSchema.priceRange));

const jsonStr = JSON.stringify(localBusinessSchema, null, 2);
const priceIdx = jsonStr.indexOf('priceRange');
console.log('In JSON.stringify:', jsonStr.slice(priceIdx, priceIdx + 30));
console.log('In JSON.stringify chars:', [...jsonStr.slice(priceIdx, priceIdx + 30)].map(c => c + '=' + c.charCodeAt(0)).join(', '));

const schemaScripts = `    <script type="application/ld+json">\n${jsonStr.split('\n').map(l => '    ' + l).join('\n')}\n    </script>`;

const priceIdx2 = schemaScripts.indexOf('priceRange');
console.log('In final script:', schemaScripts.slice(priceIdx2, priceIdx2 + 30));
const ml = schemaScripts.match(/"priceRange":\s*"(\$+)"/);
console.log('$ count in final:', ml ? ml[1].length : 0);
