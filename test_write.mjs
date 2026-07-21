import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Test writeFileSync with a string containing $$$
const testStr = '{"priceRange": "$$$"}';
writeFileSync('/Users/sipi/sipiteno/test_write_output.txt', testStr);
const readBack = readFileSync('/Users/sipi/sipiteno/test_write_output.txt', 'utf-8');
console.log('Written:', JSON.stringify(testStr));
console.log('Read back:', JSON.stringify(readBack));
console.log('Equal:', testStr === readBack);

// Now test exactly what writeRoute does
const html = '<html><head><script type="application/ld+json">{"priceRange":"$$$"}</script></head><body></body></html>';
writeFileSync(join('/Users/sipi/sipiteno', 'test_route_output.html'), html);
const readBack2 = readFileSync('/Users/sipi/sipiteno/test_route_output.html', 'utf-8');
console.log('HTML read back:', JSON.stringify(readBack2.slice(50, 90)));
