#!/usr/bin/env python3
"""
truthify-static-country-services.py
====================================
Mechanical truthification of fabricated local-presence claims in the repo-root
static /{country}/{service}/index.html pages (~300 files, 2 template generations).

Mirrors the wording already applied to scripts/prerender.mjs in commit 8adc19e4
(order 3). Same replacements, same wording. This is order 3a.

Fabricated claims removed (Sipiteno has no physical presence outside Larnaca CY):
  GEN 1 (168 files: ai-consulting, business-development, digital-marketing,
         it-consulting, project-management, sales-funnel):
    - "with local teams in <Capital>." (meta/og/twitter/Article/Service descs)
    - "with an on-the-ground team in <Capital> (<TechHub>)" (lede)
    - "on-the-ground presence in <Capital> (<TechHub>)" (FAQ)
    - "local execution with international quality standards" (FAQ body)
  GEN 2 (130 files: b2b-partnerships, digital-transformation, fintech-consulting,
         market-entry, mvp-development, tech-recruiting):
    - "Our team has worked extensively in <Country>, particularly in and around <Capital>."
    - "delivered by our bilingual team in <Country>"
    - "on-the-ground network of 200+ vetted partners" (market-entry only)
"""
import os
import re
import sys

COUNTRIES = [
    "albania", "armenia", "azerbaijan", "bosnia-and-herzegovina", "bulgaria",
    "croatia", "cyprus", "czech-republic", "estonia", "ethiopia", "georgia",
    "greece", "hungary", "india", "kazakhstan", "kyrgyzstan", "latvia",
    "lithuania", "moldova", "montenegro", "north-macedonia", "poland",
    "romania", "serbia", "slovakia", "slovenia", "ukraine", "uzbekistan",
]

# (name, regex, replacement, use_capture_backref)
REPLACEMENTS = [
    # GEN 1 — descriptions: "with local teams in <Capital>."
    (
        "gen1-desc-local-teams",
        re.compile(r"with local teams in ([A-Za-z]+(?: [A-Za-z]+)?)\."),
        ", working remotely with clients across the country.",
    ),
    # GEN 1 — lede: "with an on-the-ground team in <Capital> (<TechHub>)"
    (
        "gen1-lede-on-the-ground-team",
        re.compile(r"with an on-the-ground team in [^(]+\([^)]+\)"),
        ", working remotely with clients across the country",
    ),
    # GEN 1 — FAQ: "on-the-ground presence in <Capital> (<TechHub>)"
    (
        "gen1-faq-on-the-ground-presence",
        re.compile(r"on-the-ground presence in [^(]+\([^)]+\)"),
        "hands-on delivery",
    ),
    # GEN 1 — FAQ body: "local execution with international quality standards"
    (
        "gen1-faq-local-execution",
        re.compile(r"local execution with international quality standards"),
        "regional expertise with international quality standards",
    ),
    # GEN 2 — "Our team has worked extensively in <Country>, particularly in and around <Capital>."
    (
        "gen2-worked-extensively",
        re.compile(r"Our team has worked extensively in ([^,]+), particularly in and around ([^.]+)\."),
        r"Our team has worked extensively with clients across \1.",
    ),
    # GEN 2 — "delivered by our bilingual team in <Country>"
    (
        "gen2-bilingual-team-in",
        re.compile(r"delivered by our bilingual team in ([A-Za-z ]+?), who bring"),
        "delivered remotely by our bilingual team, who bring",
    ),
    # GEN 2 (market-entry) — "on-the-ground network"
    (
        "gen2-on-the-ground-network",
        re.compile(r"on-the-ground network"),
        "network",
    ),
    # GEN 1 (business-development, subset) — "the on-the-ground presence and relationship capital"
    (
        "gen1-bd-on-the-ground-presence-capital",
        re.compile(r"provides the on-the-ground presence and relationship capital"),
        "provides the relationship capital",
    ),
    # GEN 1 (subset) — "a cultural bridge on the ground"
    (
        "gen1-cultural-bridge-on-the-ground",
        re.compile(r"a cultural bridge on the ground"),
        "a bilingual cultural bridge",
    ),
    # GEN 2 (market-entry) — "we deploy a bilingual local team" (claims a local,
    # on-the-ground Sipiteno team; drop the locality claim)
    (
        "gen2-deploy-bilingual-local-team",
        re.compile(r"deploy a bilingual local team"),
        "deploy a bilingual team",
    ),
]

# Post-pass cleanups (fix artifacts introduced by the replacements above:
# dropping "with local teams in X." / "with an on-the-ground team ..." leaves a
# stray space before the leading comma, e.g. "Poland , working remotely").
CLEANUPS = [
    ("collapse-space-before-comma", re.compile(r" ,"), ","),
]

DRY_RUN = "--dry-run" in sys.argv


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    totals = {}
    files_touched = 0
    files_changed = 0

    for country in COUNTRIES:
        cdir = os.path.join(root, country)
        if not os.path.isdir(cdir):
            continue
        for dirpath, _dirnames, filenames in os.walk(cdir):
            for fn in filenames:
                if fn != "index.html":
                    continue
                path = os.path.join(dirpath, fn)
                with open(path, "r", encoding="utf-8") as f:
                    original = f.read()
                new = original
                for name, rx, repl in REPLACEMENTS:
                    new, n = rx.subn(repl, new)
                    if n:
                        totals[name] = totals.get(name, 0) + n
                for name, rx, repl in CLEANUPS:
                    new, n = rx.subn(repl, new)
                    if n:
                        totals[name] = totals.get(name, 0) + n
                if new != original:
                    files_changed += 1
                    if not DRY_RUN:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(new)
                files_touched += 1

    print(f"files_touched={files_touched} files_changed={files_changed} dry_run={DRY_RUN}")
    for name in [r[0] for r in REPLACEMENTS]:
        print(f"  {name}: {totals.get(name, 0)} replacements")
    if not totals:
        print("NO REPLACEMENTS MADE — nothing matched. Aborting check.")


if __name__ == "__main__":
    main()
