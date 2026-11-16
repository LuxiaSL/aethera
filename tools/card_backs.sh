#!/usr/bin/env bash
# card_backs.sh — the backgrounds for posts' link cards (aethera/utils/cards.py).
#
# Six frames of the site's background video (power lines against a noisy sky),
# each cropped to 1200×630 low enough to keep the dark ground the title sits
# on. A post's card uses one of them, picked by its slug. Run once by hand
# (needs ffmpeg); the JPEGs are committed, so the server never needs ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."
src=aethera/static/uploads/background.mp4
out=aethera/static/cards
mkdir -p "$out"
i=0
for t in 0.2 0.85 1.5 2.15 3.45 4.75; do
  ffmpeg -v error -y -ss "$t" -i "$src" -frames:v 1 \
    -vf "scale=1200:-1:flags=lanczos,crop=1200:630:0:(ih-630)*0.85" \
    -q:v 3 "$out/back-$i.jpg"
  i=$((i + 1))
done
ls -la "$out"
