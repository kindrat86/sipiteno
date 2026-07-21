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
