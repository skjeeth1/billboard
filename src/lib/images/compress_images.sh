#!/usr/bin/env bash

# Usage:
# ./compress_images.sh /path/to/images

DIR="${1:-.}"

if [ ! -d "$DIR" ]; then
    echo "Directory does not exist: $DIR"
    exit 1
fi

cd "$DIR" || exit 1

shopt -s nullglob nocaseglob

for f in *.{jpg,jpeg,png,heic,webp}; do
    [ -f "$f" ] || continue

    base="${f%.*}"

    new=$(echo "$base" |
        tr '[:upper:]' '[:lower:]' |
        sed -E '
            s/[[:space:]]+/_/g;
            s/_+/_/g;
            s/\.+/_/g;
            s/[^a-z0-9_]//g;
            s/^_+//;
            s/_+$//
        ')

    out="${new}.webp"

    # Avoid overwriting existing files
    if [ -f "$out" ]; then
        echo "Skipping existing: $out"
        continue
    fi

    echo "Converting: $f -> $out"

    ffmpeg -hide_banner -loglevel error \
        -i "$f" \
        -vf "scale='min(1200,iw)':-2" \
        -c:v libwebp \
        -q:v 70 \
        -compression_level 6 \
        -y "$out"

    if [ $? -eq 0 ]; then
        rm "$f"
        echo "Removed original: $f"
    else
        echo "Failed: $f"
    fi

done

echo "Done."
