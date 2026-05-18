---
layout: default
title: "README"
---

# FEAST Educational Materials

Instructional materials for the [FEAST](https://fassfrontstage.pods.icicleai.tapis.io/) (Food Equity Access Simulation Technology) student developer onboarding program. A six-week curriculum that teaches LLM-assisted development practices while students make real contributions to a food access simulation tool.

**Live site:** [uw-madison-dsi.github.io/FEAST_educational_materials](https://uw-madison-dsi.github.io/FEAST_educational_materials/)

## What this is

This repo contains everything an instructor needs to run a cohort of student developers through the FEAST onboarding program: a master curriculum, scaffolded guides, presentation slides, repo templates, and reference materials. It contains no application code.

The FEAST application lives in two separate repos:
- **Backend:** [ICICLE-ai/Food-Access-Model](https://github.com/ICICLE-ai/Food-Access-Model) (FastAPI + Mesa ABM + PostgreSQL)
- **Frontend:** fass-frontend (React + Leaflet + Vite)
- **Reference deployment:** [feast-test.services.dsi.wisc.edu](https://feast-test.services.dsi.wisc.edu/)

## How the program works

Students spend six weeks progressing from "run the project and understand what it does" to "independently plan and ship improvements." Each week has a group session (30-50 min) and async solo work.

**Key design decisions:**

- **Progressive LLM access.** Weeks 1-2: LLM as explainer only. Weeks 3-4: spec review, edge case brainstorming, adversarial PR review. Weeks 5-6: full LLM workflow including guided code generation. The constant rule: you must be able to explain every line without looking at your chat history.
- **Three-layer review pipeline.** CI checks (from Week 2), peer review (from Week 2), and LLM adversarial review (from Week 3) build incrementally so students never submit PRs without structured feedback.
- **ADR progression.** Students write Architecture Decision Records manually in Weeks 2-3, then learn to generate them from diffs/PRs with LLM tools in Week 4, and choose the right approach for each situation in Weeks 5-6.
- **Agentic tools from day one.** A CLI agent (Claude Code if available, Gemini CLI as a free alternative) is installed in Week 1. Students create a project context file for their FEAST repo fork as part of their first solo work.

See [DECISIONS.md](DECISIONS.md) for the full rationale behind these and other curriculum choices.

## Repo structure

```
STUDENT_ONBOARDING_PLAN.md    Master 6-week curriculum
CONTENT_MAP.md                Maps curriculum sections to slide deck slides
docs/guides/
  01-environment-setup.md     Environment setup
  02-issue-filing.md          Filing good issues
  03-type-hints.md            Adding type hints
  04-linting-setup.md         Setting up linting
  05-writing-tests.md         Writing tests
  06-bug-investigation.md     Investigating bugs
  07-optimization.md          Optimizing performance
  08-adversarial-review.md    Adversarial code review
  09-self-directed-work.md    Self-directed work
  10-deployment-configuration.md  Deployment configuration
  11-planning-with-claude-code.md Structured planning with CLI agents
  12-agentic-engineering-concepts.md Agentic engineering concepts
  13-agentic-workflow-best-practices.md Agentic workflow best practices
slides/
  week-1/                     Week 1 slide deck (self-contained HTML)
templates/
  CLAUDE.md                   CLAUDE.md template for FEAST repos
  CONTRIBUTING.md             Contributing guide template
  adr-template.md             ADR template
  vision-plan-template.md     Vision and improvement plan template (Week 1 homework)
references/
  README.md                   Annotated bibliography
.github/
  ISSUE_TEMPLATE/             Bug report, enhancement, refactor templates
  pull_request_template.md    PR template
  workflows/pages.yml         GitHub Pages deployment
```

## Using these materials

**To run a cohort:**

1. Fork or clone this repo.
2. Copy templates from `templates/` into the FEAST application repos (backend and frontend).
3. Verify FEAST code references (file paths, line numbers in guides) against the current codebase state.
4. Review [STUDENT_ONBOARDING_PLAN.md](STUDENT_ONBOARDING_PLAN.md) for the full week-by-week plan.
5. Open the [Week 1 slides](slides/week-1/) for the first group session.

**To adapt for a different project:**

This repo is designed as a replicable pattern. The curriculum structure, project management files (CLAUDE.md, ROADMAP.md, DECISIONS.md), guide scaffolding, and review pipeline progression are domain-agnostic. The FEAST-specific content is in the domain sections of the curriculum, the code references in guides, and the slide deck examples. See [DECISIONS.md](DECISIONS.md) to understand why the program is structured the way it is before modifying it.

## Keeping materials in sync

The curriculum (`STUDENT_ONBOARDING_PLAN.md`) and slide decks share overlapping content. [CONTENT_MAP.md](CONTENT_MAP.md) documents which sections map to which slides and lists specific shared values (URLs, scores, thresholds, line references) that must stay consistent. Consult it after modifying either source.

## Project management

This repo uses the same lightweight project management pattern it teaches:

- **[ROADMAP.md](ROADMAP.md)** tracks milestones and progress
- **[DECISIONS.md](DECISIONS.md)** records curriculum design decisions with context and rationale
- **[CLAUDE.md](CLAUDE.md)** serves as both developer documentation and AI agent configuration
- A post-commit hook reminds about ROADMAP.md updates

## Deployment

The site is built with Jekyll and deployed to GitHub Pages via GitHub Actions. Pushing to `main` triggers a rebuild automatically.

## Credits

Developed at the [UW-Madison Data Science Institute](https://dsi.wisc.edu). The FEAST application was originally developed under the [ICICLE AI Institute](https://icicle.ai/) (NSF).
