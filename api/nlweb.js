const SITE_CONFIG = {
  "protocolVersion": "0.3.0",
  "name": "Sipiteno Agent",
  "description": "Sipiteno is a growth partner for B2B SaaS companies. Services: AI consulting, business development, digital marketing, IT consulting, project management, sales funnel optimization. Industry verticals: fintech, healthcare/medtech, ecommerce, cybersecurity, manufacturing, logistics, agtech, energy, Sa",
  "url": "https://sipiteno.com",
  "preferredTransport": "JSONRPC",
  "iconUrl": "https://sipiteno.com/icon.png",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false,
    "stateTransitionHistory": false
  },
  "defaultInputModes": [
    "text/plain",
    "application/json"
  ],
  "defaultOutputModes": [
    "text/plain",
    "application/json"
  ],
  "skills": [],
  "attribution": "Sipiteno, https://sipiteno.com",
  "content": [
    {
      "title": "Sipiteno \u2014 Growth Consulting",
      "url": "https://sipiteno.com/",
      "description": "Growth strategy, automation, and execution for SaaS startups.",
      "type": "homepage"
    },
    {
      "title": "Sipiteno Services",
      "url": "https://sipiteno.com/services",
      "description": "AI consulting, business development, digital marketing, sales funnel optimization.",
      "type": "services"
    }
  ]
};

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const siteConfig = SITE_CONFIG;
  const query = (req.query && req.query.query) || (req.body && req.body.query) || '';
  const limit = parseInt((req.query && req.query.limit) || (req.body && req.body.limit) || '10');

  const results = (siteConfig.content || []).filter(item => {
    if (!query) return true;
    const q = String(query).toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.description || '').toLowerCase().includes(q);
  }).slice(0, limit);

  return res.status(200).json({
    query,
    results: results.map(c => ({
      url: c.url,
      name: c.title,
      description: c.description,
      site_name: siteConfig.name,
      site_url: siteConfig.url,
      type: c.type || 'webpage',
      score: 1.0
    })),
    total: results.length,
    ai_answer: query ? siteConfig.name + ': ' + siteConfig.description : undefined
  });
};
