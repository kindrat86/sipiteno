#!/usr/bin/env python3
"""Generate the Sipiteno Emerging Markets Expansion Playbook PDF.

The site once promised a "47 page Expansion Playbook PDF" on the
lead-magnet form (an unconfirmed claim, removed 2026-11-03), but no PDF ever
existed — the contact API sent essay notes instead and admitted it in
comments. This script makes the artifact real, using ONLY content already
published on sipiteno.com (framework copy, the "why entries stall" essay used
in the auto-reply, and the per-country TL;DR + why-expand blocks from the 28
/locations/* pages), so no new claims are invented. Re-run after editing
location pages:

    python3 scripts/gen_playbook_pdf.py locs_dir public/playbook.pdf

locs_dir = directory with <country>.html files fetched from
https://sipiteno.com/locations/<country> (see fetch loop in the growth run).
Page count is whatever it honestly comes out to; copy on the site says the
true number (never hardcode "47").
"""
from __future__ import annotations
import html as ihtml
import re
import sys
import urllib.parse
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (KeepTogether, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table,
                                TableStyle)

BRAND = colors.HexColor("#0a0a0a")
ACCENT = colors.HexColor("#00d4aa")
MUTED = colors.HexColor("#475569")
LIGHT = colors.HexColor("#f1f5f9")

COUNTRY_ORDER = [
    ("albania", "Albania", "Southeast Europe"),
    ("armenia", "Armenia", "Caucasus"),
    ("azerbaijan", "Azerbaijan", "Caucasus"),
    ("bosnia-and-herzegovina", "Bosnia and Herzegovina", "Southeast Europe"),
    ("bulgaria", "Bulgaria", "Southeast Europe"),
    ("croatia", "Croatia", "Southeast Europe"),
    ("cyprus", "Cyprus", "Mediterranean"),
    ("czech-republic", "Czech Republic", "Central Europe"),
    ("estonia", "Estonia", "Northern Europe"),
    ("ethiopia", "Ethiopia", "East Africa"),
    ("georgia", "Georgia", "Caucasus"),
    ("greece", "Greece", "Southeast Europe"),
    ("hungary", "Hungary", "Central Europe"),
    ("india", "India", "South Asia"),
    ("kazakhstan", "Kazakhstan", "Central Asia"),
    ("kyrgyzstan", "Kyrgyzstan", "Central Asia"),
    ("latvia", "Latvia", "Northern Europe"),
    ("lithuania", "Lithuania", "Northern Europe"),
    ("moldova", "Moldova", "Eastern Europe"),
    ("montenegro", "Montenegro", "Southeast Europe"),
    ("north-macedonia", "North Macedonia", "Southeast Europe"),
    ("poland", "Poland", "Central Europe"),
    ("romania", "Romania", "Southeast Europe"),
    ("serbia", "Serbia", "Southeast Europe"),
    ("slovakia", "Slovakia", "Central Europe"),
    ("slovenia", "Slovenia", "Central Europe"),
    ("ukraine", "Ukraine", "Eastern Europe"),
    ("uzbekistan", "Uzbekistan", "Central Asia"),
]

REGION_INTRO = {
    "Central Europe": "Lower operating costs than Western Europe, EU membership or alignment, strong IT outsourcing bases, and talent pipelines that scale beyond the local market.",
    "Southeast Europe": "Growing tech ecosystems around capital-city technology parks, competitive costs, and EU-oriented regulatory trajectories in most markets.",
    "Caucasus": "Strategic crossroads between Europe and Asia, low-friction business registration, and governments actively courting technology companies.",
    "Central Asia": "The least saturated region in this playbook: fast-growing domestic demand, IT-park visa and tax regimes for tech employers, and almost no Western competition.",
    "Northern Europe": "Advanced digital government, e-residency regimes, and the region's highest willingness to transact fully remotely.",
    "Eastern Europe": "Deep engineering talent pools, cost-competitive delivery, and time-zone overlap with both EU and Gulf markets.",
    "Mediterranean": "An EU jurisdiction with an established tech-company registry regime, English-language business culture, and a bridge between EU and Middle East clients.",
    "East Africa": "One of the world's youngest populations, mobile-first consumers, and governments prioritising digital infrastructure.",
    "South Asia": "The largest absolute talent pool in this playbook and a domestic market where localized B2B software still beats global incumbents.",
}


def clean(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", ihtml.unescape(s)).strip()


def parse_country(path: Path):
    h = path.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"TL;DR — (.+?) Market Entry at a Glance</h2>\s*<ul>(.*?)</ul>", h, re.S)
    if not m:
        return None
    facts = {}
    for li in re.findall(r"<li>(.*?)</li>", m.group(2), re.S):
        lm = re.match(r"\s*<strong>(.*?)\s*:\s*</strong>\s*(.*)", li.strip(), re.S)
        if lm:
            facts[clean(lm.group(1))] = clean(lm.group(2))
    wm = re.search(r"Why Expand Into [^<]*?</h2>\s*<p>(.*?)</p>", h, re.S)
    why = clean(wm.group(1)) if wm else ""
    return {"facts": facts, "why": why}


S = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=30, leading=36, textColor=colors.white),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=13, leading=19, textColor=colors.HexColor("#a7f3d0")),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=BRAND, spaceBefore=10, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14, leading=19, textColor=BRAND, spaceBefore=14, spaceAfter=6),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=16, textColor=colors.HexColor("#1e293b")),
    "mut": ParagraphStyle("mut", fontName="Helvetica-Oblique", fontSize=9, leading=13, textColor=MUTED),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=13, textColor=colors.HexColor("#1e293b")),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=BRAND),
}


def cover(flow: list) -> None:
    flow.append(Spacer(1, 5 * cm))
    flow.append(Paragraph("The Emerging Markets<br/>Expansion Playbook", S["title"]))
    flow.append(Spacer(1, 0.6 * cm))
    flow.append(Paragraph("28 country scorecards, the 3-Door Expansion System&trade;, and the engagement ladder behind them — compiled from sipiteno.com.", S["subtitle"]))
    flow.append(Spacer(1, 1.2 * cm))
    flow.append(Paragraph("Sipiteno &middot; Larnaca, Cyprus &middot; sipiteno.com", S["mut"]))
    flow.append(PageBreak())


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(2 * cm, 1.1 * cm, "Sipiteno — The Emerging Markets Expansion Playbook")
    canvas.drawRightString(A4[0] - 2 * cm, 1.1 * cm, f"Page {doc.page}")
    canvas.restoreState()


def on_first_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BRAND)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, A4[1] - 1.1 * cm, A4[0], 1.1 * cm, stroke=0, fill=1)
    canvas.restoreState()


def main():
    locs_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("locs")
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/playbook.pdf")
    countries = []
    for slug, name, region in COUNTRY_ORDER:
        p = locs_dir / f"{slug}.html"
        if p.exists():
            data = parse_country(p)
            if data:
                countries.append((slug, name, region, data))
    if not countries:
        sys.exit("no country pages parsed")

    doc = SimpleDocTemplate(
        str(out), pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm, topMargin=2.2 * cm, bottomMargin=2 * cm,
        title="The Emerging Markets Expansion Playbook",
        author="Sipiteno Ltd",
        subject="Market entry across 28 emerging markets",
    )
    flow: list = []
    cover(flow)

    # 1. The one belief
    flow.append(Paragraph("1. Your product is not the problem", S["h1"]))
    flow.append(Paragraph("If your tech company has stalled trying to enter Eastern Europe, the Caucasus, or Central Asia — it is not your product, your price, or your team. You are missing the three things that actually open markets: <b>the right introductions, a regulatory map, and a local team that ships fast.</b>", S["body"]))
    flow.append(Spacer(1, 0.3 * cm))
    flow.append(Paragraph("Every market in this playbook is entered the same way, through three doors:", S["body"]))
    flow.append(Spacer(1, 0.2 * cm))
    three = [
        ["Door", "What it is", "Why it matters"],
        ["1. Warm Introductions", "Handoffs from people already trusted inside the market", "The difference between a 1% cold reply rate and a 47% warm one"],
        ["2. Regulatory Map", "Which licenses, data rules and compliance traps kill deals", "15 years of scar tissue, codified"],
        ["3. Local Execution", "Bilingual teams who close in weeks, not quarters", "The team that shows up"],
    ]
    t = Table([[Paragraph(c, S["cellb"] if i == 0 else S["cell"]) for c in row] for i, row in enumerate(three)], colWidths=[3.6 * cm, 6.4 * cm, 7 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    flow.append(t)
    flow.append(Spacer(1, 0.4 * cm))

    # 2. Why entries stall
    flow.append(Paragraph("2. Why entries stall in month three", S["h1"]))
    flow.append(Paragraph("The usual pattern: a company researches, picks a country, translates the site, hires a local contractor, and waits. Three months later there is no pipeline and the conclusion is &ldquo;that market is not ready&rdquo;. The market was ready. The introduction was missing.", S["body"]))
    flow.append(Spacer(1, 0.25 * cm))
    flow.append(Paragraph("Across these 28 markets, very little moves through cold outreach. Deals move through someone who already holds the relationship and will lend it to you. That is the actual distribution channel, and it is invisible from a spreadsheet in another country.", S["body"]))
    flow.append(Spacer(1, 0.25 * cm))
    flow.append(Paragraph("Three assumptions that don't travel", S["h2"]))
    for a, b in [
        ("&ldquo;Good product, market finds it.&rdquo;", "Inbound assumes a search-and-review culture. Where buyers ask a peer instead, being findable buys little."),
        ("&ldquo;We'll localise later.&rdquo;", "Localisation is not translation. It is an invoice their finance team accepts, contract terms their lawyer has seen, and a support hour overlapping their day."),
        ("&ldquo;One regional hire covers it.&rdquo;", "These are 28 distinct regulatory and relationship environments, not one region."),
    ]:
        flow.append(Paragraph(f"<b>{a}</b> {b}", S["body"]))
        flow.append(Spacer(1, 0.15 * cm))
    flow.append(Paragraph("The order that works", S["h2"]))
    for i, step in enumerate([
        "Pick on evidence — regulatory friction, payment rails, language load, and whether you have any warm path in at all.",
        "Get one warm introduction before you build anything. One real buyer conversation rewrites more assumptions than a quarter of desk research.",
        "Fix invoicing and contracting next. Unglamorous, and the most common place a nearly-closed deal dies.",
        "Only then localise the funnel — now you know which objections to answer.",
        "Hire in-market last, once you know what the role actually does.",
    ], 1):
        flow.append(Paragraph(f"<b>{i}.</b> {step}", S["body"]))
        flow.append(Spacer(1, 0.12 * cm))
    flow.append(PageBreak())

    # 3. Country scorecards
    flow.append(Paragraph("3. The 28 country scorecards", S["h1"]))
    flow.append(Paragraph("Compiled from Sipiteno's published market-entry research (sipiteno.com/locations). Capital, tech hub, languages, key industries, typical timeline and engagement size for every market in this playbook.", S["mut"]))
    flow.append(Spacer(1, 0.3 * cm))

    current_region = None
    for slug, name, region, data in countries:
        if region != current_region:
            current_region = region
            flow.append(Spacer(1, 0.3 * cm))
            flow.append(Paragraph(region.upper(), ParagraphStyle("rh", parent=S["h2"], textColor=ACCENT, fontSize=12, spaceBefore=18)))
            flow.append(Paragraph(REGION_INTRO.get(region, ""), S["mut"]))
            flow.append(Spacer(1, 0.15 * cm))
        rows = [[Paragraph(f"<b>{name}</b>", S["cellb"]), ""]]
        facts = data["facts"]
        label_map = [("Capital & tech hub", "Hub"), ("Languages", "Languages"), ("Key industries", "Industries"), ("Typical project timeline", "Timeline"), ("Average engagement size", "Engagement")]
        for label, short in label_map:
            if label in facts:
                rows.append([Paragraph(short, S["cell"]), Paragraph(facts[label], S["cell"])])
        ct = Table(rows, colWidths=[3.2 * cm, 13.8 * cm])
        ct.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
            ("LINEBELOW", (0, 0), (-1, 0), 0.8, ACCENT),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ]))
        block: list = [ct]
        if data["why"]:
            block.append(Spacer(1, 0.1 * cm))
            block.append(Paragraph(data["why"], S["mut"]))
        block.append(Spacer(1, 0.25 * cm))
        flow.append(KeepTogether(block))

    # 4. Ladder
    flow.append(PageBreak())
    flow.append(Paragraph("4. How to work with Sipiteno", S["h1"]))
    flow.append(Paragraph("Five ways to engage, climbing in value. Start free, scale when ready.", S["body"]))
    flow.append(Spacer(1, 0.2 * cm))
    ladder = [
        ["Rung", "What", "Price"],
        ["1", "Expansion Playbook (this document)", "Free"],
        ["2", "30-minute strategy scoping call with a written action plan", "Free"],
        ["3", "MicroSaaS MVP build — design, full-stack, deploy, 30-day monitoring, 4-8 weeks", "$15,000-$50,000 fixed"],
        ["4", "Business development retainer — 10-30 qualified leads/month, partnerships, market intelligence", "$3,000-$10,000/month"],
        ["5", "AI implementation program — assessment, MVP build, deployment by our engineers", "$25,000-$100,000+"],
    ]
    lt = Table([[Paragraph(c, S["cellb"] if i == 0 else S["cell"]) for c in row] for i, row in enumerate(ladder)], colWidths=[1.4 * cm, 10.8 * cm, 4.8 * cm])
    lt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    flow.append(lt)
    flow.append(Spacer(1, 0.4 * cm))
    flow.append(Paragraph("Every engagement starts with a free 30-minute scoping call. Every engagement includes a regulatory map for your target markets. If we do not open at least one qualified market opportunity within 90 days of kickoff, the next quarter of work is on us.", S["body"]))
    flow.append(Spacer(1, 0.3 * cm))
    flow.append(Paragraph("Source notes: country data reflects sipiteno.com's published location scorecards at time of generation. Timelines and engagement sizes are typical ranges, not quotes. This playbook is informational and does not constitute legal or tax advice.", S["mut"]))
    flow.append(Spacer(1, 0.4 * cm))
    flow.append(Paragraph("Get in touch: sales@sipiteno.com &middot; sipiteno.com &middot; +357-24-628166", S["body"]))

    doc.build(flow, onFirstPage=on_first_page, onLaterPages=on_page)
    print(f"OK wrote {out}")


if __name__ == "__main__":
    main()
