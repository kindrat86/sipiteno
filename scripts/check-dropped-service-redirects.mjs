#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const realCountries = [
  'albania',
  'armenia',
  'azerbaijan',
  'bosnia-and-herzegovina',
  'bulgaria',
  'croatia',
  'cyprus',
  'czech-republic',
  'estonia',
  'ethiopia',
  'georgia',
  'greece',
  'hungary',
  'india',
  'kazakhstan',
  'kyrgyzstan',
  'latvia',
  'lithuania',
  'moldova',
  'montenegro',
  'north-macedonia',
  'poland',
  'portugal',
  'romania',
  'serbia',
  'slovakia',
  'slovenia',
  'ukraine',
  'uzbekistan',
];
const droppedServices = ['b2b-partnerships', 'market-entry'];
const portugalFallback = '/services/business-development';
const regularCountries = realCountries.filter((country) => country !== 'portugal');
const configPath = resolve(process.argv[2] ?? 'vercel.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const redirects = config.redirects ?? [];
const errors = [];

assert.equal(realCountries.length, 29, 'real-country contract must contain exactly 29 countries');
assert.equal(new Set(realCountries).size, 29, 'real-country contract must not contain duplicates');
assert.ok(realCountries.includes('portugal'), 'real-country contract must include portugal');
assert.ok(!realCountries.includes('services'), 'real-country contract must exclude services');
assert.equal(droppedServices.length, 2, 'dropped-service contract must contain exactly two slugs');

const concreteSources = realCountries.flatMap((country) =>
  droppedServices.map((service) => `/${country}/${service}`),
);
assert.equal(concreteSources.length, 58, 'contract must expand to exactly 58 source URLs');
assert.equal(new Set(concreteSources).size, 58, 'concrete source URLs must be unique');
assert.ok(concreteSources.includes('/croatia/b2b-partnerships'));
assert.ok(concreteSources.includes('/bulgaria/market-entry'));

for (const service of droppedServices) {
  const expectedGroupedSource = `/:country(${regularCountries.join('|')})/${service}`;
  const groupedRedirect = redirects.find((entry) => entry.source === expectedGroupedSource);
  if (!groupedRedirect) {
    errors.push(`missing 28-country redirect for ${service}: ${expectedGroupedSource}`);
  } else {
    if (groupedRedirect.destination !== '/:country/business-development') {
      errors.push(`${expectedGroupedSource} must keep the country and target /:country/business-development`);
    }
    if (groupedRedirect.permanent !== true) {
      errors.push(`${expectedGroupedSource} must be permanent`);
    }
  }

  const portugalSource = `/portugal/${service}`;
  const portugalRedirect = redirects.find((entry) => entry.source === portugalSource);
  if (!portugalRedirect) {
    errors.push(`missing Portugal redirect: ${portugalSource}`);
  } else {
    if (portugalRedirect.destination !== portugalFallback) {
      errors.push(`${portugalSource} must target truthful fallback ${portugalFallback}`);
    }
    if (portugalRedirect.permanent !== true) {
      errors.push(`${portugalSource} must be permanent`);
    }
  }

  const strayServicesSource = `/services/${service}`;
  if (redirects.some((entry) => entry.source === strayServicesSource)) {
    errors.push(`services must not be counted as a country source: ${strayServicesSource}`);
  }

  for (const entry of redirects.filter((candidate) => candidate.source?.endsWith(`/${service}`))) {
    const match = entry.source.match(/^\/:country\(([^)]+)\)\//);
    if (match?.[1].split('|').includes('services')) {
      errors.push(`services must not appear in the ${service} country group: ${entry.source}`);
    }
    if (entry.destination === '/services') {
      errors.push(`${entry.source} must not redirect to generic /services`);
    }
  }
}

assert.equal(errors.length, 0, errors.join('\n'));
console.log(
  'Dropped-service redirect check OK: 58 unique real-country URLs, 56 country-preserving targets, and 2 truthful Portugal fallbacks',
);
