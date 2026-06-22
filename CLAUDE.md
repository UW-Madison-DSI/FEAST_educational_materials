# CLAUDE.md

## Project Overview

FEAST_edu is the instructional materials repository for the FEAST (Food Equity Access Simulation Technology) student developer onboarding program. It contains the 6-week curriculum, scaffolded guides, presentation slides, templates, and reference materials that instructors use to run LLM-assisted development cohorts.

This repo contains no application code. The FEAST application itself lives in two separate repos:
- Backend: `FoodAccessSimulator/FEAST-backend` (FastAPI + Mesa ABM + PostgreSQL)
- Frontend: `FoodAccessSimulator/FEAST-frontend` (React + Leaflet + Vite)

Templates in `templates/` are designed to be copied into those repos when setting up a new cohort.

This repo is also a demonstration of a lightweight, repo-local project management pattern (CLAUDE.md + ROADMAP.md + DECISIONS.md + post-commit hook) intended to be replicable for other subjects and domains.

## Repo Structure

```
STUDENT_ONBOARDING_PLAN.md    # Master 6-week curriculum
CONTENT_MAP.md                # Maps curriculum sections to slide deck slides (keeps them in sync)
docs/
  guides/                      # Scaffolded student guides (01 through 09)
slides/
  week-1/                      # Week 1 slide deck (self-contained HTML + deck-stage web component)
assets/
  css/                         # Shared design system (design-system.css) + site styles (site.css)
templates/                     # Files to copy into FEAST repos (CLAUDE.md, CONTRIBUTING.md, ADR template)
references/                    # Annotated bibliography of pedagogical and domain resources
.github/                       # Issue and PR templates (for copying into FEAST repos)
ROADMAP.md                     # Milestone tracking
DECISIONS.md                   # Architectural decision log for curriculum design choices
```

## Development Workflow

This repo uses main/dev/feature branch workflow:
- `main`: stable, reviewed materials ready for use with a cohort
- `dev`: integration branch for in-progress work
- Feature branches off `dev`, named descriptively (e.g., `feature/week1-slides`, `fix/guide-typos`)

### Checkpoint-Review-Refine Cycle

After completing a discrete unit of work (a guide, a slide deck, a template):

1. **Checkpoint**: Commit the work. Update ROADMAP.md if it touches a milestone.
2. **Review**: Re-read the material from a student's perspective. Does it stand alone? Are scaffolding levels appropriate for the target tier (J vs S)?
3. **Refine**: Fix gaps, adjust difficulty, ensure consistency with adjacent materials. Commit refinements separately.

This cycle applies to every deliverable, not just at milestone boundaries. Small, frequent checkpoints keep the materials internally consistent as the curriculum evolves.

## Content Conventions

- All written materials are Markdown.
- Slide decks are self-contained HTML files.
- Keep language direct and concrete. Avoid jargon not defined in the domain section of `STUDENT_ONBOARDING_PLAN.md`.
- When referencing FEAST code, include file and line numbers so students can verify against the actual codebase.
- Code examples should be minimal and self-contained.
- No em dashes in any output.

## Curriculum-Slides Sync

The curriculum (`STUDENT_ONBOARDING_PLAN.md`) and slide decks (`slides/week-N/index.html`) share overlapping content. `CONTENT_MAP.md` documents which curriculum sections map to which slides and lists the specific shared values (URLs, scores, thresholds, line references) that must stay consistent.

After modifying either the curriculum or a slide deck:

1. Open `CONTENT_MAP.md` and find the affected section.
2. Identify the corresponding slides or curriculum sections.
3. Check whether any shared facts changed (the "Key shared values" section lists the most drift-prone ones).
4. Update the other source to match. If the change doesn't apply to slides (e.g., adding solo work details that aren't presented), note that in your commit message.
5. If you added new content that maps to slides, add a row to the content map.

When adding material to the curriculum for a week that already has a slide deck, decide whether the new material belongs in the slides (presented during group session) or is reference-only (solo work details, scaffolded guides). Only group session content needs slide coverage.

## Roadmap Maintenance

After completing work related to a milestone in `ROADMAP.md`:

1. Update the relevant milestone's checkbox items.
2. Update the "Current State" section if the overall picture changed.
3. Update milestone status if it's now complete.
4. Commit the ROADMAP.md update alongside or immediately after the work.

A post-commit hook (`.claude/settings.json`) will nudge about ROADMAP.md updates after git commits.

## Reuse Goal

This repo is intended as a replicable pattern for LLM-assisted development onboarding in other domains. Curriculum design choices are documented in `DECISIONS.md` so future adapters understand not just what we did but why. The repo structure, project management files, and hook configuration are part of the deliverable, not just the content.
