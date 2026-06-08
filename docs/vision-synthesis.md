---
layout: default
title: "Vision Plan Synthesis"
---

# FEAST Vision Plan Synthesis

**Purpose:** This document synthesizes the vision plans from all four team members into a proposed direction for FEAST development. Read it, then respond with your feedback. We will use your responses to draft a collective roadmap.

**What I'm asking from you:** At the bottom of this document are specific questions. Answer them in a shared doc or issue comment before our next session. Your answers shape the roadmap.

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

## Questions for you

Answer these before our next session. Short answers are fine. Honest disagreement is better than polite agreement.

### On the proposed direction

1. **Does the north star resonate?** "Usable by someone who wasn't in the room" -- does that capture the core problem, or is there a better way to frame it?

2. **Are the three tracks right?** Should anything move between tracks? Is anything missing that you feel strongly about?

3. **What's the most important single deliverable?** If we could only ship one thing, what should it be? (Forces prioritization.)

### On your own work

4. **Which track interests you most?** You'll have more energy and do better work on something you care about. Name your top choice and why.

5. **What's one thing you'd add or change?** Something from your vision plan that isn't reflected here, or something in the proposal you disagree with.

6. **What's realistic?** Given your experience so far with the codebase and the time remaining, what do you think the team can actually finish? Be honest about pace.

### On the roadmap

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

## Next steps

1. **You respond** to the questions above (shared doc or issue comment). For questions 7-12, sketch actual milestone lists, not just descriptions. "Milestone 1: ..., Milestone 2: ..., Done when: ..." is the format.
2. **We aggregate** your responses into a collective roadmap with milestones, dependencies, and ownership
3. **We start building** against that roadmap with the full pipeline you've learned

The roadmap is yours to shape. This document is a proposal, not a decision.
