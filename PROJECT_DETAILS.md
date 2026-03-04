# Project Details — Sudoku (React Frontend)

## Overview
This repository contains a simple, minimal Sudoku web app built with **React**. The app:
- Generates a new Sudoku puzzle
- Lets users fill in numbers
- Allows checking correctness
- Allows resetting the puzzle back to its initial state

Container/workspace:
- Workspace root: `sudoku-play-323793/`
- Frontend container: `sudoku-play-323793/sudoku_frontend/`

## Key Features
- **Puzzle generation**: A new puzzle is shown on load (and/or via a new game action depending on UI implementation).
- **User input**: Users can select cells and enter digits (keyboard and/or on-screen controls).
- **Check correctness**: Validates user entries against Sudoku constraints/solution logic.
- **Reset puzzle**: Clears user-entered values back to the initial puzzle state.

## UI / UX Notes
- Style: **minimalistic**, light theme
- Layout: **centered Sudoku grid**, with a minimal header and primary actions (e.g., Check, Reset)
- Accents: primary `#3b82f6`, success/accent `#06b6d4`, error `#EF4444`

## Local Development
From the repo workspace:

```bash
cd sudoku-play-323793/sudoku_frontend
npm install
npm start
```

Then open:

- http://localhost:3000

> Note: The dev server typically runs on port **3000** (or the value of `REACT_APP_PORT` if supported by the project scripts).

## Environment Variables
The frontend reads configuration from `.env` using `REACT_APP_*` variables (Create React App convention).

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

## Repository Files
- `README.md` — Quick start and environment variables overview
- `PROJECT_DETAILS.md` — This document (project scope and details)
- `sudoku_frontend/` — React frontend source (UI, game logic, styling)

## Notes / Assumptions
- This project is frontend-focused and does not require a backend to play Sudoku unless optional API or websocket features are added later.
- The exact input method (keyboard-only vs. number pad) depends on the current UI implementation in `sudoku_frontend/`.
