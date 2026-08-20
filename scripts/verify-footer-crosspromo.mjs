import { readFileSync } from "node:fs";

const ORIGIN = "sipiteno.com";
const CAMPAIGN = "portfolio_crosspromo";
const EXPECTED = new Set([
  "gitdealflow.com",
  "signals.gitdealflow.com",
  "invisibleexit.com",
  "unlocksaas.com",
  "voicelogpro.com",
  "carshake.online",
  "churnlens.site",
  "sanctionsai.dev",
  "sipi.bot",
]);

function fail(message) {
  console.error(`footer-crosspromo FAIL: ${message}`);
  process.exit(1);
}

const html = readFileSync("dist/index.html", "utf8");
const marker = 'data-portfolio-cross-promo="v1"';
const markerCount = html.split(marker).length - 1;
if (markerCount !== 1) fail(`expected one marked block, found ${markerCount}`);

const markerAt = html.indexOf(marker);
const sectionAt = html.lastIndexOf("<section", markerAt);
const navAt = html.lastIndexOf("<nav", markerAt);
const start = Math.max(sectionAt, navAt);
if (start < 0) fail("marked block has no section or nav start tag");

const tag = start === sectionAt ? "section" : "nav";
const end = html.indexOf(`</${tag}>`, markerAt);
if (end < 0) fail(`marked ${tag} has no closing tag`);
const block = html.slice(start, end + tag.length + 3);

const hrefs = [...block.matchAll(/href="([^"]+)"/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);
if (hrefs.length !== EXPECTED.size) {
  fail(`expected ${EXPECTED.size} links, found ${hrefs.length}`);
}

const seen = new Set();
for (const href of hrefs) {
  const url = new URL(href);
  const host = url.hostname.replace(/^www\./, "");
  if (!EXPECTED.has(host)) fail(`unexpected or self target ${host}`);
  if (seen.has(host)) fail(`duplicate target ${host}`);
  seen.add(host);
  if (url.searchParams.get("utm_source") !== ORIGIN) fail(`bad utm_source for ${host}`);
  if (url.searchParams.get("utm_medium") !== "referral") fail(`bad utm_medium for ${host}`);
  if (url.searchParams.get("utm_campaign") !== CAMPAIGN) fail(`bad utm_campaign for ${host}`);
  if (url.searchParams.get("utm_content") !== "footer") fail(`bad utm_content for ${host}`);
}

for (const host of EXPECTED) {
  if (!seen.has(host)) fail(`missing target ${host}`);
}

console.log("footer-crosspromo OK: one block, nine measured sibling links");
