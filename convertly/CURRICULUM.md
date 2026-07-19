# Claude Code Workshop — 4 Hour Hands-On Curriculum

**Project:** `currency-cli` — a tiny CLI that converts amounts between
currencies using local exchange-rate data, plus a companion MCP server that
upgrades it to live rates.

**Format:** hands-on — every attendee clones the repo and codes along.

**Prereqs (send before class):**
- Node.js 18+ installed
- Claude Code CLI installed and authenticated
- A GitHub account (for the `/review` segment) and `gh` CLI authenticated
- Clone this repo, run `npm install`, confirm `npm test` passes

---

## Hour 1 — Orientation, `/init`, and reading a codebase

**Goal:** get comfortable with the CLI and have Claude document a codebase
it's never seen.

1. Intro: what Claude Code is, chat vs. agent loop, how tool calls work
2. Permission modes overview: plan mode, default (ask-first), auto-accept —
   show the difference on a trivial edit
3. Tour the repo by hand (`src/`, `data/`, `tests/`, `mcp-server/`) — note
   there's no `CLAUDE.md` yet
4. Run **`/init`** on the repo
   - Discuss what it picked up on (structure, test command, entry points)
   - Edit the generated CLAUDE.md together — add anything it missed
5. Exercise: ask Claude "how does `convert` handle an unsupported currency?"
   and "what would break if `data/rates.json` were empty?" — plain Q&A,
   no code changes, to build trust in how it reads code

**Checkpoint:** everyone has a `CLAUDE.md` at repo root and can explain what
`/init` does and doesn't capture.

---

## Hour 2 — Editing, permissions, and `/code-review` / `/review`

**Goal:** make a real change, understand permission prompts and settings,
then practice catching bugs — first locally, then on a real GitHub PR.

1. **Live feature**: ask Claude to add a `--precision <n>` flag to
   `currency convert` (small, safe, gives everyone a real diff to look at)
2. **Permissions deep dive**
   - Trigger a permission prompt (e.g. ask Claude to run `npm test`) and
     look at the prompt UI
   - Open `.claude/settings.json` — already seeded with an allow-list for
     `npm test` / `npm run *` — discuss project vs. user (`~/.claude/`)
     settings precedence
   - Add a rule together (e.g. explicitly deny `Bash(rm *)`, or allow a new
     command) and re-trigger to see the effect
   - Mention the `fewer-permission-prompts` skill for scanning transcripts
     and auto-suggesting an allowlist
3. **Bug hunt, part 1 — local diff**
   - Checkout the pre-planted branch: `git checkout feature/batch-convert`
   - This branch adds a `currency batch <amount> <from> <to...>` command
     with a real, planted bug (a copy-paste division-vs-multiplication
     error) and a test that was written *against the buggy output*
   - Run **`/code-review`** on the diff — discuss what it flags and why
     the existing test didn't catch it
4. **Bug hunt, part 2 — real PR**
   - Push the branch, open a PR against `main` with `gh pr create`
   - Run **`/review <PR#>`** against the real GitHub PR
   - Compare: what `/review` (GitHub PR-aware) surfaces vs. `/code-review`
     (local working diff) — same underlying bug, different entry points
   - Fix the bug together, push the fix, re-review

**Checkpoint:** attendees understand permission prompts + settings scoping,
and have used both review commands on the same bug.

---

## Hour 3 — MCP: connecting Claude to a live data source

**Goal:** understand what MCP is and why it matters, then build a minimal
MCP server live and connect it.

1. **Concept**: what MCP is (a protocol for exposing tools/resources to any
   MCP-aware client, not just Claude Code), server vs. client, transports
   (stdio for local, HTTP/SSE for remote)
2. **The motivating problem**: `data/rates.json` is hardcoded and stale
   (`asOf: 2024-01-01`) — ask Claude to convert USD to EUR and note the
   rate is almost certainly wrong today
3. **Live build**: open `mcp-server/index.js` (a skeleton with TODOs) and
   implement `get_exchange_rate` together, backed by the free
   [Frankfurter API](https://frankfurter.dev) (no API key needed):
   - `GET https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR`
   - Instructor has the finished version in `reference/mcp-server-solution.js`
     as an answer key if the room gets stuck
4. **Connect it**: `claude mcp add currency-mcp -- node mcp-server/index.js`
   - Show `claude mcp list`, scopes (user/project/local), and why you
     should only add servers you trust (it's arbitrary code with tool
     access)
5. Ask Claude "what's the live USD to EUR rate, and how does that compare
   to what our local `convert` command gives?" — it should now reach for
   the MCP tool instead of (or alongside) the local file

**Checkpoint:** attendees have a working local MCP server connected to
Claude Code returning live data, and understand server scopes/trust.

---

## Hour 4 — `/loop`, settings recap, and wrap-up

**Goal:** automate a recurring task, tie settings together, leave room for
questions and a stretch exercise.

1. **`/loop` demo**: `/loop 5m "get the live USD to EUR rate via MCP and
   flag it if it's moved more than 1% since the last check"`
   - Discuss fixed-interval vs. self-paced (dynamic) looping
   - Show how to stop a loop
2. **Settings recap**: walk `.claude/settings.json` end to end —
   permissions, hooks, model selection, env vars; project settings vs.
   `~/.claude/settings.json` vs. `.claude/settings.local.json` (not
   committed, personal overrides)
3. **Hook mini-demo**: add a `PostToolUse` hook that runs `npm test` after
   every `Edit` to `src/**`, show it firing
4. **Bonus, time permitting**: skills (`~/.claude/skills/`) and subagents —
   just enough to know they exist and when to reach for them
5. **Stretch exercise** (pick one):
   - Add a second MCP tool, e.g. `convert_live(amount, from, to)`
   - Add a `Bash` allow-rule that's scoped narrowly (e.g. only
     `Bash(node src/cli.js *)`) and explain why narrow is better than
     broad
   - Write a project-level `CLAUDE.md` section documenting the MCP server
6. Q&A / open floor

**Checkpoint:** attendees can explain every section of a `settings.json`,
have run a loop against live data, and know where to go next.

---

## Repo map (for reference during class)

```
currency-cli/
├── CURRICULUM.md              # this file
├── .claude/settings.json      # seeded permissions, extended live in Hour 2/4
├── data/rates.json            # intentionally stale local rates
├── src/
│   ├── rates.js                # loads data/rates.json
│   ├── convert.js               # core conversion logic (clean on main)
│   └── cli.js                   # commander CLI: convert, rates
├── tests/convert.test.js       # node:test suite, passes on main
├── mcp-server/index.js         # MCP server skeleton — built live, Hour 3
└── reference/mcp-server-solution.js  # instructor answer key, don't show early

Branch: feature/batch-convert   # planted bug for Hour 2 review demo
```

## Setup checklist before the session

- [ ] `git remote add origin <your-repo-url>` and `git push -u origin main`
- [ ] `git push origin feature/batch-convert`
- [ ] Confirm `gh auth status` works so `gh pr create` won't stall live
- [ ] Confirm `npm test` and `node src/cli.js convert 100 USD EUR` both work
      on a clean clone
- [ ] Skim `reference/mcp-server-solution.js` so you can unstick Hour 3
      quickly if needed
