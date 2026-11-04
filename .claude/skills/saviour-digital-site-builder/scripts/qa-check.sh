#!/usr/bin/env bash
# Saviour Digital Solutions: QA check for the static site.
# Usage:  bash scripts/qa-check.sh [project-root]
# Exit code 0 = no failures (warnings allowed). Exit code 1 = at least one failure.

ROOT="${1:-.}"
export LC_ALL=C.UTF-8

FAILS=0
WARNS=0

EXCLUDES=(--exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=docs --exclude-dir=.git --exclude-dir=scripts)

fail() { echo "FAIL: $1"; FAILS=$((FAILS+1)); }
warn() { echo "WARN: $1"; WARNS=$((WARNS+1)); }

# run_grep <level> <label> <grep-args...>   (level = fail|warn)
run_grep() {
  local level="$1" label="$2"; shift 2
  local out
  out=$(grep -rnE "${EXCLUDES[@]}" "$@" "$ROOT" 2>/dev/null)
  if [ -n "$out" ]; then
    "$level" "$label"
    echo "$out" | head -n 15 | sed 's/^/      /'
    local n; n=$(echo "$out" | wc -l)
    [ "$n" -gt 15 ] && echo "      ... and $((n-15)) more"
  fi
}

echo "Saviour QA check on: $ROOT"
echo

# 1. Dead or empty links
run_grep fail 'Dead links (href="#", href="", javascript:)' \
  --include='*.html' -e 'href="#"' -e "href='#'" -e 'href=""' -e "href=''" -e 'href="javascript:'

# 2. Emoji used anywhere in site files
out=$(grep -rnP "${EXCLUDES[@]}" --include='*.html' --include='*.css' --include='*.js' --include='*.json' --include='*.svg' \
  '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B50}\x{2705}\x{274C}\x{2728}]' "$ROOT" 2>/dev/null)
if [ -n "$out" ]; then
  fail "Emoji or pictograph characters found (use SVG icons)"
  echo "$out" | head -n 15 | sed 's/^/      /'
fi

# 3. Banned words and lorem ipsum in copy (HTML and JSON only)
run_grep fail 'Banned words or lorem ipsum in copy' \
  --include='*.html' --include='*.json' -iw \
  -e 'delve' -e 'tapestry' -e 'realm' -e 'beacon' -e 'game-changer' -e 'game changing' \
  -e 'unlock' -e 'elevate' -e 'seamless' -e 'seamlessly' -e 'leverage' -e 'empower' -e 'empowering' \
  -e 'cutting-edge' -e 'revolutionize' -e 'revolutionise' -e 'supercharge' -e 'synergy' -e 'unleash'
run_grep fail 'Banned phrases or lorem ipsum' \
  --include='*.html' --include='*.json' -i \
  -e "fast-paced digital world" -e "next level" -e "transform your business" -e 'lorem ipsum'

# 4. Leftover placeholders
run_grep fail 'Leftover placeholders ([TBC], [DRAFT-EDIT], TODO, FIXME, XXXX, example.com)' \
  --include='*.html' --include='*.js' --include='*.css' --include='*.json' \
  -e '\[TBC' -e '\[DRAFT' -e 'TODO' -e 'FIXME' -e '265XXXX' -e 'example\.com' -e 'your-email@'

# 5. Images without alt (multi-line aware)
if command -v perl >/dev/null 2>&1; then
  while IFS= read -r f; do
    hits=$(perl -0777 -ne 'while (/<img\b(?![^>]*\balt=)[^>]*>/gis) { $s=$&; $s =~ s/\s+/ /g; print substr($s,0,100)."\n" }' "$f")
    if [ -n "$hits" ]; then
      fail "<img> without alt in $f"
      echo "$hits" | head -n 5 | sed 's/^/      /'
    fi
  done < <(find "$ROOT" -type f -name '*.html' 2>/dev/null \
            | grep -vE '/(vendor|node_modules|docs|\.git|scripts)/')
fi

# 6. External CDN or font links (self-host rule)
run_grep fail 'External CDN/font link found (self-host everything)' \
  --include='*.html' --include='*.css' \
  -e 'cdnjs\.cloudflare\.com' -e 'cdn\.jsdelivr\.net' -e 'unpkg\.com' \
  -e 'fonts\.googleapis\.com' -e 'fonts\.gstatic\.com' -e 'use\.typekit' -e 'api\.fontshare\.com'

# 7. console.log left in JS
run_grep warn 'console.log left in JavaScript' --include='*.js' -e 'console\.log'

# 8. Dependency direction: core must not import desktop or mobile
if [ -d "$ROOT/js/core" ]; then
  out=$(grep -rnE "(from|import)\s*\(?\s*['\"][^'\"]*(desktop|mobile)/" "$ROOT/js/core" 2>/dev/null)
  if [ -n "$out" ]; then
    fail "js/core imports from desktop/ or mobile/ (dependencies must point one way)"
    echo "$out" | head -n 10 | sed 's/^/      /'
  fi
fi

# 9. Hard-coded hex colours outside tokens.css (warn)
out=$(grep -rnE "${EXCLUDES[@]}" --include='*.css' --include='*.js' '#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b' "$ROOT" 2>/dev/null | grep -v 'tokens\.css')
if [ -n "$out" ]; then
  warn "Hard-coded hex colours outside tokens.css (use tokens)"
  echo "$out" | head -n 10 | sed 's/^/      /'
fi

# 10. Orange used as text colour (warn; must be --orange-deep on light backgrounds)
run_grep warn 'Orange used as text colour (use --orange-deep on light backgrounds; ok only on charcoal)' \
  --include='*.css' -e '(^|[^-])color:\s*var\(--orange\)'

# 11. href="#something" anchors pointing at IDs that don't exist in index.html
if [ -f "$ROOT/index.html" ]; then
  while IFS= read -r a; do
    id="${a#\#}"
    if ! grep -qE "id=[\"']${id}[\"']" "$ROOT/index.html"; then
      fail "Anchor $a has no matching id in index.html"
    fi
  done < <(grep -oE 'href="#[A-Za-z0-9_-]+"' "$ROOT/index.html" | sed -E 's/href="(#[^"]+)"/\1/' | sort -u)

  # 12. lang and viewport
  grep -qiE '<html[^>]*\blang=' "$ROOT/index.html" || fail 'index.html: <html> has no lang attribute'
  grep -qiE 'name=["'"'"']viewport["'"'"']' "$ROOT/index.html" || fail 'index.html: missing viewport meta'
  # The title may be wrapped over several lines by Prettier, so read the whole file.
  perl -0777 -ne 'exit(/<title>\s*\S[^<]*<\/title>/i ? 0 : 1)' "$ROOT/index.html" || fail 'index.html: missing or empty <title>'
  grep -qiE 'name=["'"'"']description["'"'"']' "$ROOT/index.html" || warn 'index.html: missing meta description'
fi

echo
echo "Result: $FAILS failure(s), $WARNS warning(s)."
[ "$FAILS" -eq 0 ] && exit 0 || exit 1
