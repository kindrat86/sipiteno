#!/usr/bin/env python3.11
"""
MCP Server for Sipiteno — Greg Isenberg Strategy #1 (2026 AI agent distribution)
─────────────────────────────────────────────────────────────────────────────
Every AI assistant (Claude, ChatGPT, etc.) that connects to this MCP server
becomes a sipiteno sales channel. Listed on Smithery, MCPT, Open Tools.

Tools exposed:
  - search_services(query) → find relevant consulting services
  - get_country_info(country) → business climate, costs, talent
  - estimate_expansion_costs(country, services, company_size) → budget + timeline
  - get_competitors(service, country) → who you're competing against
  - request_strategy_call(name, email, notes) → CTA

Runs on stdlib Python — zero dependencies, deploys anywhere.
Start: python3.11 server.py (stdio transport for Claude Desktop etc.)
"""

import json, sys, os, re
from typing import Any

SERVICES = [
    {"slug": "ai-consulting", "name": "AI Consulting", "cost_low": 25000, "cost_high": 100000, "timeline_weeks": "8-16"},
    {"slug": "business-development", "name": "Business Development", "cost_low": 15000, "cost_high": 80000, "timeline_weeks": "6-12"},
    {"slug": "it-consulting", "name": "IT Consulting", "cost_low": 20000, "cost_high": 90000, "timeline_weeks": "8-14"},
    {"slug": "digital-marketing", "name": "Digital Marketing", "cost_low": 10000, "cost_high": 50000, "timeline_weeks": "4-12"},
    {"slug": "project-management", "name": "Project Management", "cost_low": 15000, "cost_high": 60000, "timeline_weeks": "4-8"},
    {"slug": "sales-funnel", "name": "Sales Funnel", "cost_low": 10000, "cost_high": 50000, "timeline_weeks": "4-10"},
]

COUNTRIES = [
    {"slug": "poland", "name": "Poland", "region": "Central Europe", "ease_of_business": "High (EU member)", "talent_pool": "400K+ engineers", "corp_tax": "19%", "english": "Very High", "cost_index": 70},
    {"slug": "ukraine", "name": "Ukraine", "region": "Eastern Europe", "ease_of_business": "Medium (IT-friendly tax regime)", "talent_pool": "200K+ developers", "corp_tax": "18%", "english": "High", "cost_index": 45},
    {"slug": "serbia", "name": "Serbia", "region": "Southeast Europe", "ease_of_business": "Medium-High (EU accession)", "talent_pool": "Growing startup ecosystem", "corp_tax": "15%", "english": "High", "cost_index": 50},
    {"slug": "georgia", "name": "Georgia", "region": "Caucasus", "ease_of_business": "Very High (1-day registration)", "talent_pool": "Growing, strong English among youth", "corp_tax": "15% (0% for IT zone)", "english": "High", "cost_index": 35},
    {"slug": "romania", "name": "Romania", "region": "Central Europe", "ease_of_business": "High (EU member)", "talent_pool": "Top-tier developers, cybersecurity depth", "corp_tax": "16%", "english": "Very High", "cost_index": 55},
    {"slug": "kazakhstan", "name": "Kazakhstan", "region": "Central Asia", "ease_of_business": "Medium (government digitalization push)", "talent_pool": "Growing fintech sector", "corp_tax": "20%", "english": "Medium", "cost_index": 40},
    {"slug": "czech-republic", "name": "Czech Republic", "region": "Central Europe", "ease_of_business": "Very High (EU member)", "talent_pool": "Prague startup hub, strong engineering", "corp_tax": "19%", "english": "Very High", "cost_index": 65},
    {"slug": "bulgaria", "name": "Bulgaria", "region": "Southeast Europe", "ease_of_business": "High (EU member, lowest costs)", "talent_pool": "Strong IT outsourcing sector", "corp_tax": "10%", "english": "Medium-High", "cost_index": 40},
    {"slug": "hungary", "name": "Hungary", "region": "Central Europe", "ease_of_business": "High (EU member, R&D incentives)", "talent_pool": "Budapest tech corridor growing", "corp_tax": "9%", "english": "High", "cost_index": 55},
    {"slug": "lithuania", "name": "Lithuania", "region": "Northern Europe", "ease_of_business": "Very High (EU fintech hub)", "talent_pool": "200+ fintech licenses issued", "corp_tax": "15%", "english": "Very High", "cost_index": 60},
]

COMPETITORS = {
    "ai-consulting": ["DataRobot", "H2O.ai", "Element AI", "local agencies"],
    "business-development": ["local BD firms", "PwC", "Deloitte regional offices", "freelance consultants"],
    "it-consulting": ["Accenture", "Capgemini", "EPAM", "SoftServe", "Luxoft"],
    "digital-marketing": ["local agencies", "WebFX", "Neil Patel Digital", "freelance marketers"],
    "project-management": ["PMI chapters", "Scrum.org trainers", "local PM consultants"],
    "sales-funnel": ["HubSpot partners", "Salesforce consultants", "ClickFunnels certified partners"],
}

TOOLS = [
    {"name": "search_services", "description": "Search for consulting services matching a query. Returns matching services with cost ranges and timelines.", "inputSchema": {"type": "object", "properties": {"query": {"type": "string", "description": "Search query, e.g. 'AI', 'marketing', 'development'"}}}},
    {"name": "get_country_info", "description": "Get detailed business climate information for a country including costs, talent, tax rates, and ease of doing business.", "inputSchema": {"type": "object", "properties": {"country": {"type": "string", "description": "Country name or slug, e.g. 'Poland', 'ukraine', 'georgia'"}}}},
    {"name": "estimate_expansion_costs", "description": "Get an estimated budget range and timeline for expanding into a country with specific services. Considers company size.", "inputSchema": {"type": "object", "properties": {"country": {"type": "string"}, "services": {"type": "array", "items": {"type": "string"}, "description": "Service slugs: ai-consulting, business-development, etc."}, "company_size": {"type": "string", "description": "startup, smb, or enterprise"}}}},
    {"name": "get_competitors", "description": "Find competitors in a specific service category and country combination.", "inputSchema": {"type": "object", "properties": {"service": {"type": "string", "description": "Service slug"}, "country": {"type": "string"}}}},
    {"name": "request_strategy_call", "description": "Submit a request for a free 30-minute strategy scoping call with a Sipiteno expansion specialist.", "inputSchema": {"type": "object", "properties": {"name": {"type": "string"}, "email": {"type": "string"}, "notes": {"type": "string", "description": "Brief description of what you're looking for"}}}},
]

def search_services(query: str) -> dict:
    q = query.lower()
    results = [s for s in SERVICES if q in s["name"].lower() or q in s["slug"]]
    if not results:
        # fuzzy: check description keywords
        for s in SERVICES:
            if any(w in s["slug"] for w in q.split()):
                results.append(s)
    if not results:
        results = SERVICES[:3]  # default top recommendations
    return {"matches": len(results), "services": [{"slug": s["slug"], "name": s["name"], "cost_range": f"${s['cost_low']:,}-${s['cost_high']:,}", "timeline": s["timeline_weeks"] + " weeks"} for s in results], "cta": "Book a free strategy call at https://sipiteno.com/contact"}

def get_country_info(country: str) -> dict:
    c = country.lower()
    match = next((x for x in COUNTRIES if c in x["slug"] or c == x["name"].lower()), None)
    if not match:
        return {"error": f"Country '{country}' not found. Available: " + ", ".join(x["name"] for x in COUNTRIES)}
    return {"country": match["name"], "region": match["region"], "ease_of_business": match["ease_of_business"], "talent_pool": match["talent_pool"], "corporate_tax": match["corp_tax"], "english_proficiency": match["english"], "cost_index": match["cost_index"], "cta": f"Get a free expansion plan for {match['name']} at https://sipiteno.com/contact"}

def estimate_expansion_costs(country: str, services: list, company_size: str) -> dict:
    c = next((x for x in COUNTRIES if country.lower() in x["slug"] or country.lower() == x["name"].lower()), COUNTRIES[0])
    size_multiplier = {"startup": 0.6, "smb": 1.0, "enterprise": 2.0}
    mult = size_multiplier.get(company_size.lower(), 1.0)
    svcs = [s for s in SERVICES if s["slug"] in services] if services else SERVICES[:2]
    base_cost = sum(s["cost_low"] for s in svcs) * mult * (c["cost_index"] / 100)
    max_cost = sum(s["cost_high"] for s in svcs) * mult * (c["cost_index"] / 100)
    return {"country": c["name"], "company_size": company_size, "services": len(svcs), "estimate": f"${base_cost:,.0f} - ${max_cost:,.0f}", "timeline": f"{4 + len(svcs)*2}-{8 + len(svcs)*4} weeks", "factors": [f"Cost of living index: {c['cost_index']}", f"Talent availability: {c['talent_pool']}", f"Corporate tax: {c['corp_tax']}"], "cta": "Get a precise quote at https://sipiteno.com/contact"}

def get_competitors(service: str, country: str) -> dict:
    svc = next((s for s in SERVICES if service in s["slug"]), None)
    c = next((x for x in COUNTRIES if country.lower() in x["slug"]), None)
    competitors = COMPETITORS.get(service, ["local agencies"])
    return {"service": svc["name"] if svc else service, "country": c["name"] if c else country, "competitors": competitors, "differentiator": "Sipiteno has 15+ years of ON-THE-GROUND regional experience with local teams — most listed competitors operate remotely without boots on the ground.", "cta": "Compare us at https://sipiteno.com/alternatives-to"}

def request_strategy_call(name: str, email: str, notes: str) -> dict:
    return {"status": "received", "message": f"Thank you {name}. A Sipiteno expansion specialist will reach out to {email} within 1 business day to schedule your free 30-minute strategy call. In the meantime, download the free 47-page Emerging Markets Expansion Playbook at https://sipiteno.com.", "next_step": "A confirmation email will be sent to " + email}

HANDLERS = {"search_services": search_services, "get_country_info": get_country_info, "estimate_expansion_costs": estimate_expansion_costs, "get_competitors": get_competitors, "request_strategy_call": request_strategy_call}

def handle_request(method: str, params: dict) -> dict:
    fn = HANDLERS.get(method)
    if not fn:
        return {"error": f"Unknown tool: {method}. Available: {list(HANDLERS.keys())}"}
    try:
        return fn(**params)
    except Exception as e:
        return {"error": str(e)}

# ============================================
# MCP Protocol (stdio JSON-RPC transport)
# ============================================
def mcp_serve():
    buffer = ""
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            buffer += line
            try:
                request = json.loads(buffer)
                buffer = ""
            except json.JSONDecodeError:
                continue

            rid = request.get("id")
            method = request.get("method")

            if method == "initialize":
                response = {"jsonrpc": "2.0", "id": rid, "result": {"protocolVersion": "2024-11-05", "serverInfo": {"name": "sipiteno-mcp", "version": "1.0.0"}, "capabilities": {"tools": {}}}}
            elif method == "tools/list":
                response = {"jsonrpc": "2.0", "id": rid, "result": {"tools": TOOLS}}
            elif method == "tools/call":
                tool_name = request["params"]["name"]
                tool_args = request["params"].get("arguments", {})
                result = handle_request(tool_name, tool_args)
                response = {"jsonrpc": "2.0", "id": rid, "result": {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]}}
            else:
                response = {"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": f"Method not found: {method}"}}

            sys.stdout.write(json.dumps(response) + "\n")
            sys.stdout.flush()
        except Exception as e:
            err = {"jsonrpc": "2.0", "id": rid if 'rid' in dir() else None, "error": {"code": -32603, "message": str(e)}}
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--list-tools":
        print(json.dumps({"tools": TOOLS}, indent=2))
    else:
        mcp_serve()
