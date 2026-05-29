---
layout: default
title: "Week 3 Assignment"
---

# Week 3 Assignment

**Due before:** Week 4 session
**Team:** All students
**Tools:** Claude Code or your CLI agent of choice
**Time estimate:** ~6-8 hours total (including group session work time). Track your time so we can calibrate.
**Questions?** Email me.

## Overview

This week you write specs before code, complete the three-layer review pipeline with LLM adversarial review, and work on bugs, optimization, and infrastructure improvements. Every PR gets all three review layers from here on.

## Your assigned issue

### Issue #6: Check "Stores within 1 Mile" logic (1 student)

**Type:** Bug investigation + fix

After running a simulation step, all households appear to have the same number of stores within 1 mile.

1. Read `food_access_model/abm/household.py:142` (`stores_with_1_miles`)
2. Trace when `distances_map` gets populated. Look at `calculate_distances()` (line 257) and `step()` (line 278).
3. Write a **diagnosis paragraph** in the issue comment before fixing: what is broken, what causes it, how you will fix it.
4. Write a test that reproduces the bug BEFORE fixing it.
5. Fix the bug. Verify the test passes.
6. Use your CLI agent's planning tool (`/plan`) after writing your diagnosis. Compare its plan to yours.

**LLM usage:** Describe the bug and your hypothesis. Ask "What else could cause all households to report the same store count?" See if it suggests causes you missed.

### Issue #7: Optimize step function (1 student)

**Type:** Performance refactor

The step function iterates all stores multiple times per household: `calculate_distances()`, `get_closest_cspm()`, `get_closest_spm()`, `stores_with_1_miles()`.

1. Read `household.py` `step()` and all the functions it calls. Count how many times each household iterates over all stores.
2. Write a **short ADR** (using `templates/adr-template.md`) before coding. Cover: current behavior, proposed change, alternatives, performance implications.
3. Post the ADR in the issue comment for team review BEFORE coding.
4. Write tests for the CURRENT behavior first (so you can verify the refactor does not change results).
5. Implement the optimization. Verify tests still pass.
6. Use `/plan` after your spec is reviewed. The planning tool is particularly useful here because the optimization touches multiple functions.

**LLM usage:** After writing your spec, ask the LLM to interview you: "I want to optimize a function that iterates stores 4 times per household. Ask me questions about my approach."

### Issue #8: Clean up redundant functions (1-2 students)

**Type:** Codebase cleanup

1. Map out every function that accesses households or stores:
   - `repository/db_repository.py`: `get_households()`, `get_food_stores()` (sync psycopg2)
   - `abm/geo_model.py`: reads from model parameters
   - `api/routes.py`: direct asyncpg queries
2. For each, document: What does it return? Who calls it? Is it actually used? Also check the three entry points (`api_server.py`, `server.py`, `food_access_model/main.py`) for overlap.
3. Write an **ADR**: "Which data access pattern should we standardize on?" Consider: FastAPI is async-native, so asyncpg is preferred.
4. Remove unused/redundant functions. Consolidate entry points if the team agrees.

**LLM usage:** Ask the LLM to help trace callers: "Where is `get_households()` from `db_repository.py` called?" Verify by grepping yourself.

### Issue #9: Improve logging (1 student)

**Type:** Infrastructure

1. Read the current logging patterns across the codebase:
   - `routes.py` uses `logging.info` and `logging.error`
   - `api_server.py` and `geo_model.py` use `print()` with `flush=True`
   - `server.py` sets up its own custom logger
   - No consistent format, no shared config
2. Write a **logging configuration spec** before changing any files: log level env var, structured format, which level for which events.
3. Replace all `print()` statements with appropriate logging calls.
4. Guidelines: `logging.info` for service lifecycle, `logging.debug` for query details, `logging.error` for exceptions. NEVER log passwords, API keys, or full SQL with user data.

**LLM usage:** Ask "What are best practices for structured logging in a FastAPI application?" Use the answer as a reference, but implement it yourself.

## Review protocol

Every PR gets all three layers:

1. **CI checks** must pass (automated)
2. **Peer review** by one teammate (substantive comments)
3. **LLM adversarial review** by a different student (fresh session, skeptical prompt, findings posted as PR comments marked "Valid" or "False positive (because...)")

The adversarial reviewer rotation: each person reviews the next person in the list (A reviews B, B reviews C, C reviews D, D reviews A). The adversarial reviewer is always different from the peer reviewer. You are responsible for completing your adversarial review within 48 hours of the PR being opened.

## Solo work: your first feature

This is the first week you build something new. Your vision plans identified real problems with FEAST. We turned them into issues. Pick one and ship it.

### How to pick

1. Browse the issues labeled `phase:week-3` in both repos:
   - [FEAST-backend issues](https://github.com/FoodAccessSimulator/FEAST-backend/issues)
   - [FEAST-frontend issues](https://github.com/FoodAccessSimulator/FEAST-frontend/issues)
2. Pick one that matches your comfort level and interest
3. Comment on the issue: "I'm picking this up."
4. Write a one-paragraph plan in the issue comment before coding
5. Implement it. Open a PR (all three review layers apply).

### Feature issues (from your vision plans)

**Backend** (in `FoodAccessSimulator/FEAST-backend`):

| Issue | What | Size | Good for |
|-------|------|------|----------|
| [#19](https://github.com/FoodAccessSimulator/FEAST-backend/issues/19) | Profile and optimize simulation step performance | Medium | Someone comfortable with profiling and multiprocessing |
| [#20](https://github.com/FoodAccessSimulator/FEAST-backend/issues/20) | Speed up simulation instance creation | Small | Anyone with SQL experience |

**Frontend** (in `FoodAccessSimulator/FEAST-frontend`):

| Issue | What | Size | Good for |
|-------|------|------|----------|
| [#1](https://github.com/FoodAccessSimulator/FEAST-frontend/issues/1) | Export simulation results (CSV download, map screenshot) | Medium | Someone who wants to work across UI and data |
| [#3](https://github.com/FoodAccessSimulator/FEAST-frontend/issues/3) | Household details on hover (MFAI, income, store count) | Small | Good first frontend issue, Leaflet tooltips |
| [#4](https://github.com/FoodAccessSimulator/FEAST-frontend/issues/4) | Improve instance management UX with guidance | Small | Good first frontend issue, mostly HTML/text |

### Still good candidates from the maintenance backlog

- Any remaining flake8 fixes from #4
- `print()` to `logging` conversions (related to #9)
- Documenting magic numbers in `household.py`
- Small issues you filed in Week 1

## LLM rules for this week

**Newly allowed this week:**
- Spec writing with LLM assistance (use the "interview first" pattern: describe the problem, let it ask questions, use the questions to strengthen your spec)
- Adversarial review of your own PR in a fresh session before requesting peer review
- Structured planning tools (`/plan` or equivalent) on your assigned issue
- Iterative spec refinement: push back on complexity, ask about best practices, ask "what's the simplest version that solves this?"

**Still not allowed:**
- Accepting generated code without reading and understanding every line
- Using the LLM to write your entire spec or ADR for you (it helps you think, you write)

**The rule that doesn't change:** You must be able to explain every line in your PR without looking at your chat history.

## Deliverables

- [ ] **Spec for assigned issue** -- ADR or diagnosis paragraph posted in the issue comment before coding
- [ ] **PR for assigned issue** -- passing CI + peer review + adversarial LLM review before merge
- [ ] **1 adversarial review completed** -- fresh session, findings posted as PR comments with Valid/False positive labels
- [ ] **1 PR reviewed** (peer review) -- read the diff, post at least one substantive comment
- [ ] **Feature or solo work PR** -- pick a feature issue from the vision plan backlog (or maintenance issue), paragraph plan in issue comment, all three review layers
- [ ] **Roadmap nominations** -- comment on 1-2 issues for Weeks 4-5 priorities with reasoning

### Quality signals

Your PR is ready for review when:
- It does one thing and the title says what
- The PR template is filled in (summary, changes, test plan, tradeoffs, checklist)
- It links to the issue with "Closes #N"
- CI passes
- A spec or diagnosis exists in the issue comment
- You can explain every line without looking at chat history

Your adversarial review is useful when:
- You used a fresh session with no prior context
- Each finding is labeled "Valid" or "False positive (because...)"
- False positive explanations show you understood the code, not just dismissed the finding

## Resources

- Guide 01: [Environment setup](../guides/01-environment-setup)
- Guide 05: [Writing tests](../guides/05-writing-tests)
- ADR template: `templates/adr-template.md`
- PR template: `.github/pull_request_template.md`
