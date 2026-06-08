---
layout: default
title: "Week 4 Assignment"
---

# Week 4 Assignment

**Due before:** Week 5 session
**Team:** All students
**Tools:** Claude Code or your CLI agent of choice
**Time estimate:** ~8-10 hours total (including group session work time). These are the largest issues in the backlog. Track your time so we can calibrate.
**Questions?** Email me.

## Overview

This week you work on the core algorithm, spatial data handling, and reporting features. These are bigger, cross-cutting issues that require the full pipeline: spec, plan, build, test, review, merge. You also learn to evaluate auto-generated artifacts (ADRs, roadmaps) and plan across multiple related issues.

## Your assigned issue

### Issue #30: Calculate food access scores using multiple stores (1-2 students)

**Type:** Algorithm change (highest-impact issue in the backlog)

1. **Read the paper first.** Understand the MFAI methodology from Koh et al. 2019. The current implementation in `food_access_model/abm/household.py:229` (`get_mfai`) only considers the single closest SPM and CSPM. Note: the `bc_pantries` branch extends this with pantry support for low-income households.

2. **Write an ADR** answering:
   - How many stores should we consider? Top 3? All within X miles?
   - How do we weight distance? Linear decay? Inverse square?
   - What does the paper say vs. what makes practical sense?
   - Performance impact: if we consider all stores, what is the complexity change for 50k households x 200 stores?

3. **Get the ADR reviewed** (post as a PR or issue comment) BEFORE coding.

4. **Write tests for the CURRENT `get_mfai()` behavior first.**

5. **Implement the new algorithm.** Write tests for new behavior alongside, not after.

6. **Compare results:** Run both old and new on the same data. Document the difference in scores.

**LLM usage:** Use the LLM to discuss algorithm tradeoffs: "The current MFAI considers only the closest store. I'm considering [your approach]. What are the tradeoffs?" This is a legitimate design discussion where the LLM adds value.

### Issue #67: Refactor spatial data handling (1 student)

**Type:** Cross-cutting refactor

1. **Understand the current flow:**
   - Household data stored as EPSG:4326 (lat/lon WKT in `centroid_wkt`)
   - Store data stored as EPSG:3857 (polygon WKT in geometry column)
   - This CRS inconsistency means different coordinate handling per table
   - Backend (`api/helpers.py:29`) generates polygons when adding stores: hexagons (50m radius) for supermarkets, triangles (25m) for convenience
   - Frontend (`MapComponent.js`) uses proj4 to reproject store coords
   - The `bc_pantries` branch takes a different approach: stores take lat/lon and convert internally, households reproject internally

2. **The issue says:** store and deliver all data in 4326. Only use 3857 for internal distance calculations. Stop generating polygons (frontend uses marker icons, not polygon shapes).

3. **This touches multiple files.** Plan the changes before coding:
   - `preprocessing/get_data.py`: stop polygon generation at data load time
   - `api/helpers.py`: stop polygon generation when adding stores via API
   - `abm/store.py`, `abm/household.py`: keep internal 3857 for distance math
   - `api/routes.py`: return 4326 coordinates in query results
   - Frontend `MapComponent.js`: remove proj4 reprojection
   - `insert_stores.py`: update to match new storage format

4. **Open as a draft PR early** and coordinate with whoever is working on frontend.

**LLM usage:** Ask the LLM to explain the difference between EPSG:4326 and EPSG:3857, and when you would use each. This is the kind of domain knowledge question where LLMs are genuinely helpful.

### Issue #94 + #79 + Frontend #36: Reporting API, metrics, and view (2-3 students)

**Type:** Multi-issue coordinated feature

These issues are interdependent. The backend needs a reporting API (#94) that serves richer metrics (#79) that the frontend displays (#36).

**Before splitting up work:** Use multi-issue planning. Feed all three issue descriptions to your agent and ask it to plan across them. Identify the dependency chain and agree on the API contract.

**Backend student (S or J/S):**
1. Write a spec: What metrics should the reporting API return? Look at what `get_household_stats` already returns (`routes.py:463`). What is missing? Suggestions: score distribution (histogram buckets), scores by income bracket, scores by vehicle ownership, change between simulation steps.
2. Design the API endpoint(s). Write the route signature and response model (Pydantic) before implementing the query.
3. Write tests for the new endpoint.
4. Implement.

**Frontend student (J):**
1. Wait for the API spec from the backend student.
2. Design a simple metrics panel (can be a sidebar or modal). The frontend already has a `DataComponent.jsx` that shows basic stats (household count, store counts, avg income/vehicles). You can extend it or build a new component.
3. Fetch from the new API endpoint via the Axios client in `src/shared/client.js`.
4. Display using basic charts or formatted tables. (Do not add a charting library unless needed. The app already mixes Bootstrap and Tailwind, so pick one and be consistent.)

**LLM usage:** Both students can use the LLM to brainstorm what metrics would be useful. The backend student can ask for help designing the SQL aggregation queries. The frontend student can ask for help with React component structure. Both must understand and be able to explain their code.

## The full pipeline

Every issue this week follows the same cycle. If you skip a step, you will be asked to go back.

1. **File/claim the issue** -- comment "I'm picking this up" and assign yourself
2. **Write a spec** -- ADR for design decisions, diagnosis paragraph for straightforward work. Posted in the issue before coding.
3. **Plan** -- use your hand-written spec as input to `/plan` or equivalent. Compare the two.
4. **Build + test** -- implement in a feature branch. Write tests alongside code, not after.
5. **Review** -- all three layers: CI must pass, peer review, adversarial LLM review by a different student
6. **Merge** -- after all review feedback is addressed. Close the issue.

## Review protocol

Same as Week 3. Every PR gets all three layers:

1. **CI checks** must pass (automated)
2. **Peer review** by one teammate (substantive comments)
3. **LLM adversarial review** by a different student (fresh session, skeptical prompt, findings posted as PR comments marked "Valid" or "False positive (because...)")

The adversarial reviewer rotation continues. Complete your review within 48 hours of the PR being opened. If you owe a review, it is your top priority.

## Solo work

By Week 4, you should be proposing issues, not just picking from a list.

1. **File at least 1 new issue** based on something you discovered while working on your assigned task. These can be bugs, enhancements, or refactoring opportunities.
2. **Pick and work 1 issue from the backlog** (student-filed or original). Follow the full cycle: claim it, write a plan, implement, test, PR.

**For S students:** If you see a pattern (e.g., "there are 5 places where store type classification is hardcoded"), file a single issue that captures the systemic problem, not 5 individual ones. Propose a solution in the issue body.

**For J students:** Pair up with an S student on their assigned work if your solo issue feels too big. Or pick a small win: a documentation gap, a missing type hint, a test for an untested function.

## LLM rules for this week

**Newly allowed this week:**
- Auto-generating ADR drafts from diffs (review and edit, do not submit as-is)
- Multi-issue planning: feeding multiple issue descriptions to the agent and asking for a coordinated plan
- Design discussion: using the LLM to brainstorm algorithm tradeoffs, API designs, or data modeling approaches
- Generating roadmap summaries from git log (compare to hand-maintained roadmap to understand the difference)

**Still not allowed:**
- Accepting generated code without reading and understanding every line
- Submitting an auto-generated ADR without editing in your reasoning
- Using the LLM to make priority or scope decisions for you

**The rule that doesn't change:** You must be able to explain every line in your PR without looking at your chat history.

## Deliverables

- [ ] **Spec for assigned issue** -- ADR or diagnosis paragraph posted in the issue comment before coding
- [ ] **PR for assigned issue** -- passing CI + peer review + adversarial LLM review before merge
- [ ] **1 adversarial review completed** -- fresh session, findings posted as PR comments with Valid/False positive labels
- [ ] **1 PR reviewed** (peer review) -- read the diff, post at least one substantive comment
- [ ] **1 new issue filed** -- something you discovered while working this week
- [ ] **1 solo work PR** -- pick from backlog, full pipeline, all three review layers
- [ ] **Context file updated** -- reflects what you learned this week

### Quality signals

Your PR is ready for review when:
- It does one thing and the title says what
- The PR template is filled in (summary, changes, test plan, tradeoffs, checklist)
- It links to the issue with "Closes #N"
- CI passes
- A spec or ADR exists in the issue comment
- You can explain every line without looking at chat history

For cross-cutting PRs (#67, #94/#79/#36):
- Draft PR opened early with a description of what is coming
- Coordination with other students documented in issue comments
- API contract agreed on before frontend work begins (for reporting feature)

## Resources

- Guide 01: [Environment setup](../guides/01-environment-setup)
- Guide 05: [Writing tests](../guides/05-writing-tests)
- Guide 06: [Bug investigation](../guides/06-bug-investigation)
- Guide 07: [Optimization](../guides/07-optimization)
- Guide 11: [Planning with Claude Code](../guides/11-planning-with-claude-code)
- Guide 12: [Agentic engineering concepts](../guides/12-agentic-engineering-concepts)
- ADR template: `templates/adr-template.md`
- PR template: `.github/pull_request_template.md`
