#!/usr/bin/env bash
set -eux;

pnpm run clean:firefox;
IS_FIREFOX=true npx vite build --outDir dist_firefox;
cat dist_firefox/manifest.json | node ./scripts/manifest-firefox.js > manifest_firefox.json;
mv manifest_firefox.json dist_firefox/manifest.json
cp background.html dist_firefox/background.html;
