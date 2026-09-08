#!/usr/bin/env node
// Fail the build when static fleet pages would recreate either browser-console
// defect fixed in work order 4a: a dead /ux.css request or invalid capture JS.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { Script } from "node:vm";

const DIST = new URL("../dist/", import.meta.url).pathname;
const CAPTURE_RE = /<script data-sipiteno-fleet="capture-js">([\s\S]*?)<\/script>/gi;
const UX_CSS_RE = /<link[^>]*href=["']\/ux\.css["'][^>]*>/i;
const failures = [];
let htmlFiles = 0;
let captureScripts = 0;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) yield* walk(path);
    else if (name.endsWith(".html")) yield path;
  }
}

for (const file of walk(DIST)) {
  htmlFiles++;
  const html = readFileSync(file, "utf8");
  const rel = relative(DIST, file);
  if (UX_CSS_RE.test(html)) failures.push(`${rel}: dead /ux.css link`);

  CAPTURE_RE.lastIndex = 0;
  for (const match of html.matchAll(CAPTURE_RE)) {
    captureScripts++;
    try {
      new Script(match[1], { filename: `${rel}:capture-js` });
    } catch (error) {
      failures.push(`${rel}: ${error.message}`);
    }
  }
}

if (captureScripts === 0) failures.push("no fleet capture scripts found in dist");
if (failures.length > 0) {
  console.error(`FLEET CONSOLE CHECK FAILED (${failures.length})`);
  for (const failure of failures.slice(0, 20)) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`FLEET CONSOLE OK: html=${htmlFiles} captureScripts=${captureScripts} uxCssLinks=0`);
