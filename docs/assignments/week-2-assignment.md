---
layout: default
title: "Week 2 Assignment"
---

# Week 2 Assignment

**Due before:** Week 3 session
**Team:** Senior developers
**Tools:** Claude Code or your CLI agent of choice
**Time estimate:** ~6-8 hours total (including group session work time). Track your time so we can calibrate.
**Questions?** Email me.

## Overview

This week you ship your first real PR. Each student has an assigned issue that maps to one of three tracks: linting and CI, type hints, or testing. You also review a teammate's PR, file new issues, and update your project context file with the team priorities from the convergence board.

## Your assigned track

### Track A: Linting and CI (1 student, Issue #4)

**Priority:** Ship CI first so everyone else's PRs get automated checks.

**Guide:** `docs/guides/04-linting-setup.md`

1. Add flake8 to dev dependencies in `pyproject.toml`
2. Create a `.flake8` config file (ignore E501, max-complexity 10)
3. Add a GitHub Actions workflow that runs flake8 on PRs. **This is your first PR. Get it reviewed and merged before step 4.**
4. Run flake8 on the codebase. Fix the files you can handle in ~45 minutes. Create a `.flake8` exclude list for the rest.
5. Add eslint check for the frontend (it already has `eslint.config.js`)
6. Write an ADR (using `templates/adr-template.md`) documenting your linting configuration choices: which rules you enforced, which you excluded, and why. Put it in `docs/decisions/` in the FEAST repo.

**LLM usage:** Ask the LLM to explain what each flake8 error code means if you encounter one you don't recognize. Don't ask it to fix the code for you.

### Track B: Type hints (2-3 students, Issues #1, #2, #3)

**Guide:** `docs/guides/03-type-hints.md`

Each student takes one module area:

| Issue | Files | Student level |
|-------|-------|---------------|
| #1 | `household.py`, `store.py`, `geo_model.py` (ABM files) | J student |
| #2 | `routes.py`, `helpers.py`, `api_server.py` (API files) | J student |
| #3 | `get_data.py`, `household_constants.py` (preprocessing) | S student |

For each function in your assigned files:
1. Read the function. Understand what it takes and returns.
2. Add parameter type hints and return type hints.
3. Use modern Python syntax: `list[dict]` not `List[Dict]`, `str | None` not `Optional[str]`
4. Add a one-line docstring only if the function name isn't self-explanatory.

**LLM usage:** You can ask "What type does this function return?" if unclear from the code. Verify by reading the callers. Don't ask the LLM to add all the type hints for you.

### Track C: First tests (1 S student)

**Guide:** `docs/guides/05-writing-tests.md`

1. Set up pytest and pytest-asyncio in `pyproject.toml` dev dependencies
2. Create `tests/` directory with `__init__.py` and `conftest.py`
3. Write tests for pure functions in `household.py`:

   **`has_resources()` (line 169):**
   - Income < $10,000 returns False (any household size)
   - Household size >= 2 and income < $15,000 returns False
   - Household size >= 3 and income < $25,000 returns False
   - Income = $25,001, household size = 3 returns True
   - Exact boundary values ($10,000, $15,000, $25,000)

   **`get_monthly_trip_count()` (line 178):**
   - Resources + vehicles = 7
   - Resources + no vehicles = 8
   - No resources = 6

   **`get_color()` (line 57):**
   - Low MFAI (40) produces red
   - Mid MFAI (70) produces green-ish
   - High MFAI (100) produces green
   - Boundary at normalized = 0.5

4. Run tests: `uv run pytest tests/ -v`
5. Run mutation testing: `uv run mutmut run --paths-to-mutate=food_access_model/abm/household.py`

**LLM usage:** After writing your tests, describe the function to the LLM and ask "What edge cases might I be missing?" Add any good suggestions. This is the "interview first" pattern from the group session.

## Solo work

After finishing your assigned issue, extend the same skill to new territory:

| If your assigned work was... | Your solo hunting ground is... |
|------------------------------|-------------------------------|
| Type hints (#1 ABM files) | Add type hints to `repository/db_repository.py`, `model_multi_processing/batch_running.py` |
| Type hints (#2 API files) | Add type hints to `api/helpers.py`, clean up the duplicate entry points (`api_server.py`, `server.py`) |
| Type hints (#3 preprocessing) | Add type hints to root-level `constants.py`, `parallel_scheduler.py`, `insert_stores.py` |
| Linting (#4) | Fix flake8 warnings in files you excluded in your first pass |
| Tests (household.py) | Write tests for `Store` class, `convert_centroid_to_polygon` in `api/helpers.py` |

File issues for anything you can't fix but notice along the way. Keep building the backlog.

## LLM rules for this week

**Newly allowed this week:**
- Edge case brainstorming ("What edge cases should I test for this function?")
- Type hint questions ("What type does this function return?")
- Error explanation ("What does this flake8 error code mean?")
- ADR draft assistance (the linting student can ask for help structuring the ADR, then edit it)
- Interactive code refinement (the five-step iterative pattern from the group session)

**Still not allowed:**
- Asking the LLM to write functions or tests from scratch
- Accepting generated code without reading and understanding every line
- Using planning tools independently (that's Week 3)

**The rule that doesn't change:** You must be able to explain every line in your PR without looking at your chat history.

## Deliverables

- [ ] **PR for assigned issue** -- passing CI (once #4 merges) + at least one peer review before merge
- [ ] **At least 2 new issues filed** -- things you discover while working; type + area labels
- [ ] **1 PR reviewed** -- read the diff, post at least one substantive comment
- [ ] **Updated project context file** -- add Team Priorities section with convergence board results and area labels (in the shared repo file, not just your personal one)

### Quality signals

Your PR is ready for review when:
- It does one thing and the title says what
- The PR template is filled in (summary, changes, test plan, tradeoffs, checklist)
- It links to the issue with "Closes #N"
- CI passes (or CI doesn't exist yet because you're the linting student and this IS the CI PR)
- You can explain every line without looking at chat history

Your PR review is substantive when:
- You read the diff, not just the description
- You checked for at least one edge case or naming concern
- You left a specific comment (not "LGTM")

## Resources

- Guide 01: [Environment setup](../guides/01-environment-setup)
- Guide 03: [Type hints](../guides/03-type-hints)
- Guide 04: [Linting setup](../guides/04-linting-setup)
- Guide 05: [Writing tests](../guides/05-writing-tests)
- ADR template: `templates/adr-template.md`
- PR template: `.github/pull_request_template.md`
