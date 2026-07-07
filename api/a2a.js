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

  if (req.method === 'GET') {
    return res.status(200).json(siteConfig);
  }

  const { jsonrpc, method, params, id } = req.body || {};

  if (jsonrpc !== '2.0') {
    return res.status(200).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id: id || null });
  }

  switch (method) {
    case 'agent/info':
    case 'agent.describe':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: {
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          capabilities: siteConfig.capabilities || [],
          version: siteConfig.version || '1.0.0',
          authentication: siteConfig.authentication || { type: 'none' }
        },
        id
      });

    case 'agent/capabilities':
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { capabilities: siteConfig.capabilities || [], content: siteConfig.content || [] },
        id
      });

    case 'agent/query':
    case 'agent/search':
      const query = (params && (params.query || params.q)) || '';
      const content = (siteConfig.content || []).filter(item => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (item.title || '').toLowerCase().includes(q) ||
               (item.description || '').toLowerCase().includes(q);
      });
      return res.status(200).json({
        jsonrpc: '2.0',
        result: { query, results: content, total: content.length },
        id
      });

    default:
      return res.status(200).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found: ' + method },
        id
      });
  }
};
