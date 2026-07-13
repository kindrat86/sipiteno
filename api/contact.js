// Contact form endpoint — sends submissions to sales@sipiteno.com via Resend.
// Requires RESEND_API_KEY in the Vercel project env (Production).
// Falls back to 503 when unconfigured so the client can show an honest
// error + mailto fallback instead of a fake success state.

const MAX_LEN = { fullName: 200, companyName: 200, email: 320, phone: 50, country: 100, service: 100, message: 2000 };

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
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact send failed", err);
    res.status(502).json({ error: "Email delivery failed" });
  }
}
