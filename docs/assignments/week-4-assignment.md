---
layout: default
title: "Week 4 Assignment: Vision Plan Synthesis and Roadmap"
---

# Week 4 Assignment: Vision Plan Synthesis and Roadmap

**Due before:** Week 5 session
**Team:** All students
**Time estimate:** ~3-4 hours (reading, thinking, writing responses)
**Questions?** Email me.

## Overview

In Week 1, each of you wrote a vision plan for FEAST. This document synthesizes what you collectively observed into a proposed direction. Your assignment this week is to read it critically, respond to the questions, and draft milestone roadmaps for each track.

This is not busywork. Your responses will become the team's actual roadmap. What you write here determines what we build.

---

## What you all saw

Four people looked at the same codebase from different angles. Here is what emerged.

### Theme 1: The simulation is opaque

Multiple people flagged that FEAST doesn't explain itself to users.

- **What is a "step"?** There is no in-app explanation that a step simulates one month of food accessibility at the household level using disaggregated census data. A user clicking "step" has no idea what just happened or what the numbers mean.
- **Why do all households look the same?** The simulation generates individual household characteristics from census aggregates, but the UI doesn't surface this. A user sees identical-looking dots and reasonably concludes nothing interesting is happening.
- **What does "adding a store" actually do?** The interaction is clunky and doesn't convey what the simulation recalculates or why scores change.
- **Seeded information isn't visible.** Household-level details (income, vehicle access, proximity to stores) exist in the model but aren't accessible in the UI.

### Theme 2: The UI needs to show more and show it better

Everyone had observations about the interface.

- **Map needs more real estate.** The current layout constrains the map. Metadata and controls could be reorganized to give the map prominence.
- **Metadata should be visible inline.** Hovering over a household or store should show relevant details (MFAI score, income, store type, distance). This information exists in the model but requires navigating away from the map.
- **Visual polish and consistency.** The app mixes Bootstrap and Tailwind. Styling is inconsistent. It feels like "beta 0.1."
- **Embedded documentation.** Info hovers, tooltips, or an interactive tutorial so users can learn the tool without external docs.
- **Structured guidance for instances.** New users don't understand the difference between individual and shared instances, or how to use them effectively.

### Theme 3: Users can't take results with them

- **No export.** Users can't download simulation results, save a map view, or generate a summary.
- **No local copy.** If the server goes down, results are gone. Users should be able to save a snapshot: map image, stats, household-level data as CSV.
- **No summary view.** There is no way to get a high-level "here is what this simulation found" output that could go into a report or presentation.

### Theme 4: It's slow

- **Simulation performance.** Running steps takes noticeably long, especially at scale.
- **Pre-processing.** Data loading and initialization have low-hanging optimization opportunities.
- **The slowness compounds the opacity problem.** When a user waits 30 seconds for a step and then can't tell what changed, the tool feels broken.

### Theme 5: The codebase needs cleanup

- **Dead code.** Multiple unused files and functions. Makes navigation harder for new contributors.
- **File structure.** The backend organization is not intuitive. New developers spend time figuring out where things live.
- **Ecosystem mapping.** Understanding how functions and files interact requires tracing by hand. No documentation of the call graph or data flow.
- **Mixed patterns.** Three entry points, two database access patterns, inconsistent coordinate systems.

---

## Proposed target

Here is a proposed direction that ties these observations together. This is a starting point, not a final plan. Push back on anything that doesn't match your understanding.

### North star

**Make FEAST usable by someone who wasn't in the room when it was built.**

Right now, using FEAST effectively requires someone to explain it to you. The simulation doesn't explain what it calculates. The UI doesn't surface the data that makes results meaningful. Results can't be exported or shared. The codebase doesn't explain itself to new contributors. Every theme you identified connects to this gap.

### Three tracks

The work groups into three tracks that can run in parallel. Each track has a concrete "done" state.

#### Track A: Make the simulation understandable

**Done when:** A new user can open FEAST, run a simulation, and understand what happened without external help.

Concrete targets:
- **Step explanation modal.** Before or after running a step, the user sees a plain-language description: "This simulated one month of food access for N households. Each household's food accessibility score was recalculated based on proximity to stores, income, and vehicle access."
- **Household detail on hover/click.** Hovering over a household dot shows: MFAI score, income bracket, vehicle access, nearest store distance, store count within 1 mile. This data already exists in the model.
- **Score differentiation.** Color-code or size-code household dots by MFAI score so the map visually communicates the distribution. Users should immediately see which areas have low food access.
- **Store interaction improvement.** Adding a store should preview the impact zone and show before/after score changes for affected households.
- **Remove polygons.** The hexagon/triangle store markers require explanation and add no analytical value. Use standard markers.
- **Link to ICICLE training catalog.** Help menu or about page connects to https://icicle-ai.github.io/training-catalog/docs/FEAST for deeper context.

#### Track B: Make results exportable and shareable

**Done when:** A user can run a simulation and produce a shareable artifact (PDF, CSV, or summary) without screenshots.

Concrete targets:
- **CSV export of household data.** Download the current simulation state as a CSV: household ID, location, MFAI score, income, vehicle access, nearest store distance.
- **Map screenshot/PDF.** One-click export of the current map view with legend and basic stats.
- **Summary panel.** A sidebar or modal that shows aggregate statistics: mean/median MFAI, score distribution, count of households below a threshold, comparison across steps.
- **Instance metadata.** Each simulation instance shows its configuration: geography, store set, number of steps run, date created.

#### Track C: Make the codebase contributor-friendly

**Done when:** A new developer can clone the repo, understand the architecture, and make a change without asking someone.

Concrete targets:
- **Dead code removal.** Audit and remove unused files and functions. Already partially tracked in existing issues.
- **Entry point consolidation.** Three entry points (`run_local.py`, `api_server.py`, `server.py`) should become one. Already identified in backlog.
- **CRS standardization.** Store everything as EPSG:4326, convert to 3857 only for distance math.
- **Performance profiling.** Benchmark simulation step time. Identify whether the bottleneck is DB queries, distance calculations, or multiprocessing overhead. Publish results so optimization work is data-driven, not guesswork.
- **Architecture documentation.** The merged CLAUDE.md captures the call graph and data flow. Keep it current as the codebase changes.

---

## What's explicitly deferred

Some ideas from the vision plans are valuable but too large or too uncertain for the current scope. Naming them here so they're not lost:

- **Walking distances / routing integration.** The observation about distance realism is correct, but integrating a routing API (e.g., OSRM, Google Directions) is a significant scope expansion. Worth exploring after the core simulation is understandable and exportable.
- **Geography-based instance management.** Assigning instances to a geography rather than having separate pages per geography is a good UX direction, but depends on first supporting multiple geographies (currently hardcoded to Brown County, tracked as #42).
- **Interactive tutorial / onboarding flow.** Valuable, but depends on the UI stabilizing first. Build the features, then build the tutorial that explains them.
- **Pre-processing pipeline optimization.** Important for scaling to new geographies, but not blocking current users. Profile first (Track C), then optimize with data.

---

## Your assignment

Answer these questions before our next session. Short answers are fine. Honest disagreement is better than polite agreement.

### Part 1: React to the proposed direction

1. **Does the north star resonate?** "Usable by someone who wasn't in the room" -- does that capture the core problem, or is there a better way to frame it?

2. **Are the three tracks right?** Should anything move between tracks? Is anything missing that you feel strongly about?

3. **What's the most important single deliverable?** If we could only ship one thing, what should it be?

### Part 2: Claim your interest

4. **Which track interests you most?** You'll have more energy and do better work on something you care about. Name your top choice and why.

5. **What's one thing you'd add or change?** Something from your vision plan that isn't reflected here, or something in the proposal you disagree with.

6. **What's realistic?** Given your experience so far with the codebase and the time remaining, what do you think the team can actually finish? Be honest about pace.

### Part 3: Draft the roadmap

Each track needs its own milestones. A milestone is a point where the work so far is usable and testable on its own, even if the track isn't finished. Think of it as: "if we stopped here, what would a user or contributor actually have that they don't have today?"

**For Track A (simulation understandable):**

7. **What are the milestones?** Draft a sequence. For example, is the first milestone "household hover shows MFAI score" or "step explanation modal exists"? What comes after that? What is the last milestone that means the track is done?

8. **What depends on what?** Can the modal and the hover work happen independently, or does one need the other? Does score visualization depend on hover working first?

**For Track B (results exportable):**

9. **What are the milestones?** Is CSV export the first milestone, or is the summary panel more impactful? What order would you build these in?

10. **What depends on what?** Does the summary panel depend on having better data from Track A (e.g., score distributions)? Can export work start independently?

**For Track C (codebase contributor-friendly):**

11. **What are the milestones?** Dead code removal and entry point consolidation are independent. Performance profiling informs optimization but doesn't block other cleanup. What order?

12. **What unblocks other tracks?** Some Track C work (like CRS standardization) may be a prerequisite for Track A or B work. Flag anything where cleaning up the code first would make feature work significantly easier.

**Across all tracks:**

13. **What is the very first milestone across the whole project?** The smallest set of changes, from any track, that would make a visible difference to a user. This becomes the team's first collective target.

14. **Where do tracks interact?** Are there points where Track A needs something from Track C, or Track B needs a UI component from Track A? Map the dependencies you see.

---

## Sprint structure

While we plan the longer-term roadmap, we need to keep shipping. Issues in both repos are now tagged with sprint labels so you can filter and focus. Each sprint is sized for 4 developers at roughly 10 hours each.

### Sprint: Anxious Aardvark (start here)

**Label:** `sprint:anxious-aardvark` in both repos
**Focus:** Cleanup and quick fixes. Input validation bugs, error handling, environment fixes.

| Issue | Repo | What |
|---|---|---|
| [BE #31](https://github.com/FoodAccessSimulator/FEAST-backend/issues/31) | backend | UUID validation: 7 endpoints return 500 instead of 400 |
| [BE #32](https://github.com/FoodAccessSimulator/FEAST-backend/issues/32) | backend | POST /api/stores accepts bad lat/lon, returns 500 |
| [BE #33](https://github.com/FoodAccessSimulator/FEAST-backend/issues/33) | backend | Negative household_limit crashes with 500 |
| [BE #34](https://github.com/FoodAccessSimulator/FEAST-backend/issues/34) | backend | DELETE /stores 500 on bad store_id |
| [BE #35](https://github.com/FoodAccessSimulator/FEAST-backend/issues/35) | backend | simulation_step overflow returns 500 |
| [BE #36](https://github.com/FoodAccessSimulator/FEAST-backend/issues/36) | backend | "Description" field silently ignored |
| [BE #18](https://github.com/FoodAccessSimulator/FEAST-backend/issues/18) | backend | Env variable mismatch in geo_model.py |
| [FE #5](https://github.com/FoodAccessSimulator/FEAST-frontend/issues/5) | frontend | Remove Store with no selection sends NaN, silent 500 |
| [FE #6](https://github.com/FoodAccessSimulator/FEAST-frontend/issues/6) | frontend | API failures silent, spinner stuck on screen |

**Why this first:** Every issue has clear repro steps and a concrete fix. You practice the full pipeline (spec, plan, build, test, review) on issues small enough to finish in one sitting. Pick one, claim it in the comments, and ship it.

### Review process

Every PR goes through a structured review before merge. This is not optional.

1. **LLM review (Claude)** -- primary adversarial review. Findings posted as inline PR comments, each marked `Valid` or `False positive (because...)`
2. **LLM review (secondary, optional)** -- a second model or fresh session for an independent perspective
3. **Human reviewer 1 (full review)** -- substantive code review covering correctness, design, and style. Not just "LGTM"
4. **Human reviewer 2 (discussion review)** -- reads the PR conversation and confirms all raised concerns are addressed

Use the [Reviewer Spinner]({{ site.baseurl }}/docs/reviewer-spinner.html) to assign your human reviewers. The PR template in the repo has the full checklist.

### Coming next

These sprints are queued up. We will adjust based on what we learn from Anxious Aardvark and your roadmap feedback.

**Bold Bison** (`sprint:bold-bison`) -- Infrastructure: logging, entry point consolidation, CI, documentation.

**Curious Capybara** (`sprint:curious-capybara`) -- User-facing: household hover, export, instance UX, title page. Aligns with Tracks A and B.

**Daring Dolphin** (`sprint:daring-dolphin`) -- Performance: step optimization, profiling, instance creation speed, geocoding. Aligns with Track C.

Filter by sprint label in either repo to see the full list for each phase.

---

## Deliverables

- [ ] **Written responses to questions 1-6** (shared doc or issue comment)
- [ ] **Draft milestone list for at least one track** (questions 7-12). Use the format: "Milestone 1: ..., Milestone 2: ..., Done when: ..."
- [ ] **First milestone proposal** (question 13) -- the team's first collective target
- [ ] **Pick an Anxious Aardvark issue and start working it** -- claim it in the comments, follow the full pipeline (spec, plan, build, test, review)

## What happens next

1. **You respond** to the roadmap questions above
2. **You ship Anxious Aardvark issues** using the pipeline you have learned
3. **We aggregate** your roadmap responses into a collective plan with milestones, dependencies, and ownership
4. **We adjust the sprint queue** based on what we learn

The roadmap is yours to shape. This document is a proposal, not a decision.
