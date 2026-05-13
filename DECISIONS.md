---
layout: default
title: "Design Decisions"
---

# Decisions Log

Curriculum and structural design decisions for the FEAST_edu repository. Each entry documents a choice that shapes how the onboarding program works and why we made it. Future adapters should read these before modifying the pattern.

For the ADR template used in the FEAST application repos, see `templates/adr-template.md`.

---

## DEC-005: Deployment Configuration, Claude Code Planning Workflows, and Agentic Engineering Framing

**Date:** 2026-05-08
**Status:** Accepted

**Context:** Three gaps were identified in the post-DEC-004 curriculum:

1. **Deployment topology.** The curriculum covers the three-layer architecture (frontend, backend, database) but never explicitly teaches that these layers are independently deployable and independently configurable. Students encounter configuration confusion piecemeal (CORS errors, `client.js` hardcoding, `.env` DB credentials, staging vs. local) without a unifying mental model. The existing setup scaffold walks students through configuration steps but doesn't explain *why* those steps matter or what happens when layers point at different environments.

2. **Claude Code planning workflows.** The curriculum teaches Claude Code as an explainer (Week 1) and code collaborator (Week 2+), but never covers its structured planning capabilities (`/plan`, `/ultraplan`, `/ultrareview`). These map naturally to existing curriculum themes: "specs before code" (Week 3) and "manual vs. auto-generated artifacts" (Week 4). Without them, the tool progression has a gap between "ask questions about code" and "write code interactively."

3. **Agentic engineering framing.** The curriculum has the right principles ("explain every line," "write code for future you") but lacks the vocabulary to name the distinction between disciplined AI-assisted development and undisciplined prompting. The terms "agentic engineering" (using AI tools as collaborators in a disciplined workflow where the developer maintains understanding and ownership) vs. "vibe coding" (prompting, accepting, running) give students a shared language for the approach the curriculum teaches.

**Decision:** Integrate both topics into existing weeks rather than adding new weeks or sessions.

**Deployment configuration:**
- Week 1: Add a deployment topology diagram and configuration matrix after the three-layer architecture section (~5 min). Introduce the three configuration levers (client.js, .env, CORS). Add setup scaffold callouts and an extra Common Problem entry.
- Week 5: Add a deployment configuration audit exercise (~10 min) and a security checklist item. Revisits the Week 1 mental model with hands-on experience.
- New reference guide: `docs/guides/10-deployment-configuration.md`.

**Planning workflows:**
- Week 2: Brief preview of `/plan` during the iterative code pattern demo (2-3 sentences, no new subsection).
- Week 3: Expand "specs before code" to include a `/plan` demo alongside hand-written specs (~5 min added). Add `/plan` usage notes to the #47 and #74 scaffolds.
- Week 4: New subsection "Planning at different scales" covering `/plan` vs. `/ultraplan` vs. `/ultrareview` (~10 min). Add planning note to the reporting feature scaffold.
- Week 5: Add `/ultrareview` to the review pipeline retrospective.
- New reference guide: `docs/guides/11-planning-with-claude-code.md`.

**Agentic engineering framing:**
- Week 1: New "Agentic engineering vs. vibe coding" subsection (~3 min) before the existing tool rules. Defines both terms, frames the entire curriculum approach. The existing "explain every line" rule becomes the practical test for agentic engineering.
- Week 2: Brief callback connecting the iterative code pattern to agentic engineering terminology.
- Week 6: Added retrospective questions about when students caught themselves vibe coding and what pulled them back. Handoff document asks for concrete examples.
- "What Success Looks Like" section updated to include agentic engineering as a student outcome.

Also fixed the environment setup guide (01) for consistency with the curriculum (run_local.py instead of api_server.py, port 8000, client.js instead of VITE_API_URL).

**Alternatives considered:**
- *Dedicated "deployment" week.* Rejected because deployment is better understood as context for existing work, not a standalone topic. A separate week would feel disconnected from the daily development experience.
- *Cover `/plan` from Week 1.* Rejected because the progressive LLM usage model (DEC-002) requires students to build reading and spec-writing skills before getting planning tools. `/plan` before Week 3 would shortcut the spec-writing practice.
- *Skip `/ultraplan` and `/ultrareview` entirely.* These are newer features and could be left as "students discover them." Rejected because they connect directly to Week 4's theme of project-level artifacts and Week 3's adversarial review rotation. Explicit coverage makes the connection clear.
- *Introduce "agentic engineering" terminology later (Week 3+).* Rejected because the framing is most useful at the start, when students are forming their habits. Naming the approach from Week 1 gives a shared vocabulary the instructor can reference throughout.

**Consequences:**
- (+) Students have a deployment mental model from Week 1 that explains the CORS/config errors they inevitably encounter during setup
- (+) The planning tool progression (preview in Week 2, single-feature in Week 3, project-level in Week 4) mirrors the existing manual spec-writing progression
- (+) `/plan` reinforces rather than replaces hand-written specs: the recommended workflow is "write the what, let the tool map the how"
- (+) "Agentic engineering" gives students a shared vocabulary for the disciplined approach; "vibe coding" gives a name to the anti-pattern they'll be tempted by
- (+) Environment setup guide is now consistent with the curriculum (was using legacy api_server.py)
- (-) Week 1 lesson time increases by ~5 min (now ~75 min total, tight but within tolerance)
- (-) Week 3 and Week 4 lesson times each increase by ~5-10 min (absorbed from guided work time)
- (-) Week 5 lesson time increases by ~10 min for the deployment audit (offset by existing "deployment readiness" topic that was previously content-free)

---

## DEC-004: Curriculum Restructuring to Integrate Tooling, Review Pipelines, and Project Management Artifacts

**Date:** 2026-05-07
**Status:** Accepted

**Context:** The original 6-week curriculum treats agentic coding tools, code review, and project management artifacts as mid-to-late topics. Agentic tools get a 5-minute mention in Week 1; structured review starts in Week 3; ADRs appear in Week 4. This pacing means students submit PRs for two weeks with no automated checks and no structured review, and don't encounter project management frameworks until halfway through. Three specific gaps were identified:

1. **Agentic coding tools.** Claude Code is never named or set up. CLAUDE.md is in the templates but not taught. Students have no awareness of the tool landscape (Gemini CLI, Cursor, Copilot).
2. **Automated + human code review.** The review pipeline (CI checks, peer review, LLM adversarial review) doesn't fully exist until Week 3. Weeks 1-2 PRs go through with minimal feedback.
3. **Project management artifacts.** ADRs, roadmaps, and the distinction between manually written vs. LLM-generated versions of these artifacts aren't covered until Week 4, after students have already been making undocumented design decisions.

The overriding design constraint: get students contributing real work as soon as possible. If front-loading more educational content into Weeks 1-2 accomplishes that, the tradeoff is worth it.

**Decision:** Restructure the curriculum to integrate all three topics earlier, with a progression from manual to tool-assisted:

**Week 1 changes:**
- Expand "How LLM tools fit" from 5 min to 20 min. Rename to "Agentic coding tools: setup and the landscape." Cover Claude Code, Gemini CLI, Cursor, Copilot. Demo CLAUDE.md as both documentation and agent configuration. Include a brief hands-on comparison if students have access to multiple tools.
- Add Claude Code (or best-available agentic tool) to the setup scaffold, alongside repo cloning. Tool access depends on what's available via GitHub educational accounts; the scaffold handles multiple paths.
- Plant the project management artifacts seed (5 min): show CLAUDE.md, ROADMAP.md, DECISIONS.md in the FEAST_edu repo. No deep dive; just establish they exist.
- Solo work: students create a CLAUDE.md in their FEAST repo fork.
- Trim the architecture step lifecycle from 15 to 10 min (students learn it better by tracing it themselves). Net lesson time increase: ~10 min.

**Week 2 changes:**
- Restructure group session (30 min to 40-45 min). Add review pipeline introduction (15 min): explain the three layers (automated CI, human peer review, LLM adversarial review added Week 3). Demo a GitHub Actions linting workflow.
- Require peer review on all Week 2 PRs (previously deferred to "reviewed as a group in Week 3").
- Reorder linting scaffold (#24) to prioritize CI setup first, then fixes. Once CI exists, every subsequent PR gets automated checks.
- Introduce ADRs (5 min). Show the template. The linting student writes an ADR for their configuration choices.
- Tighten edge-case brainstorming demo from ~15 to ~10 min.

**Week 3 changes:**
- Adversarial review demo adds a formalized manual LLM review rotation: each PR gets a designated reviewer who runs adversarial review in a fresh session and posts findings. No CI-based automation for now.
- Require ADR-format specs for #74 (optimization) and brief diagnosis write-ups for #47 (bug fix).

**Week 4 changes:**
- Reframe topic from "ADRs" to "Project management artifacts: manual vs. auto-generated." Students have been writing ADRs since Week 2; this session goes deeper.
- Demo generating an ADR from a diff/PR using Claude Code. Compare manual vs. generated. Discuss when each is appropriate.
- Cover roadmap maintenance and CLAUDE.md updates.

**Week 5 changes:**
- Add review pipeline retrospective (10 min): what's the CI catching, what are humans catching, what's the LLM catching? Adjust process if needed.
- CLAUDE.md audit: each student reviews and updates theirs.

**Week 6 changes:**
- Handoff document adds tool configuration handoff and process retrospective sections.

**ADR progression (cross-cutting):**
- Weeks 2-3: Manual ADR writing. Students learn the structure and practice articulating reasoning.
- Week 4: Introduce LLM-generated ADRs from diffs and PRs. Compare to manual. Students review and edit generated ADRs.
- Weeks 5-6: Students choose manual vs. assisted based on decision complexity. Generation from diff/PR context is part of the standard workflow.

**Alternatives considered:**
- *Keep ADRs in Week 4, review in Week 3, tools as-is.* Simpler change, but leaves the two-week gap where PRs have no structured review, and students make design decisions without a framework for documenting them.
- *Move everything to Week 1.* Too much for a single session. Week 1 is already the densest week and needs to focus on "get the project running and understand what it does."
- *Automated LLM review via GitHub Action.* More powerful but adds infrastructure complexity. Manual rotation is sufficient for a 5-person cohort and teaches the skill more directly. Can revisit for larger cohorts.

**Consequences:**
- (+) Students have CI checks and peer review from their first code PR (Week 2)
- (+) Agentic tools are set up and configured from Week 1, not introduced as a late topic
- (+) ADR writing is practiced repeatedly before the "manual vs. auto-generated" lesson, so the comparison is grounded in experience
- (+) The review pipeline matures incrementally (CI in Week 2, peer review in Week 2, LLM adversarial in Week 3) rather than arriving fully formed in Week 3
- (+) CLAUDE.md creation in Week 1 gives students ownership of their development environment early
- (-) Week 1 lesson time increases by ~10 min (70 min total, still within tolerance)
- (-) Week 2 lesson time increases by ~15 min (45 min total, absorbed from guided work time)
- (-) Tool access logistics are uncertain; the setup scaffold must handle multiple paths depending on what's available via educational accounts
- (-) More ADR writing across Weeks 2-4 risks ADR fatigue if not scoped carefully (mitigated by keeping early ADRs short and directly tied to the student's own work)

---

## DEC-001: Dedicated Repo for Instructional Materials

**Date:** 2026-05-06
**Status:** Accepted

**Context:** The FEAST project has two application repos (backend, frontend). Instructional materials could live in one of those repos, in a shared wiki, in external docs, or in a dedicated repo. We need a home for the 6-week curriculum, guides, slides, and templates that doesn't interfere with student development workflows in the code repos.

**Decision:** Use a dedicated `FEAST_edu` repo for all instructional materials, separate from the application code.

**Alternatives considered:**
- *Docs folder in the backend repo.* Ties instructional materials to one side of the stack. Clutters the dev workflow with non-code changes.
- *GitHub wiki.* Not versionable through normal git workflows, no PR review process, harder to track changes over time.
- *Notion/Google Docs.* Easy to collaborate on but not versionable, not portable, can't demonstrate the project management pattern we're teaching.

**Consequences:**
- (+) Instructional materials have their own commit history, branches, and review cycle
- (+) The repo itself demonstrates the project management workflow that students will use
- (+) Cleanly separable from application repos, making reuse for other domains straightforward
- (-) Templates must be manually copied into the FEAST repos for each cohort
- (-) Code references (file paths, line numbers) in guides can drift as the FEAST codebase evolves and must be re-verified before each cohort

---

## DEC-002: Progressive LLM Usage Model

**Date:** 2026-05-06
**Status:** Accepted

**Context:** Students range from freshmen to seniors. LLM code generation tools can shortcut the learning process. Anthropic's 2026 RCT with 52 junior engineers found that students who delegated code generation early scored 17% lower on comprehension. We need a policy that lets students benefit from LLMs without skipping skill-building.

**Decision:** Restrict LLM usage in early weeks and progressively unlock capabilities:
- Weeks 1-2: LLM as explainer only (ask questions about existing code, not for code generation)
- Weeks 3-4: LLM for spec review, edge case brainstorming, adversarial PR review
- Weeks 5-6: Full LLM workflow including design discussion and guided code generation

The constant across all weeks: "You must be able to explain every line in your PR without looking at your chat history."

**Alternatives considered:**
- *Full access from day one.* Faster output, but freshmen skip developing code-reading skills entirely. Supported by the Anthropic research showing comprehension gaps.
- *No LLM tools at all.* Misses the pedagogical goal of teaching LLM-assisted development as a professional skill. Students will use these tools regardless; better to teach good habits.
- *Honor system with full access.* Unenforceable and creates social pressure on students who want to follow the rules but see peers bypassing them.

**Consequences:**
- (+) Students build code-reading and reasoning skills before getting code-generation power
- (+) Each week's unlock feels earned, maintaining engagement
- (+) Adversarial review skills (week 3) are established before full generation access (week 5)
- (-) Experienced students may feel held back in weeks 1-2 (mitigated by assigning harder analysis tasks to S-tier students)
- (-) Requires instructor attention to enforce, since LLM usage is difficult to monitor directly

---

## DEC-003: Built-in Project Management as Pedagogical Pattern

**Date:** 2026-05-06
**Status:** Accepted

**Context:** We want this curriculum to be adaptable for other projects and domains. Beyond the content itself, the repo structure and development workflow should be something others can copy. We also want to practice what we preach: if we tell students to use CLAUDE.md and track decisions, the repo that teaches them should do the same.

**Decision:** Use CLAUDE.md, ROADMAP.md, DECISIONS.md, and a post-commit hook in this repo. Track the development of the instructional materials using the same lightweight workflow we teach students to use in the FEAST repos.

**Alternatives considered:**
- *GitHub Issues/Projects only.* Standard tooling but doesn't demonstrate anything specific to LLM-assisted development workflows. Issues live outside the repo, making the pattern less self-contained.
- *External project management (Linear, Notion).* Adds a dependency, login barrier, and separates planning from the materials they describe. Reduces portability.

**Consequences:**
- (+) The repo is a self-contained example of the pattern it teaches
- (+) Future adapters can fork the repo structure, not just the content
- (+) Decisions are tracked in version control alongside the materials they affect
- (-) Adds maintenance overhead to keep ROADMAP.md current (mitigated by the post-commit hook nudge)
- (-) Small team (primarily one instructor) means the overhead must stay genuinely lightweight or it won't stick
