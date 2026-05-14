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

**Slide deck:** `slides/week-1/index.html` (54 sections, labels 01-44 plus 28b/28c git inserts)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Constraints (L8-15) | -- | Branch names, repo URLs |
| How This Plan Works (L17-32) | 02 How the week works, 03 Weekly rhythm | Session structure, solo work description |
| **Food accessibility** (L54-70) | 05 Section, 06 Four factors, 07 Why it matters, 08 Decisions FEAST answers | Four factors list, USDA stats, example questions |
| **ABM approach** (L72-116) | 10 Section, 11 What is ABM, 12 Two agents, 13 Household step, 14 MFAI formula, 15 MFAI worked example, 16 Mesa | ABM properties, agent types, step logic, MFAI scores (95/55/25), trip counts (7/8/6), income thresholds, has_resources() line ref, Mesa components |
| Use cases and stakeholders (L118-133) | 09 Stakeholders, 18 Origin | Stakeholder list, example scenarios, ICICLE/NSF origin |
| **Architecture** (L135-187) | 19 Section, 20 Three layers, 21 Frontend, 22 Backend, 23 Database, 24 Step lifecycle (condensed) | Three-layer diagram, frontend tech (React 19/Vite/Leaflet), backend tech (FastAPI/Mesa/asyncpg), DB schema, CRS (4326 vs 3857), entry points, step lifecycle (condensed summary), multiprocessing, client.js hardcoded URL, port numbers |
| **Deployment configurations** (L189-234) | NEW: slide(s) needed (after slide 24) | Deployment topology diagram (3 environments x 3 layers), configuration matrix table, three configuration levers (client.js, .env, CORS), common configurations, cross-environment safety warning |
| **Project mgmt artifacts** (L236-244) | NEW: slide(s) needed | Project context file (CLAUDE.md), ROADMAP.md, DECISIONS.md overview; brief on-screen display |
| **Agentic coding tools** (L246-321) | 25 Section, 25b Two rules, 25b-ii What is an agent, 25b-iii Focus shift, 25c Tool landscape, 25d Project context files, 26 Patterns, 27 Week 1 rules | Agentic engineering vs. vibe coding distinction, five-piece agent model (one LLM, stable identity, a job, a toolbox, a harness), agent loop (observe/think/act), three agent types (conversational, task, orchestrator), focus shift (syntax to engineering), tool landscape (Claude Code, Gemini CLI, Cursor, Copilot), project context file as harness config, the two rules (explain every line, write for future you), week 1 LLM restrictions. Reference: Guide 12 |
| **Git fundamentals** (NEW, in Guide 01) | 28b Git concepts, 28c Git commands | Core concepts (repo, commit, branch), five commands (clone, checkout, add+commit, push, status) |
| **Setup** (L323-453) | 28 Section, 28b Git concepts, 28c Git commands, 29 Prerequisites, 30 Setup steps (NOW INCLUDES CLI agent install as Step 3), 31 Working state, 32 Common problems | Prerequisites list, git fundamentals, clone/branch/install steps, CLI agent install, run_local.py port 8000, client.js edit, common problems list, live instance URL |
| Assigned work (L455-485) | 33 Section, 34 Use the app, 35 Endpoint traces, 36 Deliverable | Endpoint trace table (5 students), deliverable (PR with trace), live instance URL |
| Solo work (L487-553) | 37 Section, 38 Solo explore, NEW: project context file creation slide, 39 Solo file issues, 40 Things you'll find, 41 Stretch | J vs S exploration targets, project context file creation in FEAST repo, issue filing expectations (3+), example issues list, stretch goals |
| Roadmap activity (L555-558) | 42 Roadmap kickoff | Review + label + project board |
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
- **Agentic tools listed:** Claude Code, Gemini CLI, Cursor, Copilot
- **Review pipeline layers:** CI checks (Week 2), peer review (Week 2), LLM adversarial review (Week 3)
- **Project mgmt artifacts:** project context file (CLAUDE.md), ROADMAP.md, DECISIONS.md
- **Configuration levers:** client.js baseURL (frontend->backend), .env DB_HOST (backend->DB), CORS origins (backend->frontend). Appears in three places: `STUDENT_ONBOARDING_PLAN.md` (Week 1 deployment config section), `docs/guides/01-environment-setup.md` (Configuration Points), and `docs/guides/10-deployment-configuration.md`. All three must stay in sync.
- **Common configurations:** full local, local FE + staging API, full staging, mixed (mistake)
- **Planning tools:** structured planning (Week 3), multi-issue planning (Week 4), branch-level review (Week 4)
- **Agent concepts:** Five-piece model (one LLM, stable identity, a job, a toolbox, a harness), agent loop (observe/think/act), three agent types (conversational, task, orchestrator). Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 1 "What makes a tool an agent?" and Week 4 "Recognizing agentic design patterns"), `slides/week-1/index.html` (25b-ii, 25b-iii), `docs/guides/12-agentic-engineering-concepts.md`
- **Focus shift skills:** problem decomposition, architecture decisions (ADRs), spec writing, testing strategy, code review, documentation. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 1), `slides/week-1/index.html` (25b-iii), `docs/guides/12-agentic-engineering-concepts.md`
- **Agentic design patterns named:** Reflection, Planning, Tool Use, Human-in-the-Loop, Memory/Context, Prompt Chaining, Routing, Evaluation. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 4), `docs/guides/12-agentic-engineering-concepts.md`

## Week 2

**Slide deck:** `slides/week-2/index.html` (28 slides, labels 01-28)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Week 1 recap | 01 Title, 02 Week 1 recap | Session structure, Week 1 deliverables |
| **Review pipeline** (L532-542) | 03 Section, 04 Three layers, 05 CI in practice, 06 Peer review, 07 PR template | Three-layer pipeline (CI/peer/LLM), PR template sections (summary, changes, test plan, tradeoffs, checklist), PR size limit (~200 lines) |
| **Git workflow for teams** (L544-614) | 08 Section, 09 Branch strategy, 10 PR lifecycle, 11 Commit conventions, 12 Daily git rhythm | Branch strategy (main/dev/feature), branch naming convention (feature/issue-NUMBER-desc), commit conventions (imperative mood, issue refs), PR lifecycle steps, daily git rhythm |
| **Edge case brainstorming** (L616-620) | 13 Section, 14 Interview first, 15 Edge case example | Interview-first pattern, has_resources() edge cases, income thresholds |
| **Writing code with AI tools** (L622-638) | 16 Section, 17 Five steps, 18 Vibe vs agentic, 19 Plan preview | Five-step iterative pattern, vibe coding vs agentic engineering, structured planning preview |
| **ADRs** (L640-644) | 20 Section, 21 ADR template, 22 ADR example | ADR template fields (title+status, context, decision, alternatives), E501 example |
| **Project context file review** (L646-648) | 23 Section, 24 Project context file review | Review checklist |
| **Assigned work** (L650-667+) | 25 Section, 26 Assigned issues, 27 Solo work | Issue #24 (linting), Issues #18/#19/#20 (type hints), solo work deliverables |
| -- | 28 Recap | Structural slide, no curriculum counterpart |

### Key shared values (Week 2)

These specific values appear in both the curriculum and slides. If any change, both must be updated:

- **Branch strategy:** `main` (stable/deployed), `dev` (integration), `feature/issue-NUMBER-short-desc` (your work). Appears in: STUDENT_ONBOARDING_PLAN.md (Week 2 git workflow scaffold + Coordination Mechanics), docs/guides/01-environment-setup.md (Git Fundamentals), Week 1 slides (28b), Week 2 slides (09), templates/CONTRIBUTING.md
- **Commit conventions:** Imperative mood, reference issue numbers, one logical change per commit. Appears in: STUDENT_ONBOARDING_PLAN.md (Week 2 scaffold), Week 2 slides (11)
- **PR template sections:** Summary, Changes, Test Plan, Tradeoffs, Checklist. Appears in: STUDENT_ONBOARDING_PLAN.md, Week 2 slides (07), .github/pull_request_template.md
- **PR size limit:** ~200 lines of changed code (non-test). Appears in: STUDENT_ONBOARDING_PLAN.md (L1380 and Week 2 scaffold), Week 2 slides (10)
- **Review pipeline layers:** CI checks (Week 2), peer review (Week 2), LLM adversarial review (Week 3). Appears in: Week 1 shared values, Week 2 slides (04)
- **ADR template fields:** Title+Status, Context, Decision, Alternatives. Appears in: templates/adr-template.md, Week 2 slides (21)

## Weeks 3-6

Slide decks for these weeks do not exist yet. When created, add mappings here following the Week 1/Week 2 format.

| Week | Curriculum topics (post-DEC-004/DEC-005 restructuring) | Slide deck | Status |
|---|---|---|---|
| 3 | LLM adversarial review rotation (completing 3-layer pipeline), specs before code, structured planning for feature specs, ADR-format specs | `slides/week-3/index.html` | Not started |
| 4 | Manual vs. auto-generated artifacts, ADR generation from diffs, single-feature vs. multi-issue planning vs. branch-level review, roadmap maintenance, project context file check-in | `slides/week-4/index.html` | Not started |
| 5 | Security review, deployment configuration audit, branch-level review evaluation, review pipeline retrospective, **complete agentic workflow** (spec-plan-execute-verify loop, workflow selection by task size, context file encoding), project context file audit. Reference: Guide 13 | `slides/week-5/index.html` | Not started |
| 6 | Retrospective (tools + process), demo, handoff (may be discussion-driven, slides optional) | `slides/week-6/index.html` | Not started |
