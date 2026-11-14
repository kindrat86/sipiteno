// x402 v2 paid endpoint: AI-agent store check ($0.05 per call, Base USDC).
// 402 challenge -> verify+settle via facilitator -> proxy to store-check backend.
export default async function handler(req, res) {
  const PAY_TO = (process.env.SIPI_X402_PAY_TO_WALLET || "").trim();
  const PRICE_CENTS = 5;
  const PUBLIC_URL = "https://sipiteno.com";
  const FACILITATOR = (process.env.AGENTMAIL_X402_FACILITATOR || "https://facilitator.payai.network").replace(/\/$/, "");
  const RESOURCE_URL = PUBLIC_URL + "/api/x402-store-check";
  const BASE_CHAIN = "eip155:8453";
  const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,X-PAYMENT");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (!PAY_TO) return res.status(503).json({ error: "not_configured" });

  const domain = (req.query.domain || "").trim().toLowerCase();
  const domainValid = domain && /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain);

  const requirements = {
    scheme: "exact",
    network: BASE_CHAIN,
    amount: String(PRICE_CENTS * 10000),
    asset: USDC_BASE,
    payTo: PAY_TO,
    maxTimeoutSeconds: 60,
    extra: { name: "USD Coin", version: "2" },
  };

  const paymentHeader = req.headers["x-payment"] || "";

  if (!paymentHeader) {
    const challenge = {
      x402Version: 2,
      error: "Payment required",
      resource: {
        url: RESOURCE_URL,
        description: "AI-agent store check via Shopify /api/mcp (cutoff + returns probes), $0.05 per call, Base USDC",
        mimeType: "application/json",
        serviceName: "Sipiteno Store Check",
        tags: ["shopify", "ai-agents", "ecommerce", "store-check", "x402"],
      },
      accepts: [requirements],
      extensions: {
        bazaar: {
          info: {
            input: { type: "http", method: "GET", queryParams: { domain: { type: "string", description: "Store domain to check", example: "mudwtr.com" } } },
            output: { type: "object", format: "application/json" },
          },
          schema: {
            type: "object",
            properties: {
              input: {
                type: "object",
                properties: { queryParams: { type: "object", properties: { domain: { type: "string" } }, required: ["domain"] } },
                required: ["queryParams"],
              },
              output: {
                type: "object",
                properties: {
                  example: {
                    domain: "mudwtr.com",
                    questions: [{ key: "cutoff", verdict: "missing" }],
                    x402: { paid: true, amount: "0.05", currency: "USDC", network: BASE_CHAIN },
                  },
                },
              },
            },
            required: ["input", "output"],
          },
        },
      },
    };
    res.setHeader("Payment-Required", Buffer.from(JSON.stringify(challenge)).toString("base64"));
    return res.status(402).json(challenge);
  }

  // Decode X-PAYMENT (base64 JSON or raw JSON), verify + settle via facilitator.
  let payload = {};
  try {
    const h = String(paymentHeader).trim();
    payload = h.startsWith("{") ? JSON.parse(h) : JSON.parse(Buffer.from(h, "base64").toString("utf-8"));
  } catch {
    return res.status(402).json({ error: "invalid_payment_signature" });
  }

  async function facilitator(endpoint) {
    const r = await fetch(FACILITATOR + "/" + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "sipiteno-x402/1.0" },
      body: JSON.stringify({ x402Version: 2, paymentPayload: payload, paymentRequirements: requirements }),
    });
    const body = await r.text();
    try { return JSON.parse(body); } catch { return { transportError: "facilitator_http_" + r.status, detail: body.slice(0, 400) }; }
  }

  const verified = await facilitator("verify");
  if (!verified.isValid) {
    return res.status(402).json({ error: verified.invalidReason || verified.transportError || "payment_verification_failed" });
  }
  const settled = await facilitator("settle");
  if (!settled.success) {
    return res.status(402).json({ error: settled.errorReason || settled.transportError || "payment_settlement_failed" });
  }

  // Paid. Validate domain now (challenge is protocol-first).
  if (!domainValid) {
    return res.status(400).json({ error: "invalid_domain", example: "/api/x402-store-check?domain=mudwtr.com", note: "payment was settled; contact sales@sipiteno.com for refund" });
  }
  const backend = await fetch(`https://store-check.fly.dev/api/check?domain=${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(30000) });
  const result = await backend.json().catch(() => ({}));

  res.setHeader("Payment-Response", Buffer.from(JSON.stringify({ success: settled.success, transaction: settled.transaction || settled.payout || null })).toString("base64"));
  return res.status(200).json({
    ...result,
    x402: { paid: true, amount: "0.05", currency: "USDC", network: BASE_CHAIN, service: "sipiteno store-check" },
  });
}
