#!/bin/bash
# Sync dist/ → .vercel/output/static/ so `vercel deploy --prebuilt` picks up
# the latest build artifacts instead of a stale cache from a prior deploy.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d "dist" ]; then
  echo "sync-vercel-prebuilt: dist/ missing, skipping"
  exit 0
fi

mkdir -p .vercel/output
rm -rf .vercel/output/static
cp -R dist/. .vercel/output/static/
echo "sync-vercel-prebuilt: dist/ → .vercel/output/static/ done ($(find .vercel/output/static -type f | wc -l) files)"

# This script syncs ONLY static/. It does not produce .vercel/output/config.json,
# which is what carries vercel.json's 18 redirects, 61 rewrites and 9 headers.
# `vercel deploy --prebuilt` REQUIRES config.json and fails remotely with
#   "Config file was not found at /vercel/path0/.vercel/output/config.json"
# — after uploading, so it wastes a full deploy round-trip and reads like a
# platform error rather than a local one. It only ever appeared to work because
# a config.json left behind by an earlier `vercel build` happened to be sitting
# in the checkout; a clean export (deploy_from_commit.sh) has no such leftover.
# Verified by a failed production deploy on 2026-08-11.
#
# Warn here, where the cause is obvious, instead of failing 60s later in the
# build container. A stale config.json is also flagged: shipping routing rules
# from an older vercel.json is the same class of bug in the other direction.
if [ ! -f .vercel/output/config.json ]; then
  echo "sync-vercel-prebuilt: WARNING — no .vercel/output/config.json." >&2
  echo "  A '--prebuilt' deploy will FAIL and vercel.json routing would not ship." >&2
  echo "  Build with 'npx vercel build --prod' (it runs this script and writes config.json)." >&2
elif [ vercel.json -nt .vercel/output/config.json ]; then
  echo "sync-vercel-prebuilt: WARNING — vercel.json is NEWER than .vercel/output/config.json." >&2
  echo "  The prebuilt artifact would ship STALE routing. Rebuild with 'npx vercel build --prod'." >&2
fi
