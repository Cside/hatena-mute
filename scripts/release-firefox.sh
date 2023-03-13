#!/usr/bin/env bash
set -eux;

pnpm run build:firefox;

cd dist_firefox;
zip -r -FS ../dist_firefox.zip *;
cd ..;

rm -rf ../hatena-mute-source ../hatena-mute-source.zip;
mkdir ../hatena-mute-source;
for file in $(git ls-files . | sed 's|/.*||' | uniq); do
    cp -r "$file" ../hatena-mute-source/;
done

pwd=$PWD;
cd ..;
zip -r hatena-mute-source.zip hatena-mute-source;
rm -rf hatena-mute-source;
cd "$pwd";
