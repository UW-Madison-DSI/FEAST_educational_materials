# CLAUDE.md

Guidance for AI agents and contributors working in the FEAST backend repository.

## What This Project Is

FEAST-backend is the Python backend for the Food Access and Strategy Simulation (FASS) tool. It runs an agent-based model (ABM) where synthetic households and food stores are placed on a geographic map. Each simulation step recalculates how well households can access food (their MFAI score), based on distance to stores, income, vehicle ownership, and transit times. A separate React frontend consumes this backend's API.

The backend used to be called `Food-Access-Model`; old names still appear in some code and docs.

Funded by the NSF AI institute ICICLE (OAC 2112606).

## Tech Stack

- **Python 3.11.11** (pinned in `pyproject.toml` / `.python-version`)
- **FastAPI** with async endpoints
- **mesa-geo** for agent-based modeling (geospatial agents)
- **asyncpg / PostgreSQL** for simulation state storage
- **osmnx / shapely / pyproj / geopandas** for geospatial data and coordinate transforms
- **gunicorn + uvicorn workers** in production
- **uv** for dependency management (`pyproject.toml` + `uv.lock`)

## Key Entry Points

Do not duplicate the project's directory structure here. The filesystem is the source of truth; run `ls` or `find` to explore. Instead, document what is *not obvious from the file names alone*:

- **App entry point:** `food_access_model/main.py` creates the FastAPI app. Use `run_local.py` to start it locally. Do not use `api_server.py` or `server.py` (both are legacy).
- **All API logic:** `food_access_model/api/routes.py` (~880 lines). Every endpoint, plus DB query helpers.
- **Simulation core:** `food_access_model/abm/household.py` (the step function, MFAI scoring, distance calculations).
- **Parallelization:** `food_access_model/model_multi_processing/batch_running.py` (modified mesa-geo batch runner, default 25 processes).
- **Preprocessing:** `food_access_model/preprocessing/get_data.py` seeds the database from Census + OSM. Not called at runtime.
- **Dependencies:** `pyproject.toml` + `uv.lock` are authoritative. `requirements.txt` is stale and incomplete.

## Running Locally

```sh
uv sync                   # install deps (first time)
uv run run_local.py       # serves on http://127.0.0.1:8000
```

Requires a `.env` with: `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`.
`API_KEY` (Census) is only needed for regenerating data via preprocessing.

## Architecture

### Entry Point and Request Flow

`food_access_model/main.py` creates the FastAPI app, loads `.env`, configures CORS, and mounts the router from `food_access_model/api/routes.py`. All API logic lives in `routes.py`.

The canonical app entry point is `food_access_model.main:app`. The root-level `api_server.py` and `server.py` are dead legacy files.

### Simulation State Model

The simulation is **stateless per request**. There is no persistent in-memory model. Each call to `POST /api/simulation-instances/{id}/advance`:

1. Reads current households + stores from Postgres for the given step
2. Runs the ABM via `batch_run()` (multiprocessing, default 25 processes)
3. Writes updated household scores back to Postgres as the next step

Every simulation step is fully reproducible from the database alone.

### Data Flow: One Simulation Step

```
POST /api/simulation-instances/{id}/advance
    -> _run_model_step()                              [routes.py]
        -> query_households() + query_food_stores()   [routes.py]
            [read from Postgres at current step]
        -> batch_run_model()                          [routes.py]
            -> batch_run()                            [batch_running.py]
                -> create_household_chunks()
                    splits households into 25 equal chunks
                -> _model_run_func() x 25
                    -> GeoModel.__init__()            [geo_model.py]
                    -> GeoModel.step()
                        -> Household.step()           [household.py]
                            -> calculate_distances()
                            -> get_closest_cspm/spm()
                            -> stores_with_1_miles()
                            -> get_mfai()
                -> create_household_records()
                    reassemble all household results
        -> return_step_results_to_database()          [routes.py]
            [bulk COPY into Postgres at step + 1]
```

Stores are never mutated by the model. Only household MFAI scores change each step.

### API Surface

Router is prefixed `/api`. Key endpoints:
- `GET/POST/DELETE /simulation-instances` - manage simulation instances
- `POST /simulation-instances/{id}/advance` and `/reset` - step/reset
- `GET /households`, `GET /stores`, `POST /stores`, `DELETE /stores`
- `GET /health`

The `pool` in `routes.py` is a module-global asyncpg pool set on startup. Many helpers depend on it being initialized.

### Geometry Conventions

- Store and deliver everything in **EPSG:4326** (lat/lon)
- Use **EPSG:3857** only for internal distance calculations
- Distances are computed in meters, converted to miles (`/ 1609.34`)
- Keep CRS consistent across tables

### Preprocessing (One-Time DB Seeding)

`food_access_model/preprocessing/get_data.py` populates the database from scratch. It is NOT called during normal server operation. Currently hardcoded to **Franklin County, Ohio** (`FIPSCODE = "39049"`).

## Deployment Configuration: Three Independent Layers

Mixing environments is dangerous. Always verify which environment each layer targets:

1. **Frontend -> Backend**: `VITE_API_BASE_URL` in the frontend's `.env.<mode>` file
2. **Backend -> Database**: `.env` in this repo (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`)
3. **Backend -> Frontend (CORS)**: `allow_origins` list in `food_access_model/main.py`

## Core Engineering Principles

Two non-negotiable rules:
1. **"You must be able to explain every line in your PR without looking at your chat history."** If you cannot explain it, you vibe-coded it.
2. **"Write code for future you."** Code must be readable six months later by someone with no context.

Prefer the simplest version that solves the problem. Flag (do not introduce) unnecessary abstractions.

## Agentic Workflow Rules

- **Spec -> Plan -> Execute -> Verify.** Do not implement without a spec and plan reviewed by the human first.
- **One phase at a time.** Each phase must leave the codebase in a working, testable state.
- **Show diffs after each phase** and wait for review before moving on.
- **Stay in scope.** Do not modify files beyond the plan or introduce unsolicited improvements.
- **Verify after every phase**, not at the end.

## Git Workflow

- **Branches**: `main` (stable) -> `staging` (pre-prod) -> `dev` (integration) -> feature branches
- **Branch from `dev`**, not main
- **Branch names**: `feature/issue-NUMBER-short-desc`
- **Commits**: imperative mood, reference issue numbers, one logical change per commit
- **PRs**: target under ~200 lines (non-test), `Closes #N` in description, use the PR template
- **Issue labels**: `area:frontend-state`, `area:frontend-consistency`, `area:backend-entry-points`, `area:database-access`, `area:simulation-core`, `area:data-pipeline`, `area:testing`

## Review Pipeline (three layers, all required)

1. **Automated CI** - GitHub Actions runs flake8 on every PR; must pass before merge
2. **Human peer review** - one substantive comment minimum (not just "LGTM")
3. **LLM adversarial review** - a different student runs a fresh LLM session on the diff and posts findings as PR comments marked `Valid` or `False positive (because...)`

## Code Standards

### Python
- **Type hints** on all functions (params + return). Modern syntax: `list[dict]` not `List[Dict]`, `str | None` not `Optional[str]`
- **Docstrings**: one-liner only when the function name is not self-explanatory
- **Linting**: flake8, ignore E501 (line length), max-complexity 10
- **Database access**: standardize on **asyncpg** (async). Do not add new psycopg2 code paths in the FastAPI layer
- **Entry point**: use `food_access_model/main.py` via `run_local.py`. Do not use the older `api_server.py`

### Logging (never use print())
- `logging.info` - service start/stop, simulation step completed, instance changes
- `logging.debug` - query details, timing, intermediate values
- `logging.error` - exceptions, failed operations
- Never log secrets (passwords, API keys, full SQL with user data)

### Testing
- Use **pytest** + **pytest-asyncio**
- Write tests for current behavior BEFORE refactoring
- Test pure functions first (`has_resources`, `get_mfai`, `get_monthly_trip_count`)
- Test exact boundary values for thresholds

## Dead Code

These files exist in the repo but are not part of the active application:

| File | Why it is dead |
|------|----------------|
| `api_server.py` | Old standalone FastAPI app, superseded by `food_access_model/main.py` |
| `server.py` | Mesa browser visualization prototype, pre-FastAPI era |
| `agent_visualization.py` | Only used by `server.py` |
| `parallel_scheduler.py` / `parallel_process_scheduler.py` | Replaced by `model_multi_processing/batch_running.py` |
| `food_access_model/repository/db_repository.py` | Old singleton approach; unused in current call path |
| `constants.py` | File-path constants from pre-database era |
| `run_sm_sbatch` | Points at dead `api_server:app` |
| `requirements.txt` | Incomplete; `pyproject.toml` is authoritative |

## Project Artifacts

- **CLAUDE.md** (this file) - dual audience: humans and agents. Update as conventions evolve.
- **ROADMAP.md** - living document; update after each milestone
- **ADRs** - for any decision between approaches, record what was decided, why, and alternatives. ADRs live in `docs/decisions/`

## Notes for AI Agents

- The tool's output is a **first draft, not a final answer**. Verify and refine.
- Explain unfamiliar code and brainstorm edge cases, but contributors write the code themselves.
- Show diffs and wait for explicit approval before every commit and push. Never commit autonomously.
- Work only on feature branches, never directly on `dev`/`staging`/`main`.
- Stay strictly in scope. Flag related improvements as separate issues instead of folding them into the current change.
- Do not assume pytest or flake8 are wired up. Check before relying on them.
