import { createHmac, timingSafeEqual } from "node:crypto";

// Universal one-click unsubscribe endpoint for all portfolio products.
// GET /api/unsubscribe?email=X&audience=Y&from=Z
//   email    — subscriber's email (required)
//   audience — Resend audience ID (required)
//   from     — optional product name for the confirmation page
// Requires RESEND_API_KEY in Vercel env (already set for sipiteno.com).

// Changed 2026-07-25 (portfolio-wide audit). This is the shared endpoint several
// products' emails point at, so all three defects below were multiplied:
//  1. A bare GET mutated state for any address, so anyone could unsubscribe any
//     subscriber they could guess, and mail-security link scanners and
//     prefetchers were silently unsubscribing real recipients. Links already
//     sent carry no token, so REQUIRING one would strand real recipients with no
//     way to opt out — worse than the bug. Hence: unsigned GET renders a
//     one-click confirmation POST; a signed GET (UNSUB_SECRET) and POST act
//     directly, so RFC 8058 one-click still works.
//  2. `audience` came from the query string straight into the Resend API path,
//     so a caller could aim this at ANY audience in the account — across every
//     product, not just one — or bend the path itself. Now UUID-validated.
//  3. It showed success unconditionally ("Don't block — show success page
//     regardless"), so a Resend outage produced people who believed they had
//     opted out and had not.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = "sales@sipiteno.com";

function signUnsub(email, secret) {
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase()).digest("base64url").slice(0, 32);
}

function validUnsubToken(email, token, secret) {
  if (!secret || !token) return false;
  const a = Buffer.from(signUnsub(email, secret));
  const b = Buffer.from(String(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  // HEAD must be allowed wherever GET is — scanners HEAD links in a message, and
  // a 405 makes them report the unsubscribe link as broken. Never mutates.
  const isHead = req.method === "HEAD";
  if (req.method !== "GET" && req.method !== "POST" && !isHead) {
    res.setHeader("Allow", "GET, HEAD, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  const email = String(req.query?.email ?? req.body?.email ?? "").trim();
  const audienceId = String(req.query?.audience ?? req.body?.audience ?? "").trim();
  const from = String(req.query?.from ?? req.body?.from ?? "our mailing list").trim();
  const token = String(req.query?.t ?? req.body?.t ?? "").trim();

  if (!email) return sendPage(res, "error", "This unsubscribe link is missing an email address.");
  if (!EMAIL_RE.test(email)) return sendPage(res, "error", "That does not look like a valid email address.");

  const signed = validUnsubToken(email, token, process.env.UNSUB_SECRET);
  if (isHead || (req.method === "GET" && !signed)) {
    return confirmPage(res, email, audienceId, from);
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return sendPage(res, "error",
      `The unsubscribe service is temporarily unavailable. Email ${SUPPORT} and we will remove you by hand.`);
  }
  if (!UUID_RE.test(audienceId)) {
    return sendPage(res, "error",
      `We could not identify which list to remove you from. Email ${SUPPORT} and we will do it by hand.`);
  }

  let ok = false;
  try {
    const patchResp = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unsubscribed: true }),
      }
    );
    // 404 = not on this audience. Treat as success: the outcome asked for already
    // holds, and saying so avoids confirming who is on which list.
    ok = patchResp.ok || patchResp.status === 404;
    if (!ok) {
      const detail = await patchResp.text().catch(() => "");
      console.error("Resend PATCH failed", patchResp.status, detail.slice(0, 300));
    }
  } catch (err) {
    console.error("Unsubscribe PATCH failed", err);
  }

  return ok
    ? sendPage(res, "success", email, from)
    : sendPage(res, "error",
        `We could not complete that just now. Email ${SUPPORT} and we will remove you by hand.`);
}

/** Explicit confirmation for unsigned GETs — still one click, but a human's. */
function confirmPage(res, email, audienceId, from) {
  const aud = UUID_RE.test(audienceId)
    ? `<input type="hidden" name="audience" value="${escape(audienceId)}">` : "";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Confirm unsubscribe — Sipiteno</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
       display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
  .card{background:#fff;border-radius:16px;padding:48px 40px;max-width:480px;width:100%;
        text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.06)}
  h1{font-size:22px;color:#1e293b;margin-bottom:8px}
  p{font-size:15px;color:#64748b;line-height:1.6}
  .email{font-weight:600;color:#1e293b}
  button{margin-top:24px;width:100%;padding:14px 20px;font:inherit;font-weight:600;color:#fff;
         background:#2563eb;border:0;border-radius:10px;cursor:pointer}
  button:hover{background:#1d4ed8}
  .footer{margin-top:24px;font-size:12px;color:#94a3b8}
  a{color:#2563eb;text-decoration:none}
</style></head>
<body><div class="card">
  <h1>Confirm you want to unsubscribe</h1>
  <p>Click below and <span class="email">${escape(email)}</span> will be removed from ${escape(from)}.</p>
  <form method="POST" action="/api/unsubscribe">
    <input type="hidden" name="email" value="${escape(email)}">
    ${aud}
    <input type="hidden" name="from" value="${escape(from)}">
    <button type="submit">Unsubscribe me</button>
  </form>
  <p class="footer"><a href="https://sipiteno.com">sipiteno.com</a></p>
</div></body></html>`);
}

function sendPage(res, status, email, from) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${status === "success" ? "Unsubscribed" : "Unsubscribe"} — Sipiteno</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #f4f6f8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  .card {
    background: #fff;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .check {
    width: 64px; height: 64px;
    background: #f0fdf4;
    border-radius: 50%;
    display: inline-flex;
    align-items: center; justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
  }
  h1 { font-size: 22px; color: #1e293b; margin-bottom: 8px; }
  p { font-size: 15px; color: #64748b; line-height: 1.6; }
  .email { font-weight: 600; color: #1e293b; }
  .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; }
  a { color: #00d4aa; text-decoration: none; }
</style>
</head>
<body>
<div class="card">
  <div class="check">${status === "success" ? "&#10003;" : "&#9888;"}</div>
  <h1>${status === "success" ? "You have been unsubscribed" : "We hit a problem"}</h1>
  ${status === "success"
    ? `<p><span class="email">${escape(email)}</span> has been removed from ${escape(from)}.</p>
  <p>You will no longer receive emails from us.</p>`
    : `<p>${escape(email)}</p>`}
  <p class="footer"><a href="https://sipiteno.com">sipiteno.com</a></p>
</div>
</body>
</html>`;

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
