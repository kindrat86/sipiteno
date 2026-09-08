#!/usr/bin/env node
// inject-fleet-conversion.mjs — idempotent conversion/analytics injector for
// the static pSEO fleet (2026-07-23 conversion audit).
//
// Per fleet HTML page:
//   1. Drop the dead `<script src="/ux.js" defer></script>` tag (the file was
//      never shipped to public/ and 404s; dropping is safer than shipping).
//   2. Add a PostHog capture snippet (EU host, project key). NOTE: the site's
//      CSP sends `require-trusted-types-for 'script'` and script-src does NOT
//      allow eu-assets.i.posthog.com, so the official posthog-js loader would
//      be blocked. We therefore use PostHog's HTTP capture API via fetch()
//      (connect-src already allows https://eu.i.posthog.com). Fires $pageview
//      on load; window.__ph(event, props) available for custom events.
//   3. Add a minimal, dependency-free email-capture block above the footer
//      that POSTs to /api/contact with a hidden `source` = page path, fires
//      `playbook_requested` on success, and shows a mailto fallback on error
//      (DOM-built, no innerHTML — Trusted Types safe).
//   4. Drop dead `/ux.css` links. The stylesheet is not shipped, so Vercel's
//      HTML fallback caused a strict-MIME browser error on every fleet page.
//
// Idempotent: already-marked dist output is repaired in place after
// copy-pseo.sh. Both embedded scripts are refreshed, not merely inserted, so
// a bad template cannot remain frozen in previously-generated pages.
// Run from repo root: node scripts/inject-fleet-conversion.mjs

import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SKIP_DIRS = new Set([
  "node_modules", "dist", ".vercel", ".git", "embed", "public", "src",
  "api", "scripts", "supabase",
]);

const PH_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";
const PH_HOST = "https://eu.i.posthog.com";

// NOTE: $host, $browser and $viewport_* are REQUIRED, not cosmetic. Every
// portfolio traffic dashboard filters on `$host IN (...)`, `$browser IS NOT
// NULL AND != 'Bot'` and `$viewport_height > 0`. Until 2026-08-07 this snippet
// sent none of them, so ~46 pSEO pageviews/3wk were ingested but invisible to
// every count — sipiteno looked emptier than it was. posthog-js sets these
// itself; a hand-rolled sender has to.
const POSTHOG_SNIPPET = `<script data-sipiteno-fleet="posthog">window.__ph=function(ev,props){try{var did=localStorage.getItem("ph_fleet_did");if(!did){did=Math.random().toString(36).slice(2)+"-"+Date.now();localStorage.setItem("ph_fleet_did",did)}var u=navigator.userAgent,b=u.indexOf("Edg/")>-1?"Microsoft Edge":u.indexOf("OPR/")>-1?"Opera":u.indexOf("Firefox/")>-1?"Firefox":u.indexOf("Chrome/")>-1?"Chrome":u.indexOf("Safari/")>-1?"Safari":"Other",w=window.innerWidth||0,h=window.innerHeight||0;var p={$host:location.host,$current_url:location.href,$pathname:location.pathname,$referrer:document.referrer,$browser:b,$raw_user_agent:u,$viewport_width:w,$viewport_height:h,$device_type:w&&w<768?"Mobile":"Desktop",$lib:"fleet-lite"};if(props)for(var k in props)p[k]=props[k];fetch("${PH_HOST}/i/v0/e/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({api_key:"${PH_KEY}",event:ev,distinct_id:did,properties:p,timestamp:new Date().toISOString()})}).catch(function(){})}catch(e){}};window.__ph("$pageview");</script>`;

// Matches any previously-injected snippet so fixes propagate to pages that
// already carry one (the old logic only ever inserted when absent, which meant
// a snippet bug froze permanently into every page already shipped).
const POSTHOG_TAG_RE = /<script data-sipiteno-fleet="posthog">[\s\S]*?<\/script>/i;
const CAPTURE_BLOCK_RE = /<section data-sipiteno-fleet="capture"[\s\S]*?<\/section>\s*<script data-sipiteno-fleet="capture-js">[\s\S]*?<\/script>/i;

function captureBlock(pagePath) {
  return `<section data-sipiteno-fleet="capture" style="max-width:720px;margin:48px auto 32px;padding:28px 24px;border:1px solid #d8dee7;border-radius:12px;background:#f7f9fc;font-family:inherit">
  <h2 style="margin:0 0 6px;font-size:1.25rem">Get the Free Expansion Playbook</h2>
  <p style="margin:0 0 16px;color:#4a5568;font-size:.95rem">The Emerging Markets Expansion Playbook — 28 countries, 47 pages, sent to your inbox.</p>
  <form data-fleet-capture onsubmit="return window.__fleetCapture(event)" style="display:flex;gap:8px;flex-wrap:wrap">
    <input type="email" name="email" required placeholder="you@company.com" style="flex:1;min-width:220px;padding:12px 14px;border:1px solid #cbd5e0;border-radius:8px;font-size:1rem">
    <input type="text" name="honeypot" value="" style="display:none" tabindex="-1" autocomplete="off">
    <input type="hidden" name="source" value="${pagePath}">
    <button type="submit" style="padding:12px 24px;background:#0066cc;color:#fff;border:0;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer">Get it</button>
  </form>
  <p data-fleet-msg style="display:none;margin:12px 0 0;font-size:.9rem"></p>
</section>
<script data-sipiteno-fleet="capture-js">window.__fleetCapture=function(e){e.preventDefault();var f=e.target,m=f.parentNode.querySelector("[data-fleet-msg]"),b=f.querySelector("button");if(f.honeypot.value)return false;b.disabled=true;b.textContent="Sending…";fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fullName:"Playbook Subscriber",companyName:"(pSEO fleet)",email:f.email.value,phone:"",country:"",service:"Free Expansion Playbook (pSEO Fleet)",message:"FLEET PLAYBOOK REQUEST from "+f.source.value+" — send the Emerging Markets Expansion Playbook.",honeypot:""})}).then(function(r){if(!r.ok)throw new Error(r.status);while(m.firstChild)m.removeChild(m.firstChild);m.style.display="block";m.style.color="#276749";m.appendChild(document.createTextNode("Check your inbox — the playbook is on its way."));f.email.value="";if(window.__ph)window.__ph("playbook_requested",{source:f.source.value});}).catch(function(){while(m.firstChild)m.removeChild(m.firstChild);m.style.display="block";m.style.color="#c53030";m.appendChild(document.createTextNode("Something broke — email us directly at "));var a=document.createElement("a");a.href="mailto:sales@sipiteno.com?subject=Free%20Expansion%20Playbook";a.style.color="#c53030";a.style.fontWeight="700";a.textContent="sales@sipiteno.com";m.appendChild(a);}).finally(function(){b.disabled=false;b.textContent="Get it";});return false};</script>`;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (relative(ROOT, p).split(sep).length === 1 && SKIP_DIRS.has(name)) continue;
      yield* walk(p);
    } else if (name.endsWith(".html")) {
      // fleet = HTML files inside subdirectories only (root-level files are
      // SPA-adjacent standalone pages, out of scope)
      if (relative(ROOT, p).includes(sep)) yield p;
    }
  }
}

function pageUrlPath(file, root = ROOT) {
  let rel = "/" + relative(root, file).split(sep).join("/");
  rel = rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  return rel || "/";
}

let scanned = 0, uxjsDropped = 0, uxcssDropped = 0, phUpdated = 0, captureUpdated = 0, changed = 0;

// copy-pseo.sh runs before this injector. Repair already-marked fleet pages in
// dist without mutating committed source files or adding fleet UI to unrelated
// SPA prerenders.
const DIST = join(ROOT, "dist");
if (existsSync(DIST)) for (const file of walk(DIST)) {
  let html = readFileSync(file, "utf8");
  const isFleetPage = html.includes("data-sipiteno-fleet=") || html.includes("sipiteno-pseo-gen-v1");
  scanned++;
  const orig = html;

  const beforeJs = html;
  html = html.replace(/[ \t]*<script[^>]*src=["']\/ux\.js["'][^>]*>\s*<\/script>\n?/gi, "");
  if (html !== beforeJs) uxjsDropped++;
  const beforeCss = html;
  html = html.replace(/[ \t]*<link[^>]*href=["']\/ux\.css["'][^>]*>\n?/gi, "");
  if (html !== beforeCss) uxcssDropped++;

  if (isFleetPage && POSTHOG_TAG_RE.test(html)) {
    const refreshed = html.replace(POSTHOG_TAG_RE, POSTHOG_SNIPPET);
    if (refreshed !== html) {
      html = refreshed;
      phUpdated++;
    }
  }
  if (isFleetPage && CAPTURE_BLOCK_RE.test(html)) {
    const refreshed = html.replace(CAPTURE_BLOCK_RE, () => captureBlock(pageUrlPath(file, DIST)));
    if (refreshed !== html) {
      html = refreshed;
      captureUpdated++;
    }
  }

  if (html !== orig) {
    writeFileSync(file, html);
    changed++;
  }
}
console.log(`fleet-inject: scanned=${scanned} changed=${changed} uxjsDropped=${uxjsDropped} uxcssDropped=${uxcssDropped} posthogUpdated=${phUpdated} captureUpdated=${captureUpdated}`);
