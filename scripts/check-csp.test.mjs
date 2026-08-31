import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptsDir, '..');
const checker = resolve(scriptsDir, 'check-csp.mjs');

const restrictiveEmbedPolicy = "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; frame-ancestors *";

function appPolicy({ includeScriptAssets = true } = {}) {
  const scriptAssets = includeScriptAssets
    ? ' https://eu-assets.i.posthog.com https://us-assets.i.posthog.com'
    : '';

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://us.i.posthog.com${scriptAssets}`,
    "connect-src 'self' https://eu.i.posthog.com https://us.i.posthog.com https://eu-assets.i.posthog.com https://us-assets.i.posthog.com https://t.clarity.ms",
    "frame-ancestors 'none'",
  ].join('; ');
}

function sourceConfig(policies) {
  return {
    headers: policies.map((value, index) => ({
      source: index === 0 ? '/(.*)' : '/embed/(.*)',
      headers: [{ key: 'Content-Security-Policy', value }],
    })),
  };
}

function artifactConfig(policies) {
  return {
    version: 3,
    routes: policies.map((value, index) => ({
      src: index === 0 ? '^/(.*)$' : '^/embed/(.*)$',
      headers: { 'Content-Security-Policy': value },
    })),
  };
}

function runFixture({ policies, artifactPolicies, args = [] }) {
  const dir = mkdtempSync(resolve(tmpdir(), 'sipiteno-csp-test-'));
  try {
    writeFileSync(resolve(dir, 'vercel.json'), JSON.stringify(sourceConfig(policies), null, 2));
    if (artifactPolicies) {
      mkdirSync(resolve(dir, '.vercel/output'), { recursive: true });
      writeFileSync(
        resolve(dir, '.vercel/output/config.json'),
        JSON.stringify(artifactConfig(artifactPolicies), null, 2),
      );
    }
    return spawnSync(process.execPath, [checker, ...args], {
      cwd: dir,
      encoding: 'utf8',
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('rejects PostHog asset hosts that appear only in connect-src', () => {
  const result = runFixture({ policies: [appPolicy({ includeScriptAssets: false })] });

  assert.equal(result.status, 1, result.stderr || result.stdout);
  assert.match(result.stderr, /script-src is missing https:\/\/eu-assets\.i\.posthog\.com/);
  assert.match(result.stderr, /wrong directive/);
});

test('accepts a valid app policy', () => {
  const result = runFixture({ policies: [appPolicy()] });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /CSP OK: vercel\.json/);
});

test("ignores the analytics-free default-src 'none' embed policy", () => {
  const result = runFixture({ policies: [appPolicy(), restrictiveEmbedPolicy] });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /policy 1\/1/);
});

test('checks source and Vercel artifact config shapes in artifact mode', () => {
  const result = runFixture({
    policies: [appPolicy(), restrictiveEmbedPolicy],
    artifactPolicies: [appPolicy(), restrictiveEmbedPolicy],
    args: ['--artifact'],
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /CSP OK: \.vercel\/output\/config\.json/);
});

test('accepts the real current repository configuration', () => {
  const result = spawnSync(process.execPath, [checker], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /CSP OK: vercel\.json/);
});
