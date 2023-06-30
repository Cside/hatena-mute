#!/usr/bin/env bash
set -eu

pnpm install
pnpm run build:chrome

version=$(jq -r .version <package.json | sed 's/\./-/g')
set -x
zip -r dist-chrome-"${version}".zip dist-chrome

rm -rf dist-chrome
