#!/usr/bin/env zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT/.quickstart-logs"
mkdir -p "$LOG_DIR"

start_service() {
  local name="$1"; shift
  local dir="$1"; shift
  echo "-> Starting $name ..."
  (cd "$dir" && "$@" >"$LOG_DIR/$name.log" 2>&1 & echo $! >"$LOG_DIR/$name.pid")
  local pid=$(cat "$LOG_DIR/$name.pid")
  echo "   $name pid=$pid (log: $LOG_DIR/$name.log)"
}

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not found in PATH" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not found in PATH" >&2
  exit 1
fi

echo "Launching Postgres with docker compose..."
docker compose -f "$ROOT/infra/docker-compose.yml" up -d

start_service "api" "$ROOT/services/api" npm run dev
start_service "admin" "$ROOT/apps/admin_web" npm run dev -- --host --port 5173
start_service "mobile" "$ROOT/apps/mobile_ionic" npm start -- --host=localhost --port=4200

echo "All services started. Useful URLs:" 
echo "- API:     http://localhost:4000" 
echo "- Admin:   http://localhost:5173" 
echo "- Mobile:  http://localhost:4200" 
echo "Logs in $LOG_DIR. Stop a service with 'kill \$(cat $LOG_DIR/<name>.pid)'."
