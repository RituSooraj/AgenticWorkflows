# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Run all tests: `npm test` (uses Node's built-in `node:test` runner)
- Run a single test file: `node --test tests/convert.test.js`
- Run the CLI directly: `node src/cli.js convert 100 USD EUR` or `node src/cli.js rates`
- Run the MCP server: `npm run mcp`

There is no build or lint step — plain CommonJS, no TypeScript/bundler/linter configured.

## Architecture

Two independent entry points share the same conversion core:

- `src/rates.js` — reads `data/rates.json` synchronously. This is the single source of local (static, stale) exchange rate data; everything else depends on it.
- `src/convert.js` — pure conversion logic. Converts any `from → to` pair by pivoting through USD (`amount / fromRate * toRate`), rounds to 2 decimals, uppercases currency codes for lookup, throws on unsupported codes. This is the unit tested surface (`tests/convert.test.js`).
- `src/cli.js` — Commander-based CLI (`currency convert`, `currency rates`) that wires the two above together for terminal use.
- `mcp-server/index.js` — a separate, parallel entry point exposing a `get_exchange_rate` MCP tool over stdio. It does **not** reuse `src/convert.js` or `src/rates.js` — it's meant to fetch live rates from the Frankfurter API (`https://api.frankfurter.dev/v1/latest?base=...&symbols=...`) instead of the local JSON file, so the two data paths (local/stale vs. MCP/live) are intentionally kept separate. `reference/mcp-server-solution.js` is the completed version of this file.

## Repo context

This is the working repo for a Claude Code workshop (see `CURRICULUM.md` for the full session plan). Notable consequences for anyone working in this repo:

- `data/rates.json` has `asOf: 2024-01-01` — this staleness is intentional (it's the motivating example for building the MCP server), not a bug to fix.
- `mcp-server/index.js` is deliberately left as a skeleton with a TODO/`throw` in the tool handler — don't "complete" it from `reference/mcp-server-solution.js` unless asked; that file is an answer key.
- A `feature/batch-convert` branch (if present) contains an intentionally planted bug in a `currency batch` command, used to demo `/code-review` and `/review`. Don't silently fix bugs on that branch without flagging that they may be intentional.
