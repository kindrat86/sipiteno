# Owner Actions — sipiteno.com Traffic Runbook (2026-07-23)

## 1. GSC Domain-Property Verification + Sitemap Submission

- Go to https://search.google.com/search-console
- Add property: `sipiteno.com` (domain property, not URL-prefix)
- Verification: DNS TXT record through your registrar (Namecheap? GoDaddy?)
- After verified: Sitemaps → Add a new sitemap → `https://sipiteno.com/sitemap.xml`
- Submit and wait for processing (1-3 days)

## 2. Bing Webmaster Tools Import

- Go to https://www.bing.com/webmasters
- Add site: `https://sipiteno.com`
- Import from GSC (use the "Import" button after GSC is set up)
- Submit sitemap: `https://sipiteno.com/sitemap.xml`
- The IndexNow key `36c569de4e73c7f56a67fa365be2f95f` is already deployed at https://sipiteno.com/36c569de4e73c7f56a67fa365be2f95f.txt

## 3. WWW Redirect: Verify 308

After deploy (2026-07-23), the vercel.json now includes a permanent (308) redirect from www.sipiteno.com → sipiteno.com.
Verify: `curl -s -o /dev/null -w "%{http_code}" https://www.sipiteno.com/` should return 308.
If it still returns 307, the redirect is configured in the Vercel Dashboard instead:
  - Go to https://vercel.com/sipiteno/sipiteno/settings/domains
  - Find www.sipiteno.com
  - Change from "Temporary Redirect (307)" to "Permanent Redirect (308)"
  - Or remove the dashboard redirect and let vercel.json handle it

## 4. HSTS Preload Submission

After the deploy ships the updated HSTS header (`max-age=63072000; includeSubDomains; preload`):
  - Go to https://hstspreload.org/
  - Enter `sipiteno.com`
  - Check that all requirements pass
  - Submit to the preload list
  - Wait for acceptance (can take weeks/months)

## 5. Thin Page Analysis — No Action Needed

The conservative word-count analysis found NO pages under 120 unique words.
All country service pages average ~1,700 words; glossary pages ~1,100 words.
The enrichment scripts from previous cycles have already thickened all fleet pages.
No noindex injection was performed.

## 6. CLS Monitoring

Field CLS p75 = 0.726 (CrUX, sample n=14). Fix applied: `min-height: 100dvh; contain: layout` on `#root`.
Field data takes ~28 days to refresh. Monitor in GSC → Core Web Vitals after 30 days.

## 7. IndexNow

The submit script is at `scripts/indexnow-ping.sh`. It posts up to 200 URLs from the sitemap.
Run after each deploy: `bash scripts/indexnow-ping.sh`
Existing key: `36c569de4e73c7f56a67fa365be2f95f` (deployed at /36c569de4e73c7f56a67fa365be2f95f.txt)

---

**Deployed:** 2026-07-23 via `vercel build && vercel deploy --prebuilt --prod`
**Changes:** robots.txt (new), www 308 redirect, HSTS upgrade, CLS mitigation, llms-full.txt (new), IndexNow script
