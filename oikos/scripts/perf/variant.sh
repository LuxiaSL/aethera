#!/usr/bin/env bash
# variant.sh NAME [file ...] — build oikos as of $BASE_REV (default dc7b53b,
# this branch's base) with the given working-tree files (paths relative to
# oikos/) laid over it, into $OUT/bundles/NAME/oikos.js. With no files it is
# the baseline. NAME=all builds the working tree as it stands.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
WT=$(cd "$HERE/../../.." && pwd)
OUT=${OUT:-$HERE/out}
BASE_REV=${BASE_REV:-dc7b53b}
name=$1; shift
if [ "$name" = all ]; then
  cd "$WT/oikos" && npx tsc --noEmit -p . && npx vite build --outDir "$OUT/bundles/all" --emptyOutDir 2>&1 | grep -E "oikos.js|error|built"
  exit
fi
dir=$OUT/variants/$name
rm -rf "$dir" && mkdir -p "$dir"
git -C "$WT" archive "$BASE_REV" oikos afterlife | tar -x -C "$dir"
ln -s "$WT/oikos/node_modules" "$dir/oikos/node_modules"
for f in "$@"; do cp "$WT/oikos/$f" "$dir/oikos/$f"; done
cd "$dir/oikos" && npx tsc --noEmit -p . && npx vite build --outDir "$OUT/bundles/$name" --emptyOutDir 2>&1 | grep -E "oikos.js|error|built"
