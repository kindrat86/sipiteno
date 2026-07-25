// Contact form endpoint — sends submissions to sales@sipiteno.com via Resend.
// Requires RESEND_API_KEY in the Vercel project env (Production).
// Falls back to 503 when unconfigured so the client can show an honest
// error + mailto fallback instead of a fake success state.

const MAX_LEN = { fullName: 200, companyName: 200, email: 320, phone: 50, country: 100, service: 100, hearAboutUs: 100, message: 2000 };


// Sent to anyone who requests the expansion playbook from the pSEO fleet forms.
// Content is the same market-entry material as the Sipiteno email sequence; every
// claim here is drawn from sipiteno.com's own published positioning. Deliberately
// NOT claimed: a "emailed PDF" — no such asset exists in this repo, so promising a
// document rather than the notes themselves would repeat the original defect.
const PLAYBOOK_HTML = `<div style="font-family:Inter,Arial,sans-serif;background:#0f172a;padding:24px 12px">
<div style="max-width:560px;margin:0 auto;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:26px">
<h2 style="color:#f8fafc;font-size:1.25rem;margin:0 0 14px">Why expansion stalls in month three</h2>
<p style="color:#cbd5e1;line-height:1.7;font-size:15px;margin:0 0 14px">Thanks for asking. Here are the notes I'd want you to have before you pick a market — the same material I'd open a paid engagement with.</p>
<p style="color:#cbd5e1;line-height:1.7;font-size:15px;margin:0 0 14px">The usual pattern: a company researches, picks a country, translates the site, hires a local contractor, and waits. Three months later there's no pipeline and the conclusion is "that market isn't ready". The market was ready. The introduction was missing.</p>
<p style="color:#cbd5e1;line-height:1.7;font-size:15px;margin:0 0 14px">Across Central &amp; Eastern Europe, the Caucasus and Central Asia, very little moves through cold outreach. Deals move through someone who already holds the relationship and will lend it to you. That's the actual distribution channel, and it's invisible from a spreadsheet in another country.</p>
<h3 style="color:#f8fafc;font-size:1rem;margin:22px 0 10px">Three assumptions that don't travel</h3>
<ul style="padding-left:20px;margin:0 0 16px">
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px"><strong style="color:#f8fafc">"Good product, market finds it."</strong> Inbound assumes a search-and-review culture. Where buyers ask a peer instead, being findable buys little.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px"><strong style="color:#f8fafc">"We'll localise later."</strong> Localisation isn't translation. It's an invoice their finance team accepts, contract terms their lawyer has seen, and a support hour overlapping their day. Any one missing stalls a signed intent.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px"><strong style="color:#f8fafc">"One regional hire covers it."</strong> These are 28 distinct regulatory and relationship environments, not one region.</li>
</ul>
<h3 style="color:#f8fafc;font-size:1rem;margin:22px 0 10px">The order that works</h3>
<ol style="padding-left:20px;margin:0 0 16px">
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px">Pick on evidence — regulatory friction, payment rails, language load, and whether you have any warm path in at all.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px">Get one warm introduction before you build anything. One real buyer conversation rewrites more assumptions than a quarter of desk research.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px">Fix invoicing and contracting next. Unglamorous, and the most common place a nearly-closed deal dies.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px">Only then localise the funnel — now you know which objections to answer.</li>
<li style="color:#cbd5e1;line-height:1.65;margin-bottom:9px;font-size:15px">Hire in-market last, once you know what the role actually does.</li>
</ol>
<p style="color:#cbd5e1;line-height:1.7;font-size:15px;margin:0 0 14px">If you tell me the country and what you sell, I'll reply with a straight answer on whether it's a good first move. Just reply to this email — it reaches me.</p>
<hr style="border:0;border-top:1px solid #334155;margin:22px 0 14px">
<p style="color:#94a3b8;font-size:0.8rem;line-height:1.6;margin:0">Maryan &middot; Sipiteno &middot; <a href="https://sipiteno.com" style="color:#38bdf8;text-decoration:none">sipiteno.com</a><br>
Business development and AI consulting for expansion across 28 emerging markets. You're getting this because you requested the expansion notes at sipiteno.com.</p>
</div></div>`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    res.status(503).json({ error: "Contact service not configured" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  // Honeypot: bots fill it, humans never see it. Pretend success.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    res.status(200).json({ ok: true });
    return;
  }

  const field = (name) => String(body[name] ?? "").trim().slice(0, MAX_LEN[name]);
  const fullName = field("fullName");
  const email = field("email");
  const message = field("message");
  if (!fullName || !message || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }
  const companyName = field("companyName");
  const phone = field("phone");
  const country = field("country");
  const service = field("service");
  const hearAboutUs = field("hearAboutUs");

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const row = (label, value) => (value ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">${label}</td><td style="padding:4px 0;">${esc(value)}</td></tr>` : "");

  const html = `
    <h2 style="margin:0 0 12px;">New contact form submission — sipiteno.com</h2>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row("Name", fullName)}
      ${row("Company", companyName)}
      ${row("Email", email)}
      ${row("Phone", phone)}
      ${row("Country", country)}
      ${row("Service", service)}
      ${row("How did you hear about us?", hearAboutUs)}
    </table>
    <h3 style="margin:16px 0 8px;">Message</h3>
    <p style="white-space:pre-wrap;font-size:14px;">${esc(message)}</p>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Sipiteno Website <leads@gitdealflow.com>",
        to: [process.env.CONTACT_TO || "sales@sipiteno.com"],
        reply_to: email,
        subject: `[sipiteno.com] ${fullName}${companyName ? ` (${companyName})` : ""}${service ? ` — ${service}` : ""}`,
        html,
      }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      console.error("Resend error", resp.status, detail.slice(0, 500));
      res.status(502).json({ error: "Email delivery failed" });
      return;
    }

    // The pSEO fleet's "Free Expansion Playbook" form posts here from 633 pages and
    // then tells the visitor "Check your inbox — the playbook is on its way." Until
    // now nothing was ever sent TO the visitor: the only mail was this internal
    // notification to sales@. Send the requester something real, immediately.
    // NOTE: sipiteno.com is not a verified Resend sending domain (only the other 8
    // portfolio domains are), which is why this goes out from the already-verified
    // leads@gitdealflow.com address the site's own notification mail uses.
    let requester_sent = false;
    if (/playbook/i.test(String(service || "")) || /playbook/i.test(String(message || ""))) {
      try {
        const r2 = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM || "Sipiteno <leads@gitdealflow.com>",
            to: [email],
            reply_to: "sales@sipiteno.com",
            subject: "Your emerging-markets expansion notes (and why entries stall in month three)",
            html: PLAYBOOK_HTML,
          }),
        });
        requester_sent = r2.ok;
        if (!r2.ok) console.error("Playbook send failed", r2.status);
      } catch (e) {
        console.error("Playbook send threw", e.message);
      }
    }
    res.status(200).json({ ok: true, requester_sent });
  } catch (err) {
    console.error("Contact send failed", err);
    res.status(502).json({ error: "Email delivery failed" });
  }
}
