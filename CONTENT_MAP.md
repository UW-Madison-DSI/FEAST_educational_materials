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

**Slide deck:** `slides/week-1/index.html` (58 sections, labels 01-44 plus 01b/28b/28c/38b/38c inserts)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Constraints (L8-16) | -- | Branch names, repo URLs, cohort org placeholder `[COHORT-ORG]` |
| How This Plan Works (L18-33) | 02 How the week works, 03 Weekly rhythm | Session structure, solo work description |
| **Food accessibility** (L55-71) | 05 Section, 06 Four factors, 07 Why it matters, 08 Decisions FEAST answers | Four factors list, USDA stats, example questions |
| **ABM approach** (L73-117) | 10 Section, 11 What is ABM, 12 Two agents, 13 Household step, 14 MFAI formula, 15 MFAI worked example, 16 Mesa | ABM properties, agent types, step logic, MFAI scores (95/55/25), trip counts (7/8/6), income thresholds, has_resources() line ref, Mesa components |
| Use cases and stakeholders (L119-134) | 09 Stakeholders, 18 Origin | Stakeholder list, example scenarios, ICICLE/NSF origin |
| **Architecture** (L136-188) | 19 Section, 20 Three layers, 21 Frontend, 22 Backend, 23 Database, 24 Step lifecycle (condensed) | Three-layer diagram, frontend tech (React 19/Vite/Leaflet), backend tech (FastAPI/Mesa/asyncpg), DB schema, CRS (4326 vs 3857), entry points, step lifecycle (condensed summary), multiprocessing, client.js hardcoded URL, port numbers |
| **Deployment configurations** (L190-235) | NEW: slide(s) needed (after slide 24) | Deployment topology diagram (3 environments x 3 layers), configuration matrix table, three configuration levers (client.js, .env, CORS), common configurations, cross-environment safety warning |
| **Project mgmt artifacts** (L237-245) | NEW: slide(s) needed | Project context file (CLAUDE.md), ROADMAP.md, DECISIONS.md overview; brief on-screen display |
| **Agentic coding tools** (L247-322) | 25 Section, 25b Two rules, 25b-ii What is an agent, 25b-iii Focus shift, 25c Tool landscape, 25d Project context files, 26 Patterns, 27 Week 1 rules | Agentic engineering vs. vibe coding distinction, five-piece agent model (one LLM, stable identity, a job, a toolbox, a harness), agent loop (observe/think/act), three agent types (conversational, task, orchestrator), focus shift (syntax to engineering), tool landscape (Claude Code, Gemini CLI, Cursor, Copilot), project context file as harness config, the two rules (explain every line, write for future you), week 1 LLM restrictions. Reference: Guide 12 |
| **Git fundamentals** (NEW, in Guide 01) | 28b Git concepts, 28c Git commands | Core concepts (repo, commit, branch), five commands (clone, checkout, add+commit, push, status) |
| **Setup** (L324-454) | 28 Section, 28b Git concepts, 28c Git commands, 29 Prerequisites, 30 Setup steps (NOW INCLUDES CLI agent install as Step 3), 31 Working state, 32 Common problems | Prerequisites list, git fundamentals, clone from `[COHORT-ORG]`, clone/branch/install steps, CLI agent install, run_local.py port 8000, client.js edit, common problems list, live instance URL |
| Assigned work (L456-485) | 33 Section, 34 Use the app, 35 Endpoint traces, 36 Deliverable | Endpoint trace table (5 students), deliverable (PR with trace + context file + vision plan), live instance URL |
| Solo work (L488-590) | 37 Section, 38 Solo explore, 38b Context file, 38c Vision plan, 39 Solo file issues (now Part 4), 40 Things you'll find, 41 Stretch | J vs S exploration targets, project context file creation in FEAST repo, vision plan (template in `templates/vision-plan-template.md`, investigation areas table, tier expectations), issue filing with area labels (area:frontend-state, etc.), example issues list, stretch goals |
| Plan comparison activity (L592-626) | 42 Plan comparison | Silent read, round-robin, three-column board ("Everyone noticed" / "Multiple" / "One person"), encode priorities in CLAUDE.md, agent-assisted issue triage via `gh issue list`, connection to assigned work. Instructor prep note at L594 references `docs/instructor-guides/week-2-prep.md` |
| -- | 01 Title, 01b Experience baseline, 03b Live demo, 04a Act I, 24b Act II, 43 Recap, 44 Q&A | Structural slides, no curriculum counterpart |

### Key shared values (Week 1)

These specific values appear in both the curriculum and slides. If any change, both must be updated:

- **Live frontend URL:** `https://fassfrontstage.pods.icicleai.tapis.io/`
- **MFAI scores:** supermarket=95, convenience=55, pantry=25
- **Trip counts:** resources+vehicle=7, resources+no vehicle=8, no resources=6
- **Income thresholds:** $10k (single), $15k (2-person), $25k (3+ person)
- **Backend port:** 8000 (run_local.py), 8080 (gunicorn)
- **Frontend port:** 5173
- **Cohort org placeholder:** `[COHORT-ORG]` used in clone URLs. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Constraints + Setup scaffold), `docs/guides/01-environment-setup.md`, `templates/CONTRIBUTING.md`, `docs/assignments/week-1-assignment.md` (deliverables)

- **Repo branches:** `minimum_viable_product` (backend), `Brown-County-Frontend` (frontend)
- **CRS:** households EPSG:4326, stores EPSG:3857
- **Entry points:** run_local.py (correct), api_server.py (legacy), server.py (legacy)
- **has_resources() line ref:** household.py:180
- **get_mfai() line ref:** household.py:229
- **Agentic tools listed:** Claude Code, Gemini CLI, Cursor, Copilot
- **Review pipeline layers:** CI checks (Week 2), peer review (Week 2), LLM adversarial review (Week 3)
- **Project mgmt artifacts:** project context file (CLAUDE.md), ROADMAP.md, DECISIONS.md
- **Configuration levers:** client.js baseURL (frontend->backend), .env DB_HOST (backend->DB), CORS origins (backend->frontend). Appears in three places: `STUDENT_ONBOARDING_PLAN.md` (Week 1 deployment config section), `docs/guides/01-environment-setup.md` (Configuration Points), and `docs/guides/10-deployment-configuration.md`. All three must stay in sync.
- **Common configurations:** full local, local FE + staging API, full staging, mixed (mistake)
- **Vision plan investigation areas:** Frontend state management, Frontend consistency, Backend entry points, Database access patterns, Simulation core, Data pipeline/geographic scope, Testing and reliability. Template: `templates/vision-plan-template.md`. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 1 solo work Part 3)
- **Issue area labels:** area:frontend-state, area:frontend-consistency, area:backend-entry-points, area:database-access, area:simulation-core, area:data-pipeline, area:testing. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Part 4 issue filing + Plan Comparison Step 4), `templates/CLAUDE.md` (Issue Organization section)
- **Planning tools:** structured planning (Week 3), multi-issue planning (Week 4), branch-level review (Week 4)
- **Agent concepts:** Five-piece model (one LLM, stable identity, a job, a toolbox, a harness), agent loop (observe/think/act), three agent types (conversational, task, orchestrator), two-layer harness (runtime level vs. context level). Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 1 "What makes a tool an agent?" and Week 4 "Recognizing agentic design patterns" and Week 5 "context file encoding"), `slides/week-1/index.html` (25b-ii, 25b-iii), `docs/guides/12-agentic-engineering-concepts.md` ("Two layers of the harness"), `docs/guides/13-agentic-workflow-best-practices.md` ("Encoding Workflow")
- **Focus shift skills:** problem decomposition, architecture decisions (ADRs), spec writing, testing strategy, code review, documentation. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 1), `slides/week-1/index.html` (25b-iii), `docs/guides/12-agentic-engineering-concepts.md`
- **Agentic design patterns named:** Reflection, Planning, Tool Use, Human-in-the-Loop, Memory/Context, Prompt Chaining, Routing, Evaluation. Appears in: `STUDENT_ONBOARDING_PLAN.md` (Week 4), `docs/guides/12-agentic-engineering-concepts.md`

## Week 2

**Slide deck:** `slides/week-2/index.html` (29 slides)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Week 1 recap | 01 Title, 02 Week 1 recap | Session structure, Week 1 deliverables (5 cards: environment, trace, vision plan, issues, context file) |
| Plan Comparison Activity (L592-626) | 02b Your experience, 02c Assignment digest, 02d Vision plans, 02e Plan comparison, 02f Encode priorities | Experience discussion (surprised/confused/excited), then live discussion prompts, then vision plan intro + project refresh framing, then silent read + round-robin + convergence board, then encode in shared project context file with area labels (shared vs individual context files distinguished). Reference: `docs/instructor-guides/week-2-prep.md` |
| **Git workflow for teams** (L632-719) | 03 Section, 04 Branch strategy, 05 PR lifecycle, 06 Commit conventions, 07 Daily git rhythm | Branch strategy (main/staging/dev/feature), branch naming convention (feature/issue-NUMBER-desc), commit conventions (imperative mood, issue refs), PR lifecycle steps, small frequent digestible PRs (~200 lines), daily git rhythm |
| **Review pipeline** (L721-745) | 08 Section, 09 Three layers, 10 CI in practice, 11 Peer review, 12 PR template | Three-layer pipeline (CI/peer/LLM), PR template sections (summary, changes, test plan, tradeoffs, checklist) |
| **Assigned work** (L754-880) | 12b Your track | Track assignments + hands-on branch creation. Placed after review pipeline so students know their track before remaining skills sections. Issue #4 (linting), Issues #1/#2/#3 (type hints), #5 (tests). References guides 03/04/05 and assignment doc. |
| **Edge case brainstorming** (L720-724) | 13 Section, 14 Interview first, 15 Edge case example | Interview-first pattern, has_resources() edge cases, income thresholds |
| **Writing code with AI tools** (L726-742) | 16 Section, 17 Five steps | Five-step iterative pattern. Vibe vs agentic and planning preview content moved to recap slide and Week 3. |
| **Project context file review** (L750-752) | 24 Context file review | Review checklist. Placed before ADRs to alternate active/passive energy. |
| **ADRs** (L744-748) | 20 Section, 21 ADR template, 22 ADR example | ADR template fields (title+status, context, decision, alternatives), E501 example |
| **Solo work** (L863-880) | 27 Solo work | Async deliverables: context file update, file issues, review a PR, start assigned issue |
| -- | 28 Recap | Four engineering skills + next week pointer. Absorbs vibe vs agentic key insight. |

**Assignment document:** `docs/assignments/week-2-assignment.md` -- per-track instructions, LLM usage rules, deliverables checklist, quality signals, guide references.

### Key shared values (Week 2)

These specific values appear in both the curriculum and slides. If any change, both must be updated:

- **Branch strategy:** `main` (production), `staging` (pre-production validation), `dev` (integration), `feature/issue-NUMBER-short-desc` (your work). Appears in: STUDENT_ONBOARDING_PLAN.md (Week 2 git workflow scaffold + Coordination Mechanics), docs/guides/01-environment-setup.md (Git Fundamentals), Week 1 slides (28b), Week 2 slides (04), templates/CONTRIBUTING.md
- **Commit conventions:** Imperative mood, reference issue numbers, one logical change per commit. Appears in: STUDENT_ONBOARDING_PLAN.md (Week 2 scaffold), Week 2 slides (11)
- **PR template sections:** Summary, Changes, Test Plan, Tradeoffs, Checklist. Appears in: STUDENT_ONBOARDING_PLAN.md, Week 2 slides (07), .github/pull_request_template.md
- **PR size limit:** ~200 lines of changed code (non-test). Appears in: STUDENT_ONBOARDING_PLAN.md (L1380 and Week 2 scaffold), Week 2 slides (10)
- **Review pipeline layers:** CI checks (Week 2), peer review (Week 2), LLM adversarial review (Week 3). Appears in: Week 1 shared values, Week 2 slides (04)
- **ADR template fields:** Title+Status, Context, Decision, Alternatives. Appears in: templates/adr-template.md, Week 2 slides (21)
- **Week 1 deliverables (recap):** Environment, endpoint trace, vision plan, issues filed, context file. Appears in: Week 2 slides (02, 5 cards), `docs/assignments/week-1-assignment.md` (Deliverables section)
- **Instructor prep workflow:** `docs/instructor-guides/week-2-prep.md`. Referenced by: STUDENT_ONBOARDING_PLAN.md (L594, instructor prep note before Plan Comparison Activity), Week 2 slides (02b footer)

## Week 3

**Slide deck:** `slides/week-3/index.html` (19 slides)

| Curriculum section (line) | Slide(s) | Shared facts to keep in sync |
|---|---|---|
| Week 2 recap | 01 Title, 02 Week 2 recap | Week 2 deliverables (6 cards: branches+PRs, CI, peer review, iterative pattern, ADRs, assigned issues) |
| **PR template** (Week 2 follow-up) | 02a PR template | Five PR template sections (Summary, Changes, Test Plan, Tradeoffs, Checklist). Action: add template sections to CLAUDE.md so agent uses them. Appears in: `.github/pull_request_template.md`, Week 2 slides (07) |
| **Context file review** (student PRs #10, #14, #15) | 02b Three proposals, 02c What each brings, 02d Ideal context file, 02e Building the shared file | Anonymous comparison of three student CLAUDE.md proposals. Slide 02d maps six ideal sections (what is it, how to run, architecture, rules, what to avoid, agent behavior) against proposals A/B/C. Convergence points, unique contributions, shared vs individual context file distinction. Merged template: `templates/CLAUDE-backend-merged.md` |
| **LLM adversarial review** (L894-902) | 03 Section, 04 Adversarial review, 05 Live demo, 06 Three layers complete | Adversarial review prompt, rotation protocol, three-layer pipeline diagram (CI/peer/LLM), "Valid" vs "False positive (because...)" labeling |
| **Specs before code** (L904-923) | 07 Section, 08 Why specs first, 09 Planning tools, 10 Hand vs agent plans | Spec-first pattern (ADR for decisions, diagnosis paragraph for fixes), /plan workflow (4 steps), hand-written vs agent plan comparison, best workflow |
| **Connecting the dots** (L925-929) | 11 You are doing engineering | Six engineering skills grid (decomposition, quality gates, code review, decision records, spec-first planning, coordination), agentic engineering definition |
| **Assigned work** (L931-1075) | 12 Your track | Four issues: #6 (bug fix), #7 (optimization), #8 (redundancy), #9 (logging). Each with spec-first requirement. |
| **Roadmap activity** (L1117-1118) | 13 Roadmap check-in | 10-min activity: comment on 1-2 issues for Weeks 4-5, nominate priorities |
| -- | 14 Recap | Three skills: adversarial review, spec-first planning, agent-assisted planning. Next week pointer. |

**Assignment document:** `docs/assignments/week-3-assignment.md` -- per-issue instructions, review protocol (all 3 layers), LLM usage rules, deliverables checklist.

### Key shared values (Week 3)

- **Review pipeline (complete):** CI checks (automated, Week 2) + peer review (human, Week 2) + LLM adversarial review (student-run, Week 3). Appears in: STUDENT_ONBOARDING_PLAN.md (L894-902), Week 3 slides (04, 06), Week 2 slides (09), CONTENT_MAP.md Week 1 shared values
- **Adversarial review prompt:** "Review this diff for correctness, performance, and maintainability issues. Be thorough and skeptical. For each finding, rate your confidence and explain why it matters." Appears in: STUDENT_ONBOARDING_PLAN.md (L898), Week 3 slides (04)
- **Spec-first pattern:** ADR for design decisions, diagnosis paragraph for straightforward fixes. Appears in: STUDENT_ONBOARDING_PLAN.md (L904-906), Week 3 slides (08)
- **Week 3 assigned issues:** #6 (stores-within-1-mile bug), #7 (step optimization), #8 (redundant functions), #9 (logging). Appears in: STUDENT_ONBOARDING_PLAN.md (L933-1075), Week 3 slides (12), `docs/assignments/week-3-assignment.md`
- **household.py line refs:** has_resources():180, get_mfai():229, step():278, calculate_distances():257, stores_with_1_miles():142. Appears in: STUDENT_ONBOARDING_PLAN.md, Week 3 assignment doc, CONTENT_MAP.md Week 1 shared values

## Weeks 4-6

Slide decks for these weeks do not exist yet. When created, add mappings here following the Week 1/2/3 format.

| Week | Curriculum topics (post-DEC-004/005/006 restructuring) | Slide deck | Status |
|---|---|---|---|
| 4 | Manual vs. auto-generated artifacts, ADR generation from diffs, single-feature vs. multi-issue planning vs. branch-level review, roadmap maintenance, project context file check-in | `slides/week-4/index.html` | Not started |
| 5 | Security review, deployment configuration audit, branch-level review evaluation, review pipeline retrospective, **complete agentic workflow** (spec-plan-execute-verify loop, workflow selection by task size, context file encoding), project context file audit. Reference: Guide 13 | `slides/week-5/index.html` | Not started |
| 6 | Retrospective (tools + process), demo, handoff (may be discussion-driven, slides optional) | `slides/week-6/index.html` | Not started |
