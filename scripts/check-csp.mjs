#!/usr/bin/env node
/**
 * Directive-scoped CSP regression gate for Sipiteno analytics.
 *
 * The verified PostHog and Clarity allowlist fixes previously lived only on an
 * orphaned deployment lineage. This gate keeps their required hosts on the
 * canonical source, generated Vercel artifact, and served production header:
 *
 *   node scripts/check-csp.mjs
 *   node scripts/check-csp.mjs --artifact
 *   node scripts/check-csp.mjs --live [URL]
 *
 * Artifact mode is opt-in because npm's build gate runs before Vercel writes a
 * fresh .vercel/output/config.json. Checking a stale artifact during that gate
 * would create a false failure.
 *
 * The check is directive-scoped. A PostHog asset host in connect-src does not
 * satisfy script-src, because lazy scripts and session replay would still be
 * blocked by the browser.
 */

const REQUIRED = {
  'script-src': {
    'https://eu-assets.i.posthog.com': 'posthog-js lazy bundles and session replay',
    'https://us-assets.i.posthog.com': 'posthog-js lazy bundles and session replay',
  },
  'connect-src': {
    'https://eu-assets.i.posthog.com': 'posthog-js remote config fetch',
    'https://us-assets.i.posthog.com': 'posthog-js remote config fetch',
    'https://t.clarity.ms': 'Clarity /collect session beacons',
  },
};

const PROD_URL = 'https://sipiteno.com/';

function parseCsp(value) {
  const directives = {};
  for (const part of value.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/).filter(Boolean);
    if (name) directives[name.toLowerCase()] = sources;
  }
  return directives;
}

function collectCsps(node, found = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectCsps(item, found);
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string') {
        const isCsp = key.toLowerCase() === 'content-security-policy'
          || (key === 'value' && node.key?.toLowerCase() === 'content-security-policy');
        if (isCsp) found.push(value);
      } else {
        collectCsps(value, found);
      }
    }
  }
  return found;
}

// /embed/(.*) intentionally runs no analytics and keeps default-src 'none'.
const isAppCsp = (csp) => !/default-src\s+'none'/.test(csp);

function checkCsp(value, label) {
  const directives = parseCsp(value);
  const problems = [];

  for (const [directive, hosts] of Object.entries(REQUIRED)) {
    const present = directives[directive];
    if (!present) {
      problems.push(`${directive} is missing entirely`);
      continue;
    }

    for (const [host, reason] of Object.entries(hosts)) {
      if (present.includes(host)) continue;

      const elsewhere = Object.entries(directives)
        .filter(([otherDirective, sources]) => otherDirective !== directive && sources.includes(host))
        .map(([otherDirective]) => otherDirective);
      const hint = elsewhere.length
        ? ` (it IS in ${elsewhere.join(', ')} - wrong directive)`
        : '';
      problems.push(`${directive} is missing ${host}${hint} - breaks: ${reason}`);
    }
  }

  if (problems.length) {
    console.error(`CSP FAIL: ${label}`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error(`  policy: ${value}`);
    return false;
  }

  console.log(`CSP OK: ${label}`);
  return true;
}

async function main() {
  const live = process.argv.includes('--live');
  const urlArg = process.argv.find((argument) => argument.startsWith('http'));
  let ok = true;

  if (live) {
    const url = urlArg || PROD_URL;
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    const header = response.headers.get('content-security-policy');
    if (!header) {
      console.error(`CSP FAIL: ${url} sent no Content-Security-Policy header (HTTP ${response.status})`);
      process.exit(1);
    }
    ok = checkCsp(header, `live header from ${url} (HTTP ${response.status})`);
  } else {
    const { existsSync, readFileSync } = await import('node:fs');
    if (!existsSync('vercel.json')) {
      console.error('CSP FAIL: vercel.json not found - run from the repo root');
      process.exit(1);
    }

    const files = ['vercel.json'];
    if (process.argv.includes('--artifact')) {
      if (!existsSync('.vercel/output/config.json')) {
        console.error('CSP FAIL: --artifact given but .vercel/output/config.json is missing - run `vercel build --prod` first');
        process.exit(1);
      }
      files.push('.vercel/output/config.json');
    }

    for (const file of files) {
      const csps = collectCsps(JSON.parse(readFileSync(file, 'utf8'))).filter(isAppCsp);
      if (!csps.length) {
        console.error(`CSP FAIL: ${file} declares no app Content-Security-Policy header`);
        ok = false;
        continue;
      }

      csps.forEach((csp, index) => {
        if (!checkCsp(csp, `${file} [policy ${index + 1}/${csps.length}]`)) ok = false;
      });
    }
  }

  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(`CSP FAIL: ${error.message}`);
  process.exit(1);
});
