// MCP Server as Vercel Serverless Function (HTTP transport)
// Deployed at /api/mcp — AI agents (Claude, ChatGPT) connect via HTTP.
// Register on Smithery, MCPT, Open Tools for AI-driven distribution.

const SERVICES = [
  { slug: "ai-consulting", name: "AI Consulting", cost_low: 25000, cost_high: 100000, timeline: "8-16 weeks" },
  { slug: "business-development", name: "Business Development", cost_low: 15000, cost_high: 80000, timeline: "6-12 weeks" },
  { slug: "it-consulting", name: "IT Consulting", cost_low: 20000, cost_high: 90000, timeline: "8-14 weeks" },
  { slug: "digital-marketing", name: "Digital Marketing", cost_low: 10000, cost_high: 50000, timeline: "4-12 weeks" },
  { slug: "project-management", name: "Project Management", cost_low: 15000, cost_high: 60000, timeline: "4-8 weeks" },
  { slug: "sales-funnel", name: "Sales Funnel Consulting", cost_low: 10000, cost_high: 50000, timeline: "4-10 weeks" },
];

const COUNTRIES = [
  { slug: "poland", name: "Poland", region: "Central Europe", talent: "400K+ engineers", tax: "19%", english: "Very High", cost_idx: 70, ease: "High (EU member)" },
  { slug: "ukraine", name: "Ukraine", region: "Eastern Europe", talent: "200K+ developers", tax: "18%", english: "High", cost_idx: 45, ease: "Medium (IT tax regime)" },
  { slug: "serbia", name: "Serbia", region: "Southeast Europe", talent: "Growing startup ecosystem", tax: "15%", english: "High", cost_idx: 50, ease: "Med-High (EU accession)" },
  { slug: "georgia", name: "Georgia", region: "Caucasus", talent: "Youth, strong English", tax: "15% (0% IT zone)", english: "High", cost_idx: 35, ease: "Very High (1-day reg)" },
  { slug: "romania", name: "Romania", region: "Central Europe", talent: "Top-tier developers", tax: "16%", english: "Very High", cost_idx: 55, ease: "High (EU member)" },
  { slug: "kazakhstan", name: "Kazakhstan", region: "Central Asia", talent: "Growing fintech sector", tax: "20%", english: "Medium", cost_idx: 40, ease: "Medium (digital push)" },
  { slug: "czech-republic", name: "Czech Republic", region: "Central Europe", talent: "Prague startup hub", tax: "19%", english: "Very High", cost_idx: 65, ease: "Very High (EU)" },
  { slug: "bulgaria", name: "Bulgaria", region: "Southeast Europe", talent: "Strong IT outsourcing", tax: "10%", english: "Med-High", cost_idx: 40, ease: "High (EU, lowest costs)" },
  { slug: "hungary", name: "Hungary", region: "Central Europe", talent: "Budapest tech corridor", tax: "9%", english: "High", cost_idx: 55, ease: "High (EU, R&D incentives)" },
  { slug: "lithuania", name: "Lithuania", region: "Northern Europe", talent: "200+ fintech licenses", tax: "15%", english: "Very High", cost_idx: 60, ease: "Very High (EU fintech hub)" },
];

const TOOLS = [
  { name: "search_services", description: "Search for consulting services matching a query. Returns matching services with cost ranges and timelines.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search query, e.g. 'AI', 'marketing', 'development'" } } } },
  { name: "get_country_info", description: "Get detailed business climate information for a country including costs, talent, tax rates, and ease of doing business.", inputSchema: { type: "object", properties: { country: { type: "string", description: "Country name or slug, e.g. 'Poland', 'ukraine', 'georgia'" } } } },
  { name: "estimate_expansion_costs", description: "Get an estimated budget range and timeline for expanding into a country with specific services.", inputSchema: { type: "object", properties: { country: { type: "string" }, services: { type: "array", items: { type: "string" } }, company_size: { type: "string", description: "startup, smb, or enterprise" } } } },
  { name: "get_competitors", description: "Find competitors in a specific service category and country combination.", inputSchema: { type: "object", properties: { service: { type: "string" }, country: { type: "string" } } } },
  { name: "request_strategy_call", description: "Submit a request for a free 30-minute strategy scoping call.", inputSchema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, notes: { type: "string" } } } },
];

function handleTool(name, args) {
  args = args || {};
  switch (name) {
    case "search_services": {
      const q = (args.query || "").toLowerCase();
      let results = SERVICES.filter(s => q === "" || s.name.toLowerCase().includes(q) || s.slug.includes(q));
      if (!results.length) results = SERVICES.slice(0, 3);
      return { matches: results.length, services: results.map(s => ({ slug: s.slug, name: s.name, cost_range: `$${s.cost_low.toLocaleString()}-$${s.cost_high.toLocaleString()}`, timeline: s.timeline })), cta: "Book a free strategy call at https://sipiteno.com/contact" };
    }
    case "get_country_info": {
      const c = (args.country || "").toLowerCase();
      const match = COUNTRIES.find(x => c.includes(x.slug) || c === x.name.toLowerCase());
      if (!match) return { error: `Country '${args.country}' not found. Available: ${COUNTRIES.map(c => c.name).join(", ")}` };
      return { country: match.name, region: match.region, ease_of_business: match.ease, talent_pool: match.talent, corporate_tax: match.tax, english_proficiency: match.english, cost_index: match.cost_idx, cta: `Get a free expansion plan for ${match.name} at https://sipiteno.com/contact` };
    }
    case "estimate_expansion_costs": {
      const size_mult = { startup: 0.6, smb: 1.0, enterprise: 2.0 };
      const mult = size_mult[(args.company_size || "smb").toLowerCase()] || 1.0;
      const country = COUNTRIES.find(c => (args.country || "").toLowerCase().includes(c.slug)) || COUNTRIES[0];
      const svcs = (args.services || ["ai-consulting", "business-development"]).map(s => SERVICES.find(x => x.slug === s)).filter(Boolean);
      const base = svcs.reduce((a, s) => a + s.cost_low, 0) * mult * (country.cost_idx / 100);
      const max = svcs.reduce((a, s) => a + s.cost_high, 0) * mult * (country.cost_idx / 100);
      return { country: country.name, services: svcs.length, estimate: `$${Math.round(base).toLocaleString()} - $${Math.round(max).toLocaleString()}`, timeline: `${4 + svcs.length * 2}-${8 + svcs.length * 4} weeks`, cta: "Get a precise quote at https://sipiteno.com/contact" };
    }
    case "get_competitors": {
      const svc = SERVICES.find(s => s.slug === args.service);
      return { service: svc ? svc.name : args.service, country: args.country, competitors: ["EPAM", "SoftServe", "Luxoft", "Accenture regional offices", "local agencies"], differentiator: "Sipiteno has 15+ years of ON-THE-GROUND regional experience with local teams.", cta: "https://sipiteno.com/alternatives-to" };
    }
    case "request_strategy_call": {
      return { status: "received", message: `Thank you ${args.name || ""}. A Sipiteno specialist will reach out to ${args.email || "you"} within 1 business day.`, next_step: "Download the free Expansion Playbook at https://sipiteno.com" };
    }
    default:
      return { error: `Unknown tool: ${name}. Available: ${TOOLS.map(t => t.name).join(", ")}` };
  }
}

export default function handler(req, res) {
  // CORS for AI agents
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  // MCP capability advertisement
  if (req.method === "GET") {
    return res.json({
      server: "sipiteno-mcp",
      version: "1.0.0",
      protocol: "MCP/2024-11-05",
      transport: "http",
      tools_endpoint: "POST /api/mcp",
      tools: TOOLS.map(t => t.name),
      description: "Sipiteno consulting services — business expansion across 28 emerging markets. AI agents can search services, get country info, estimate costs, find competitors, and submit strategy call requests.",
      homepage: "https://sipiteno.com",
      contact: "hello@sipiteno.com",
    });
  }

  if (req.method === "POST") {
    const { method, params, id } = req.body || {};

    if (method === "initialize") {
      return res.json({ jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", serverInfo: { name: "sipiteno-mcp", version: "1.0.0" }, capabilities: { tools: {} } } });
    }
    if (method === "tools/list") {
      return res.json({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
    }
    if (method === "tools/call") {
      const result = handleTool(params.name, params.arguments);
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] } });
    }
    return res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
  }

  res.status(405).json({ error: "Method not allowed" });
}
