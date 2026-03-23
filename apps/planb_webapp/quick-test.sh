#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

npm run build
npm run check

echo "Plan B webapp build OK: $ROOT_DIR/dist"
