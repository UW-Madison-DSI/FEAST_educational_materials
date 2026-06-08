---
layout: default
title: "Week 5 Assignment"
---

# Week 5 Assignment

**Due before:** Week 6 session
**Team:** All students
**Tools:** Claude Code or your CLI agent of choice
**Time estimate:** ~6-8 hours total (including group session work time). Integration and polish. Track your time.
**Questions?** Email me.

## Overview

This is the second-to-last week. The focus is integration, security, and cleanup. Leave the codebase in a state where the next cohort can pick it up cleanly. You also prepare for the Week 6 handoff by tagging issues and reflecting on what you shipped.

## Your assigned issue

### Security hardening (1 student, any level)

**Type:** Security audit + fixes

Run through this checklist. Fix what you can; file issues with context for the rest.

- [ ] **Input validation:** Add Pydantic models for all POST/DELETE endpoints that accept user input (`routes.py:191`, `308`, `352`)
- [ ] **CORS:** Consolidate entry points and make CORS origins configurable via env var. Currently `food_access_model/main.py` hardcodes two origins; `api_server.py` hardcodes a different one.
- [ ] **SQL:** Audit all raw SQL for injection risks. Both `routes.py` (asyncpg) and `db_repository.py` (psycopg2) execute queries. Check for string concatenation in query construction.
- [ ] **Rate limiting:** The advance endpoint (`routes.py:155`) triggers expensive multiprocessing computation. Should it have rate limiting? What happens if two advance requests run concurrently?
- [ ] **Env vars:** Verify `.env.example` is complete and `.env` is in `.gitignore`
- [ ] **Auth:** There is currently zero authentication on any endpoint. Document whether this is acceptable for the deployment context (university research tool vs. public-facing).
- [ ] **Deployment configuration:** Verify each layer's configuration points are documented and environment-appropriate. No local `.env` files should contain staging/production credentials. `client.js` baseURL should not point at production in dev branches.

**LLM usage:** Use the adversarial review to scan for issues you missed: "Review this file for OWASP Top 10 security risks. Be thorough." Then evaluate each finding yourself. Not every finding is a real risk in FEAST's deployment context. Document which ones are real and which are theoretical.

### Issue #63: Unit conversion consistency (1 student)

**Type:** Audit + fix

Audit all distance calculations in the codebase:

- `household.py`: `calculate_distances()` (line 246) computes distances using `self.model.space.distance()` which returns meters (EPSG:3857)
- `household.py`: `stores_with_1_miles()` (line 131) compares to 1.0 (miles)
- `household.py`: `get_closest_cspm`/`spm` return distances in... what unit? Are they consistently miles or meters?
- `constants.py`: `SEARCHRADIUS = 500` (in what unit? meters? miles?)
- `household_constants.py`: center point and radius (15km) for county bounds
- `api/helpers.py`: polygon generation uses meters (50m, 25m, 20m)
- The `bc_pantries` branch uses direct Euclidean distance from centroid coordinates instead of Mesa's `GeoSpace.distance()`

Document every conversion and verify consistency. Write tests that assert expected distances for known coordinates. Pay special attention to the CRS inconsistency: households are EPSG:4326 (degrees), stores are EPSG:3857 (meters). Distance math on mixed CRS will produce garbage.

**LLM usage:** Ask the LLM to help trace all distance-related code paths. Verify every finding by reading the code yourself.

### PR cleanup and integration (all students)

This is not optional. Every student participates:

- **Merge all open PRs from Weeks 2-4.** If a PR has unresolved feedback, resolve it or close the PR with a comment explaining why.
- **Fix CI** if anything is broken. A red CI on the main branch blocks everyone.
- **Clean stale branches.** The repo has accumulated branches from weeks of work. Delete any branch whose PR is already merged.
- **Resolve review debt.** If you owe a peer review or adversarial review, complete it before starting new work.

## Context file and artifact audit

Every student:

1. **Update your project context file.** Does it reflect the current state of the codebase? If it still describes things that have been fixed or changed, update it.
2. **Review your ADRs.** Are they still accurate? Has any decision been superseded by later work? Mark superseded ADRs with a status update.
3. **Commit your updates.** This is a deliverable.

## The full pipeline (unchanged)

Every issue this week follows the same cycle:

1. **File/claim the issue**
2. **Write a spec** (even a short one for security items)
3. **Build + test**
4. **Review** (all three layers)
5. **Merge**

## Review protocol

Same as Weeks 3-4. Every PR gets all three layers:

1. **CI checks** must pass (automated)
2. **Peer review** by one teammate (substantive comments)
3. **LLM adversarial review** by a different student

During the group session we will evaluate how well the pipeline is working and agree on any changes.

## Solo work

Full autonomy. Pick the highest-impact thing you can finish this week and ship it.

**If nothing on the board excites you:** scan the codebase for something that bugs you. File it and fix it.

**High-value targets if you need direction:**
- Write tests for API endpoints (`routes.py`) using FastAPI TestClient
- Add missing validation to POST endpoints
- Improve error messages for common failure modes
- Frontend: add loading states, error handling for API failures
- Frontend: replace window-object state with proper React state management
- Frontend #10: Move the API base URL from hardcoded `client.js` to an environment variable (`VITE_API_URL`)
- Start a benchmarking script for #51 (simulation runtime) as a handoff artifact
- Consolidate the three backend entry points into one

## LLM rules for this week

**Full access.** By Week 5 you have the judgment to use these tools responsibly. All previous capabilities remain available. The rules that do not change:

- You must be able to explain every line in your PR without looking at your chat history
- Auto-generated artifacts (ADRs, specs) must be reviewed and edited before submission
- The agent does not decide what to build. You decide what and why. The agent helps with how.

## Week 6 preparation

Do this before the Week 6 session:

- [ ] **Tag 2-3 issues** as "recommended for next cohort" with a comment explaining why and what context the next team needs
- [ ] **Pick your demo.** One thing you shipped. Not a presentation, just show the working feature or fix. ~3 minutes per person.
- [ ] **Start thinking about the retro.** What worked? What did not? What would you tell the next cohort about working with AI tools?

## Deliverables

- [ ] **Assigned issue PR** (security hardening or #63) -- passing CI + peer review + adversarial review
- [ ] **PR cleanup** -- all open PRs from prior weeks resolved (merged or closed with explanation)
- [ ] **Review debt cleared** -- all owed peer and adversarial reviews completed
- [ ] **Context file updated** -- reflects current codebase state, committed
- [ ] **ADR audit** -- superseded decisions marked, committed
- [ ] **1 solo work PR** -- highest-impact thing you can ship, full pipeline
- [ ] **2-3 issues tagged for next cohort** -- with context comments
- [ ] **Demo selected** -- know what you are showing in Week 6

### Quality signals

Your PR is ready for review when:
- It does one thing and the title says what
- The PR template is filled in
- It links to the issue with "Closes #N"
- CI passes
- You can explain every line without looking at chat history

For security hardening specifically:
- Each checklist item is addressed (fixed, filed as issue, or documented as acceptable)
- Findings from the adversarial security scan are evaluated (real risk vs. theoretical in FEAST's context)

## Resources

- Guide 01: [Environment setup](../guides/01-environment-setup)
- Guide 08: [Adversarial review](../guides/08-adversarial-review)
- Guide 10: [Deployment configuration](../guides/10-deployment-configuration)
- Guide 13: [Agentic workflow best practices](../guides/13-agentic-workflow-best-practices)
- ADR template: `templates/adr-template.md`
- PR template: `.github/pull_request_template.md`
