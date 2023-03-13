#!/usr/bin/env bash
set -eux;

IS_FIREFOX=true pnpm run build;
mv dist dist_firefox;
cat dist_firefox/manifest.json | node ./scripts/manifest-firefox.js > manifest_firefox.json;
mv manifest_firefox.json dist_firefox/manifest.json
cp background.html dist_firefox/background.html;
