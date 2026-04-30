#!/usr/bin/env bash
set -euo pipefail

OUT="public"

rm -rf "$OUT"
mkdir -p "$OUT"

cp index.html "$OUT/"
cp -R menu    "$OUT/menu"
cp -R buffet  "$OUT/buffet"
cp -R images  "$OUT/images"

find "$OUT" -name ".DS_Store" -delete
find "$OUT" -name "Thumbs.db" -delete
[ -f "$OUT/images/111" ] && rm -f "$OUT/images/111" || true

if find "$OUT" -type f -size +24M | grep -q .; then
  echo "ERROR: Found file(s) larger than 24 MiB (Workers per-asset limit is 25 MiB):" >&2
  find "$OUT" -type f -size +24M -exec ls -lh {} \; >&2
  exit 1
fi

echo "Build complete: $(du -sh "$OUT" | cut -f1) in $OUT/ ($(find "$OUT" -type f | wc -l | tr -d ' ') files)"
