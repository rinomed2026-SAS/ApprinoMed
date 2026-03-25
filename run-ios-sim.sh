#!/usr/bin/env zsh
set -euo pipefail

APP_ID="com.rinomed.app"
SIM_DEVICE_NAME=${SIM_DEVICE_NAME:-"iPhone 15"}
START_BACKEND=${START_BACKEND:-"1"}
API_URL=${API_URL:-"http://localhost:4000"}

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
LOG_DIR="$ROOT_DIR/.run-ios-sim-logs"
API_LOG_FILE="$LOG_DIR/api.log"
API_PID_FILE="$LOG_DIR/api.pid"

mkdir -p "$LOG_DIR"

ensure_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
}

is_api_healthy() {
  curl -fsS "$API_URL/health" >/dev/null 2>&1
}

start_backend_stack() {
  echo "Starting local backend stack (Postgres + API)..."

  ensure_command docker
  ensure_command npm
  ensure_command curl

  docker compose -f "$ROOT_DIR/infra/docker-compose.yml" up -d

  if is_api_healthy; then
    echo "API already running at $API_URL"
    return
  fi

  if [[ -f "$API_PID_FILE" ]]; then
    local old_pid
    old_pid=$(cat "$API_PID_FILE" 2>/dev/null || true)
    if [[ -n "${old_pid:-}" ]] && kill -0 "$old_pid" 2>/dev/null; then
      echo "API process already started (pid=$old_pid), waiting for health..."
    else
      rm -f "$API_PID_FILE"
    fi
  fi

  if [[ ! -f "$API_PID_FILE" ]]; then
    (
      cd "$ROOT_DIR/services/api"
      npm run dev >"$API_LOG_FILE" 2>&1 &
      echo $! >"$API_PID_FILE"
    )
    echo "API started in background (pid=$(cat "$API_PID_FILE"), log=$API_LOG_FILE)"
  fi

  local attempts=0
  until is_api_healthy; do
    attempts=$((attempts + 1))
    if (( attempts > 45 )); then
      echo "API did not become healthy at $API_URL/health" >&2
      echo "Last API logs:" >&2
      tail -n 40 "$API_LOG_FILE" >&2 || true
      exit 1
    fi
    sleep 1
  done

  echo "API healthy at $API_URL"
}

if [[ "$START_BACKEND" == "1" ]]; then
  start_backend_stack
fi

# Pick target simulator: prefer SIM_DEVICE_NAME, otherwise first booted, otherwise any iPhone
TARGET_UDID=$(xcrun simctl list devices available | awk -F'[()]' -v name="$SIM_DEVICE_NAME" '/iPhone/ { if ($0 ~ name) {print $2; exit} }') || true
if [[ -z "${TARGET_UDID:-}" ]]; then
  TARGET_UDID=$(xcrun simctl list devices booted | awk -F'[()]' '/Booted/{print $2; exit}') || true
fi
if [[ -z "${TARGET_UDID:-}" ]]; then
  TARGET_UDID=$(xcrun simctl list devices available | awk -F'[()]' '/iPhone/{print $2; exit}') || true
fi
if [[ -z "${TARGET_UDID:-}" ]]; then
  echo "No available iPhone simulators found." >&2
  exit 1
fi

# Bring up Simulator UI
open -a Simulator || true

# Full reset for fresh state (cookies/cache/apps)
xcrun simctl shutdown "$TARGET_UDID" 2>/dev/null || true
xcrun simctl erase "$TARGET_UDID" 2>/dev/null || true
xcrun simctl boot "$TARGET_UDID" 2>/dev/null || true
xcrun simctl uninstall "$TARGET_UDID" "$APP_ID" 2>/dev/null || true

cd "$ROOT_DIR/apps/mobile_ionic"

xcrun simctl boot "$TARGET_UDID" 2>/dev/null || true

# Build production (faster, no source maps) and sync iOS
NODE_OPTIONS="--max-old-space-size=4096" npx ng build --configuration production --progress
npx cap sync ios

xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination id="$TARGET_UDID" -derivedDataPath ios/DerivedDataNoSign CODE_SIGNING_ALLOWED=NO \
&& xcrun simctl install "$TARGET_UDID" ios/DerivedDataNoSign/Build/Products/Debug-iphonesimulator/App.app \
&& xcrun simctl launch "$TARGET_UDID" "$APP_ID"
