---
layout: default
title: "Content Map"
---

# Content Map: Curriculum to Slides

This file maps sections of `STUDENT_ONBOARDING_PLAN.md` to slide numbers in each week's deck. When you change content in either source, consult this map to identify what else needs updating.

## How to use this map

1. **Editing the curriculum?** Find your section below. Check which slides cover the same material. Update those slides (or flag them for update).
2. **Editing a slide deck?** Find the slide by its screen label. Check which curriculum section it maps to. Make sure the curriculum still matches.
3. **Adding new material?** Add a row to this map when you create the content. Decide which week's slides (if any) should cover it.

## Week 1

**Slide deck:** `slides/week-1/index.html` (47 slides, labels 01-44)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Constraints (L8-16) | -- | Branch names, repo URLs |
| How This Plan Works (L17-31) | 02 How the week works, 03 Weekly rhythm | Session structure, solo work description |
| **Food accessibility** (L44-60) | 05 Section, 06 Four factors, 07 Why it matters, 08 Decisions FEAST answers | Four factors list, USDA stats, example questions |
| **ABM approach** (L62-106) | 10 Section, 11 What is ABM, 12 Two agents, 13 Household step, 14 MFAI formula, 15 MFAI worked example, 16 Mesa | ABM properties, agent types, step logic, MFAI scores (95/55/25), trip counts (7/8/6), income thresholds, has_resources() line ref, Mesa components |
| Use cases and stakeholders (L108-123) | 09 Stakeholders, 18 Origin | Stakeholder list, example scenarios, ICICLE/NSF origin |
| **Architecture** (L125-178) | 19 Section, 20 Three layers, 21 Frontend, 22 Backend, 23 Database, 24 Step lifecycle (condensed) | Three-layer diagram, frontend tech (React 19/Vite/Leaflet), backend tech (FastAPI/Mesa/asyncpg), DB schema, CRS (4326 vs 3857), entry points, step lifecycle (condensed summary), multiprocessing, client.js hardcoded URL, port numbers |
| **Deployment configurations** (new, after architecture) | NEW: slide(s) needed (after slide 24) | Deployment topology diagram (3 environments x 3 layers), configuration matrix table, three configuration levers (client.js, .env, CORS), common configurations, cross-environment safety warning |
| **Project mgmt artifacts** (L179-189) | NEW: slide(s) needed | CLAUDE.md, ROADMAP.md, DECISIONS.md overview; brief on-screen display |
| **Agentic coding tools** (L190-225) | 25 Section (REWORK), NEW: agentic engineering vs vibe coding slide, 25b The one rule, NEW: tool landscape slides, NEW: CLAUDE.md as config slide, NEW: live demo slide, 27 Week 1 rules | Agentic engineering vs. vibe coding distinction, tool landscape (Claude Code, Cursor, Copilot, Aider), CLAUDE.md as agent config, the one rule (explain every line), live demo comparing tools, week 1 LLM restrictions |
| **Setup** (L227-337) | 28 Section, 29 Prerequisites, 30 Setup steps (NOW INCLUDES Claude Code install as Step 3), 31 Working state, 32 Common problems | Prerequisites list, clone/branch/install steps, Claude Code install, run_local.py port 8000, client.js edit, common problems list, live instance URL |
| Assigned work (L293-319) | 33 Section, 34 Use the app, 35 Endpoint traces, 36 Deliverable | Endpoint trace table (5 students), deliverable (PR with trace), live instance URL |
| Solo work (L374-441) | 37 Section, 38 Solo explore, NEW: CLAUDE.md creation slide, 39 Solo file issues, 40 Things you'll find, 41 Stretch | J vs S exploration targets, CLAUDE.md creation in FEAST repo, issue filing expectations (3+), example issues list, stretch goals |
| Roadmap activity (L385-387) | 42 Roadmap kickoff | Review + label + project board |
| -- | 01 Title, 03b Live demo, 04a Act I, 24b Act II, 43 Recap, 44 Q&A | Structural slides, no curriculum counterpart |

### Key shared values (Week 1)

These specific values appear in both the curriculum and slides. If any change, both must be updated:

- **Live frontend URL:** `https://fassfrontstage.pods.icicleai.tapis.io/`
- **MFAI scores:** supermarket=95, convenience=55, pantry=25
- **Trip counts:** resources+vehicle=7, resources+no vehicle=8, no resources=6
- **Income thresholds:** $10k (single), $15k (2-person), $25k (3+ person)
- **Backend port:** 8000 (run_local.py), 8080 (gunicorn)
- **Frontend port:** 5173
- **Repo branches:** `minimum_viable_product` (backend), `Brown-County-Frontend` (frontend)
- **CRS:** households EPSG:4326, stores EPSG:3857
- **Entry points:** run_local.py (correct), api_server.py (legacy), server.py (legacy)
- **has_resources() line ref:** household.py:169
- **get_mfai() line ref:** household.py:218
- **Agentic tools listed:** Claude Code, Cursor, Copilot, Aider
- **Review pipeline layers:** CI checks (Week 2), peer review (Week 2), LLM adversarial review (Week 3)
- **Project mgmt artifacts:** CLAUDE.md, ROADMAP.md, DECISIONS.md
- **Configuration levers:** client.js baseURL (frontend->backend), .env DB_HOST (backend->DB), CORS origins (backend->frontend)
- **Common configurations:** full local, local FE + staging API, full staging, mixed (mistake)
- **Planning tools:** `/plan` (Week 3), `/ultraplan` (Week 4), `/ultrareview` (Week 4)

## Weeks 2-6

Slide decks for these weeks do not exist yet. When created, add mappings here following the Week 1 format.

| Week | Curriculum topics (post-DEC-004/DEC-005 restructuring) | Slide deck | Status |
|---|---|---|---|
| 2 | Review pipeline (CI + peer review), ADR introduction, edge case brainstorming, PR workflow, `/plan` preview, CLAUDE.md review | `slides/week-2/index.html` | Not started |
| 3 | LLM adversarial review rotation (completing 3-layer pipeline), specs before code, `/plan` for feature specs, ADR-format specs | `slides/week-3/index.html` | Not started |
| 4 | Manual vs. auto-generated artifacts, ADR generation from diffs, `/plan` vs. `/ultraplan` vs. `/ultrareview`, roadmap maintenance, CLAUDE.md check-in | `slides/week-4/index.html` | Not started |
| 5 | Security review, deployment configuration audit, `/ultrareview` evaluation, review pipeline retrospective, CLAUDE.md audit | `slides/week-5/index.html` | Not started |
| 6 | Retrospective (tools + process), demo, handoff (may be discussion-driven, slides optional) | `slides/week-6/index.html` | Not started |
