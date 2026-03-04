# Sudoku (React Frontend)

A simple, minimal Sudoku web app. It generates a new puzzle, lets you fill in numbers, check correctness, and reset the puzzle.

## Run in preview (local dev)

From the repo workspace:

```bash
cd sudoku-play-323793/sudoku_frontend
npm install
npm start
```

Then open:

- http://localhost:3000

> Note: The preview/dev server typically runs on port **3000** (or the value of `REACT_APP_PORT` if set and supported by the project scripts).

## How to use

- Start a new puzzle (shown on load).
- Click/select a cell and enter a number (keyboard or UI controls, depending on implementation).
- Use **Check** to validate the current entries.
- Use **Reset** to clear user-entered values back to the puzzle’s initial state.

## Environment variables

The frontend reads configuration from `.env` via `REACT_APP_*` variables.

Common variables defined for this container:

- `REACT_APP_API_BASE` — Base path/prefix for API routes (if used).
- `REACT_APP_BACKEND_URL` — Backend base URL (if the UI calls an API service).
- `REACT_APP_FRONTEND_URL` — Public URL of the frontend (useful for redirects/links).
- `REACT_APP_WS_URL` — WebSocket URL (if real-time features are used).
- `REACT_APP_NODE_ENV` — App environment (e.g., `development`, `production`).

Operational / tooling flags:

- `REACT_APP_NEXT_TELEMETRY_DISABLED` — Telemetry toggle (if applicable to the template/tooling).
- `REACT_APP_ENABLE_SOURCE_MAPS` — Enable/disable source maps in builds.
- `REACT_APP_PORT` — Preferred port for the dev server (if supported by scripts).
- `REACT_APP_TRUST_PROXY` — Proxy trust setting (if applicable).
- `REACT_APP_LOG_LEVEL` — Logging verbosity.
- `REACT_APP_HEALTHCHECK_PATH` — Healthcheck path (if served by an app server wrapper).
- `REACT_APP_FEATURE_FLAGS` — Feature flags configuration (format is app-defined).
- `REACT_APP_EXPERIMENTS_ENABLED` — Toggle for experimental features.

If you change `.env`, restart the dev server to ensure changes are picked up.
