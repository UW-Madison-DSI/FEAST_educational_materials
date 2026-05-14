---
layout: default
title: "Guide: Agentic Workflow Best Practices"
---

# Guide: Agentic Workflow Best Practices

## Context

This guide assembles the engineering practices you have learned across the curriculum into a single, repeatable workflow for completing tasks with agentic tools. It is the playbook for how to run a task from start to finish: spec it, plan it, execute it in phases, verify after each phase, and document decisions along the way.

Read this guide after Week 5's "Complete agentic workflow" session. Use it as a reference whenever you start a new task. The quick-reference checklist at the end is designed to be kept open while you work.

## The Core Loop

Every task, regardless of size, follows the same basic cycle:

```
Spec  ->  Plan  ->  Execute  ->  Verify  ->  Document  ->  Repeat
 (you)   (agent    (agent,     (you,        (you,       (next
          + you)   one phase)  four checks)  if needed)   phase)
```

### 1. Spec (you write)

Before touching the agent, write 2-3 sentences answering:
- **What** are you changing?
- **Why** does it need to change?
- **How will you know it worked?** (What does "done" look like?)

This is the engineering judgment step. The agent does not decide what to build. If you cannot write this in your own words, you do not understand the task well enough to start.

For design decisions (choosing between approaches, changing behavior), write this as a short ADR using the template. For straightforward fixes, a sentence in the issue comment is sufficient.

### 2. Plan (agent + you)

Ask your agent to create a phased plan based on your spec. The key constraint: **each phase must leave the codebase in a working, testable state.** No phase should break something that a later phase will fix.

Review the plan before any code is written:
- Does it match your spec's intent?
- Are the phases in the right order?
- Is any phase too large? (If you cannot verify it in 10 minutes, split it.)
- Did the agent miss dependencies or files you know about?

Feed your spec to the agent as context. The workflow is: you provide the *what* and *why*, the agent maps the *how*.

### 3. Execute (agent, one phase at a time)

Implement one phase. Do not batch phases. Do not let the agent run ahead to "just finish" the next phase while it is at it.

Single-phase execution is the discipline that prevents scope creep and keeps verification manageable. If a phase turns out to be larger than expected, stop and split it.

### 4. Verify (you, after each phase)

Four checks after every phase:

**Run tests.** Run the full test suite, not just the file you changed. If you added behavior, there should be a test for it. If you changed behavior, existing tests should still pass (or be intentionally updated).

**Review the diff.** Read `git diff` line by line. Apply the "explain every line" test. Agent-generated code that you cannot explain is vibe-coded code, regardless of whether you typed the prompt.

**Check for unnecessary complexity.** Agents tend toward over-abstraction: helper functions that are called once, wrapper classes that wrap one thing, configuration for things that do not vary. Ask: "Is this the simplest version that solves the problem?" If in doubt, ask the agent in a fresh session (a fresh session avoids confirmation bias from the session that wrote the code).

**Update the plan.** Did this phase reveal something the original plan did not anticipate? A dependency you did not know about? A simpler approach? Update the remaining phases before proceeding. Plans are living documents, not commitments. Adapting the plan based on what you learned is a sign of good engineering, not a sign of failure.

### 5. Document (you, when needed)

If a phase involved choosing between two or more approaches, write a short ADR. Not every phase needs one. The test: would someone question this choice six months from now? If yes, write it down. If no, a clear commit message is enough.

### 6. Repeat

Move to the next phase. After all phases are verified, do a final review of the full branch diff (accumulated changes across all phases). This catches cross-cutting issues that per-phase reviews miss. Then open a PR with a complete template.

## Choosing the Right Workflow

Not every task needs the full loop. Match the workflow to the task:

| Task scope | Workflow | Example |
|-----------|----------|---------|
| **Quick fix** (< 30 min) | Spec (1 sentence) -> implement -> verify. No phasing needed. | Fix a typo in CORS config, update a dependency version |
| **Single feature** (1-4 hours) | Full spec-plan-execute-verify loop with phases | Add type hints to a module, implement a new API endpoint |
| **Cross-cutting** (multi-issue) | Same loop, but add multi-issue planning up front to sequence work across issues | Reporting feature (backend API + metrics calculation + frontend display) |
| **Exploratory** (unknown scope) | Start with an investigation phase: read code, form a hypothesis, *then* spec | Debug the stores-within-1-mile bug, profile a slow simulation step |

For quick fixes, the overhead of phased planning is not worth it. For cross-cutting work, skipping the sequencing step leads to integration pain. The judgment of which workflow fits which task is itself an engineering skill.

## The Verification Checkpoint in Detail

The four checks deserve more detail because they are where discipline either holds or breaks down.

### Tests

Run the full test suite after every phase. Not just the file you changed. Dependencies break in unexpected places.

If you added new behavior, write the test before or alongside the implementation. A test written after the code tends to test the code as written rather than the behavior as intended. Writing the test first clarifies what "done" means.

If you changed existing behavior, update the tests intentionally. A test you disabled to make CI pass is a test that is no longer protecting you.

### Diff review

`git diff` is the ground truth. Read every changed line. The questions to ask:
- Can I explain what this line does and why it is needed?
- Is this the same thing I would have written, or is it unnecessary complexity?
- Did the agent change files I did not expect?
- Are there debug statements, commented-out code, or TODO comments that should not ship?

Green tests do not mean good code. Tests verify behavior; the diff review verifies quality, readability, and intent.

### Complexity check

Agent-generated code tends toward over-engineering. Common patterns to watch for:
- Helper functions called exactly once
- Wrapper classes that wrap a single thing
- Configuration objects for things that do not vary
- Abstract base classes with one implementation
- Try/except blocks that catch and re-raise without adding information

Ask yourself: "If I deleted this abstraction and inlined the logic, would the code be clearer?" If yes, inline it.

For a second opinion, open a fresh agent session and ask: "Is this the simplest version that solves the problem? What could be removed?" A fresh session avoids the sunk-cost bias of the session that wrote the code.

### Plan update

After each phase, re-read the remaining plan. Three questions:
- Did I learn something that changes what the next phase should do?
- Is there a simpler path now that I understand the code better?
- Should I add a phase I did not anticipate (e.g., a migration, a test I forgot)?

Updating the plan is not rework. It is the agent loop applied at a higher level: observe (what did this phase teach me?), think (does the plan still make sense?), act (update it).

## Encoding Workflow in Your Project Context File

Your project context file (CLAUDE.md, GEMINI.md, .cursorrules) can encode workflow rules that the agent follows automatically. When you write these rules, you are doing something specific: writing behavioral instructions that the LLM reads and executes from inside its context window. This is a form of programming in natural language, and it is why a well-written workflow section has such a large effect on agent behavior. It is also why the verification steps in this guide are non-negotiable: unlike code, these instructions are interpreted by the LLM, so they are strong guidance rather than hard guarantees.

**Example workflow section for a context file:**

```markdown
## Workflow

1. Before starting work, confirm the spec: what, why, and verification criteria.
2. Create a phased plan. Each phase must leave the codebase in a working, testable state.
3. Execute one phase at a time. After each phase:
   - Run the full test suite
   - Show the diff for review
   - Flag any complexity that could be simplified
   - Confirm whether the remaining plan should be updated
4. Write an ADR for any phase that involved choosing between approaches.
5. Do not proceed to the next phase until the current phase is verified.
6. After all phases: run a branch-level diff review before opening the PR.
```

**What to encode:**
- Process rules the agent should follow every time (phased execution, test after each phase, diff review)
- Project conventions (naming, style, test patterns) that reduce unnecessary deviation
- Explicit constraints ("do not modify files outside the plan without confirming first")

**What to leave to human judgment:**
- What to build (the spec is yours)
- Whether to proceed after a failed verification (sometimes the right call is to revert)
- When to write an ADR vs. when a commit message is sufficient
- When to deviate from the plan (the plan serves you, not the other way around)

**Anti-patterns to avoid:**
- Over-constraining the agent with rules for every edge case (the context file should fit on one screen)
- Encoding stale rules that no longer match the project's practices (audit the file regularly)
- Duplicating what CI already enforces (if the linter catches it, you do not need to tell the agent)
- Relying on the context file for safety-critical logic (if correctness depends on an exact check, like a threshold value or a file that must exist, verify it yourself or use a CI check; context-file instructions are guidance the LLM follows with high probability, not deterministic code)

## Common Failure Modes

| Failure mode | What happens | Prevention |
|-------------|-------------|------------|
| **Scope creep** | Agent modifies files beyond the plan, introduces "improvements" you did not ask for | Review the plan before executing; check the diff against the plan after each phase |
| **Deferred verification** | Tests run only at the end; wrong approach discovered late | Verify after every phase, not just the last one |
| **Plan rigidity** | Plan says X, reality says Y, you follow the plan anyway | Update the plan after each phase; plans serve you, not the other way around |
| **Missing the read** | Tests pass, so you skip reading the diff | Green tests do not mean good code; the diff review is non-negotiable |
| **ADR avoidance** | Decisions accumulate undocumented; next person has no idea why things are the way they are | If you chose between two approaches, write it down. Five minutes now saves thirty minutes of "why did we do this?" later |
| **Confirmation bias** | You review the agent's code in the same session that wrote it; you are primed to accept it | Use a fresh session for review. The adversarial review rotation (Week 3) teaches this pattern |

## Quick-Reference Checklist

Keep this open while you work. Check off each item as you go.

```
Before starting:
  [ ] Spec written (what, why, verification criteria)
  [ ] Phased plan created and reviewed (each phase = working state)

For each phase:
  [ ] Phase implemented (one phase only, no batching)
  [ ] Full test suite passes (existing + new tests)
  [ ] Diff reviewed (can explain every line)
  [ ] No unnecessary complexity (simplest version that works)
  [ ] Plan updated if this phase changed the approach
  [ ] ADR written if a decision was made between alternatives

After all phases:
  [ ] Branch-level diff reviewed (full accumulated changes)
  [ ] All ADRs are accurate and not superseded
  [ ] Project context file updated if conventions changed
  [ ] PR opened with complete template (summary, changes, test plan, tradeoffs)
```

## See Also

- [Guide 11: Structured Planning with CLI Agents](11-planning-with-claude-code) for the planning tools (single-feature, multi-issue, branch-level review)
- [Guide 12: Agentic Engineering Concepts](12-agentic-engineering-concepts) for the conceptual foundation (agent loop, design patterns, focus shift)
