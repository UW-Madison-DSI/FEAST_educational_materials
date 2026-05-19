---
layout: default
title: "Week 1 Assignment"
---

# Week 1 Assignment

**Due before:** Week 2 session
**Team:** Senior developers
**Tools:** Claude Code (when accounts are active). You can start the endpoint traces and exploration without it.
**Time estimate:** ~8-12 hours total. This is a best estimate and hasn't been tested yet. Please track your time so we can calibrate for future cohorts.
**Questions?** Email `[INSTRUCTOR-EMAIL]`.

## What to do

### 1. Use the live app, then think about what it should become (~30 min)

**Part A: Use the app (10 min).** Open https://fassfrontstage.pods.icicleai.tapis.io/ and spend time clicking around:

- [ ] Create a simulation instance
- [ ] Click on households, read the popup data (income, vehicles, food access score)
- [ ] Click "Step" to advance the simulation. Watch household colors change.
- [ ] Add a store near a cluster of red (low-access) households. Step again. Did scores improve?
- [ ] Remove a store. Step. What happens?

Understanding what the tool does is prerequisite to understanding how it works.

**Part B: Note what could be better right now (~10 min).** While the app is fresh in your mind, write down quick-hit observations. Things like:

- What was confusing or unclear in the interface?
- What information did you want that wasn't there?
- What felt slow, broken, or surprising?
- If you were handing this to a city planner today, what would embarrass you?

These don't need to be technical yet. "I had no idea what the colors meant until I clicked a household" is a valid observation. You'll connect these to specific code later.

**Part C: Think about future directions (~10 min).** Step back from the current state. If this tool were fully realized, what could it do?

- What kinds of questions should the interface help someone answer that it currently can't?
- What would make this useful for a different city or county, not just Brown County?
- What additional data or visualizations would make the simulation results more actionable?
- Are there entirely new features (comparison views, reporting, scenario saving, different agent types) that would change who uses this and how?

Jot down 3-5 ideas. They don't need to be scoped or feasible yet. The point is to form your own opinion about the product direction before you dive into the code. You'll use these observations as starting material for your Vision Plan (step 5).

### 2. Trace one endpoint through the full stack

Pick one of these endpoints (coordinate with teammates so each person takes a different one). Read through the code and write a 3-5 paragraph description of how the request flows from the frontend through the backend to the database and back.

| Endpoint | Key files | What to focus on |
|----------|-----------|-----------------|
| `POST /simulation-instances/{id}/advance` | `routes.py:155` -> `_run_model_step` -> `batch_running.py:batch_run` -> `GeoModel.step()` -> `Household.step()` | The core simulation loop. How does a "step" work? Why multiprocessing? |
| `POST /simulation-instances` (create) | `routes.py:191` -> copies households/stores from default_simulation -> `_run_model_step` | What happens when you create a new simulation? What is the default_simulation and why can't it be deleted? |
| `POST /stores` (add store) | `routes.py:308` -> `helpers.py:29 convert_centroid_to_polygon` -> polygon geometry -> SQL insert | How does a lat/lon become a polygon? Why hexagons for supermarkets and triangles for convenience stores? |
| `GET /households` | `routes.py:273` -> query with simulation_instance + step params -> WKT geometry | How is household data structured? What do the column names mean? What is WKT? |
| `GET /simulation-instances` | `routes.py:98` -> SQL query -> ORJSONResponse | Simplest endpoint. How does a request become a database query become a JSON response? |

**Start without Claude Code:** Trace by reading the code directly. Start at the route handler in `routes.py`, follow the function calls, note what goes to the database and what comes back. Form your own understanding first.

**Then try with Claude Code:** Ask it to explain the same functions you just read. Compare its explanations to what you figured out on your own. Where did it add something you missed? Where was it wrong or vague? Verify everything against the actual code.

Write your trace as a markdown file. Put it in `docs/traces/` in the FEAST backend repo.

- [ ] Endpoint trace written (your own words, not LLM output)

### 3. Explore the codebase

Now that you've traced one endpoint, explore the parts you didn't cover. Keep notes on what seems wrong, confusing, or inconsistent. You will use these notes for your Vision Plan (step 5).

Focus areas for senior devs:
- `food_access_model/abm/household.py`: read `get_mfai()` (line 218), `has_resources()` (line 169), and `step()` (line 259). What do the magic numbers mean (95, 55, 0.8, 10000/15000/25000)?
- `preprocessing/get_data.py`: How does Census data become synthetic households? (1134 lines; focus on the main functions, not every line.)
- `model_multi_processing/batch_running.py`: How are simulation steps parallelized?
- The frontend (`fass-react/src/`): Why does the code store things on the `window` object? What's going on with MapComponent.js (526 lines of raw DOM manipulation)?

- [ ] Explored at least 2-3 areas beyond your traced endpoint

### 4. Create a project context file

Using the template at `FEAST_edu/templates/CLAUDE.md`, create a `CLAUDE.md` in the root of the FEAST backend repo. Customize it based on what you learned from the architecture overview and your exploration. Keep it under 50 lines. This file tells your agent how to work in the repo.

The template includes Team Priorities and Issue Organization sections. Leave those as placeholders for now; you'll fill them in during the Week 2 Plan Comparison Activity.

- [ ] CLAUDE.md created in FEAST backend repo root

### 5. Vision and Improvement Plan

What should an improved version of FEAST look like? Not a redesign from scratch, but the same application built the way a professional team would build it today. Then work backwards: what are the biggest gaps, and in what order should a team close them?

Start from the observations you collected in steps 1B, 1C, and 3. Copy `FEAST_edu/templates/vision-plan-template.md` into your FEAST repo (e.g., `docs/vision-plan-yourname.md`). Pick at least 3 investigation areas:

| Area | What to look at | Key files |
|------|-----------------|-----------|
| Frontend state management | `window` object usage vs React Context. Why is this an anti-pattern? | App.jsx, StoreContext.jsx, MapComponent.js |
| Frontend consistency | Mixed Bootstrap + Tailwind, hardcoded API URL, error handling gaps | App.jsx, client.js, component .jsx files |
| Backend entry points | Three ways to start the backend, different CORS settings each. Which is correct? | run_local.py, main.py, api_server.py, server.py |
| Database access patterns | psycopg2 vs asyncpg: two libraries, sync vs async, same database | routes.py, repository/db_repository.py |
| Simulation core | Magic numbers, duplicated constants, MFAI scoring logic | household.py (L169, L218, L259), constants.py |
| Data pipeline / geographic scope | What is hardcoded to Brown County? CRS inconsistency (4326 vs 3857) | preprocessing/get_data.py, constants.py |
| Testing and reliability | No tests exist. Which functions are testable? What makes others hard? | tests/ (absent), household.py pure functions |

> **Agent rule:** Use Claude to explain code and identify patterns. The vision and prioritization must be your own thinking. Test: if someone asks why you prioritized X over Y, can you answer from your own reasoning?

For each area: describe the current state (specific files, lines, quotes), what it should look like, why it matters, and estimate the size (small/medium/large). Then sequence your improvements with rationale.

**Time guidance:** The plan should take 1-2 hours to write on top of exploration. Go deep: code quotes, trade-off reasoning, dependency-aware sequencing.

- [ ] Vision plan completed (3+ areas, sequenced)

### 6. File issues

Turn everything you found into GitHub issues. For each issue:
- Clear, specific title
- What you observed (quote the code)
- Where it is (file + line number)
- Why it's a problem
- Two labels: a **type** and an **area**

**Type labels:**

| Label | Use when | Examples |
|-------|----------|---------|
| **bug** | Something is broken or produces wrong results | CORS hardcoded to Tapis URL (breaks local dev). `profiling` module imported in `api_server.py` but doesn't exist. |
| **enhancement** | Something works but should be better | `print()` used instead of `logging` module in multiple files. Magic numbers in `household.py` (95, 55, 0.8, income thresholds) with no constants or docstrings. |
| **refactor** | Code works but is poorly structured | Inconsistent imports (package-relative in one file, shorthand in another). Deprecated `on_event` pattern in `routes.py` (FastAPI moved to lifespan handlers). Raw DOM manipulation in `MapComponent.js` (526 lines, bypasses React). Bootstrap + Tailwind mixed in the same frontend. Python version drift (`pyproject.toml` says 3.11.11, Dockerfile says 3.12). |

These are examples from the codebase, not a checklist. Your issues should come from your own exploration.

**Area labels** (match your investigation areas): `area:frontend-state`, `area:frontend-consistency`, `area:backend-entry-points`, `area:database-access`, `area:simulation-core`, `area:data-pipeline`, `area:testing`

After filing, go back to your vision plan and add the issue links in the "Connections to Issues" section.

- [ ] At least 3 issues filed with type + area labels
- [ ] Issues linked back to vision plan

### 7. Stretch: find it, file it, fix it

If you found something small enough to fix in 30 minutes (the CORS hardcoding, a print-to-logging conversion), fix it, open a PR, and link it to the issue.

- [ ] (Optional) One small fix PR opened

## Deliverables (before Week 2)

1. **Endpoint trace** -- PR with markdown file in `docs/traces/`
2. **Project context file** -- PR with `CLAUDE.md` in repo root
3. **Vision and Improvement Plan** -- PR from the template, in `docs/`
4. **At least 3 issues filed** -- in the `[COHORT-ORG]` repo with type + area labels
5. (Optional) Small fix PR linked to a filed issue

We will compare vision plans at the start of the Week 2 session.
