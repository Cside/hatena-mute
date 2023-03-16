#!/usr/bin/env bash
set -eux;

pnpm run build:firefox;

cd dist_firefox;
zip -r -FS ../dist_firefox.zip *;
cd ..;

rm -rf source_code source-code.zip;
mkdir source_code;
for file in $(git ls-files . | sed 's|/.*||' | uniq); do
    cp -r "$file" source_code/;
done

zip -r source-code.zip source_code;
rm -rf source_code;