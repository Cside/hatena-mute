#!/usr/bin/env bash
set -eux;

pnpm run build;
cp -r dist dist_firefox;
node ./scripts/manifest-firefox.js > dist_firefox/manifest.json;
cp background.html dist_firefox/background.html;
