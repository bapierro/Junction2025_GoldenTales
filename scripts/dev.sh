#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
cd "$ROOT_DIR"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

if ! command -v poetry >/dev/null 2>&1; then
  echo "Poetry is required. Install it from https://python-poetry.org/docs/#installation and re-run this script." >&2
  exit 1
fi

(
  cd "$BACKEND_DIR"
  poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &
BACKEND_PID=$!

echo "FastAPI backend running on http://localhost:8000 (PID $BACKEND_PID)"

echo "Starting Vite dev server..."
npm run dev
