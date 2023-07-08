#!/usr/bin/env bash
set -eux

npx rimraf dist-firefox
IS_FIREFOX=true npx vite build --outDir dist-firefox

cat dist-firefox/manifest.json | node ./scripts/manifest-firefox.js >manifest_firefox.json
mv manifest_firefox.json dist-firefox/manifest.json
cp background.html dist-firefox/background.html
