---
layout: default
title: "Guide: Planning with Claude Code"
---

# Guide: Planning with Claude Code

## Context

Claude Code has structured planning commands that complement the hand-written specs and ADRs you've been writing since Week 2. This guide covers when to use each planning tool and how they fit into the spec-first workflow.

## The Planning Tools

### `/plan` -- Single-feature planning

**What it does:** Given a description of what you want to accomplish, Claude Code explores the codebase and produces a structured plan: which files to change, in what order, what dependencies exist, and how to verify the changes.

**When to use it:**
- You know *what* you want to build and need to map the *how*
- The change touches multiple files and you want to make sure you don't miss any
- You've written a hand-written spec and want a cross-check on your implementation plan

**When NOT to use it:**
- You're still deciding *whether* to do something (write an ADR instead)
- You're exploring or understanding code (just ask Claude Code questions)
- The change is trivial (one file, obvious what to do)

**Example workflow:**
```
1. Write a hand-written spec in the issue comment (the what and why)
2. Run /plan with your spec as context (the how)
3. Review the plan critically:
   - Did it identify files you missed?
   - Did it over-scope the change?
   - Does the order make sense?
4. Revise your plan based on what you learned
5. Implement
```

### `/ultraplan` -- Multi-issue / project-phase planning

**What it does:** Plans across multiple related issues or an entire project phase. Identifies dependencies between issues, proposes implementation ordering, and maps the work across the codebase.

**When to use it:**
- You have a cluster of related issues (e.g., backend API + frontend view + metrics)
- You're starting a new project phase and need to sequence the work
- You want to identify the dependency chain between tasks

**When NOT to use it:**
- Single-feature work (use `/plan` instead)
- Prioritization decisions (that's a human/team judgment call)
- You haven't written specs for the individual issues yet

**Example workflow:**
```
1. Gather the related issues (e.g., #94, #79, frontend #36)
2. Run /ultraplan describing the combined scope
3. Review: Does the dependency ordering make sense?
   Did it identify the API contract that connects the pieces?
4. Use the output to coordinate work across team members
5. Each team member uses /plan for their individual piece
```

### `/ultrareview` -- Branch-level review

**What it does:** Reviews an entire branch's accumulated changes (not just a single PR's diff). Looks for cross-cutting issues that per-PR reviews might miss.

**When to use it:**
- Before merging a long-lived branch to dev or main
- As a complement to the per-PR adversarial review rotation
- When you want a comprehensive check after multiple PRs have landed

**When NOT to use it:**
- For individual PR review (use a fresh Claude Code session with the diff instead)
- As a replacement for human review (it's a supplement, not a substitute)

## How These Fit Together

| Stage | Tool | Purpose |
|-------|------|---------|
| Deciding what to build | Hand-written ADR | Capture the *why* and *what*, document alternatives |
| Planning how to build it | `/plan` | Map files, order, dependencies for one feature |
| Coordinating across features | `/ultraplan` | Sequence multiple issues, find API contracts |
| Implementing | Claude Code (interactive) | Write code with the iterative refinement pattern |
| Reviewing one PR | Fresh Claude Code session | Adversarial review of a single diff |
| Reviewing accumulated work | `/ultrareview` | Cross-cutting review of a branch |

## The Key Principle

`/plan` and `/ultraplan` map *how* to implement something. They do not decide *what* to implement or *whether* it's worth doing. Those decisions belong to you, your team, and your ADRs.

The best workflow pairs human judgment with tool precision:
- **You** write the spec (what and why)
- **The tool** maps the implementation (how and where)
- **You** review the plan (does the how match the what?)
- **You** implement (the tool assists, you own the result)

## LLM Usage by Week

| Week | What's available |
|------|-----------------|
| 2 | `/plan` previewed in demo. Not yet used independently. |
| 3 | `/plan` for cross-checking hand-written specs on assigned issues. |
| 4 | `/plan` independently. `/ultraplan` for multi-issue work. `/ultrareview` introduced. |
| 5-6 | Full access. Choose manual specs vs. `/plan` based on scope and complexity. |
