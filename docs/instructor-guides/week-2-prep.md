---
layout: default
title: "Week 2 Prep: LLM Digest of Student Submissions"
---

# Week 2 Prep: LLM Digest of Student Submissions

Pre-session workflow for digesting Week 1 student deliverables before the Plan Comparison Activity. Total time: ~35 minutes. Requires: `gh` CLI authenticated to the cohort org, access to Claude (or any capable LLM).

## Why do this

The Plan Comparison Activity works best when the instructor has already seen the submissions. Pre-digesting lets you:

- Validate the convergence board in real time instead of building it from scratch
- Identify discussion seeds before the session starts
- Spot investigation areas with no coverage so you can address gaps

This is a cheat sheet for the instructor, not a replacement for the student activity. Students still do the silent read, round-robin, and convergence. You just arrive prepared.

---

## Step 1: Collect artifacts (~5 min)

Pull all student Week 1 PRs and filed issues from the cohort org.

```bash
# List all open/merged PRs with Week 1 deliverables
gh pr list --repo [COHORT-ORG]/FEAST-backend --state all --json number,title,author,files

# List all filed issues with area labels
gh issue list --repo [COHORT-ORG]/FEAST-backend --json number,title,labels,author

# Download each student's vision plan (adjust paths as needed)
for pr in $(gh pr list --repo [COHORT-ORG]/FEAST-backend --state all --json number -q '.[].number'); do
  gh pr diff --repo [COHORT-ORG]/FEAST-backend $pr | grep -A 999 "vision-plan" | head -200
done
```

For each student, collect:
- Their vision plan (in `docs/`)
- Their endpoint trace (in `docs/traces/`)
- Issues they filed (from `gh issue list` filtered by author)

## Step 2: Per-student summaries (~10 min)

Feed each student's vision plan and filed issues to Claude. Use this prompt:

> Here is [Student]'s Vision and Improvement Plan and the issues they filed.
>
> **Vision plan:**
> [paste vision plan content]
>
> **Issues filed:**
> [paste issue titles and labels]
>
> Summarize:
> 1. Which investigation areas they covered (from: frontend state, frontend consistency, backend entry points, database access, simulation core, data pipeline, testing)
> 2. Their top 3 findings with specific code references
> 3. Their recommended improvement sequence and rationale
> 4. Any open questions they raised

Repeat for each student. Save the summaries.

## Step 3: Cross-student synthesis (~10 min)

Feed all per-student summaries into a single prompt:

> Here are summaries of [N] students' Week 1 vision plans.
>
> [paste all summaries]
>
> Identify:
> (a) Findings everyone mentioned (these become "Everyone noticed" on the convergence board)
> (b) Findings multiple students mentioned
> (c) Findings only one person mentioned
> (d) Sequencing disagreements between students (e.g., Student A says fix entry points first, Student B says testing first)
> (e) Investigation areas with no coverage from any student

## Step 4: Pre-populate convergence board (~5 min)

Draft the three-column board from the synthesis output:

| Everyone noticed | Multiple people noticed | One person noticed |
|------------------|------------------------|--------------------|
| ...              | ...                    | ...                |

This is your reference during the round-robin. Validate and adjust as students share.

Also note:
- Which investigation areas got covered (and by how many students)
- Which areas got no coverage at all

## Step 5: Identify discussion seeds (~5 min)

Pick 2-3 items to prompt discussion if the round-robin stalls:

1. **A sequencing disagreement.** "Student A says fix entry points first because multiple startup scripts are confusing. Student B says testing first because you can't verify any fix without tests. Who's right, and does it depend on context?"

2. **A surprising solo finding.** Something only one student caught that the rest should hear about.

3. **An uncovered area.** "Nobody investigated [area]. Why? Is it less important, or just less visible?"

These seeds are insurance. If the conversation flows naturally, you may not need them.

---

## Quick checklist

- [ ] `gh` CLI authenticated to cohort org
- [ ] All student vision plan PRs collected
- [ ] All filed issues collected
- [ ] Per-student summaries generated
- [ ] Cross-student synthesis generated
- [ ] Convergence board pre-populated
- [ ] 2-3 discussion seeds identified
- [ ] Coverage map ready (which areas, how many students each)
