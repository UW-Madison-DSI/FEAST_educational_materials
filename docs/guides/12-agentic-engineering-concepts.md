---
layout: default
title: "Guide: Agentic Engineering Concepts"
---

# Guide: Agentic Engineering Concepts

## Context

This guide provides the conceptual foundation for the agentic engineering approach used throughout the curriculum. Read it after Week 1's group session for a deeper understanding of the tools you're using and why the curriculum is structured the way it is. Revisit it in Week 4 when the design patterns section becomes relevant to your hands-on experience.

## LLM vs. Agent

An **LLM** (large language model) is a model that takes text in and produces text out. You send it a question, it sends back an answer. One turn, one response. It has no memory of your files, no ability to run commands, and no way to check whether its answer was correct.

An **agent** is built from five pieces:

1. **One LLM.** The brain. It reads text and produces text.
2. **A stable identity.** The agent persists across a conversation or task. It remembers what it has seen, what it tried, and what worked. A fresh prompt to a web chatbot has none of this; a CLI agent session does.
3. **A job.** A defined goal: answer a question, fix a bug, add type hints, plan a feature. The job scopes what the agent does and when it stops.
4. **A toolbox.** Capabilities the LLM cannot perform alone: reading files, running shell commands, searching code, editing files, executing tests. Tools are what let the agent verify its own answers against reality instead of guessing.
5. **A harness.** The software that puts it all together. The harness connects the LLM to the toolbox, manages context (deciding what fits in the LLM's limited window), and enforces safety rules (what the agent can do without asking permission).

When the pieces are assembled, the agent works in a loop: **observe** (read files, check errors), **think** (plan next step), **act** (edit, run commands), then observe the results and repeat. The loop continues until the job is done or the agent decides to stop.

This loop is what makes an agent fundamentally different from a chatbot. When you ask Claude Code or Gemini CLI a question about your codebase, the agent reads your files before answering. When you ask it to fix a bug, it reads the code, proposes a change, runs the tests, and if the tests fail, it reads the error and tries again. That loop is the agent at work.

## The Agent Loop in Practice

Here is what the agent loop looks like when you ask a CLI agent to investigate a bug in the FEAST backend:

| Step | What the agent does | Loop phase |
|------|---------------------|------------|
| 1 | Reads `household.py` to understand the function | Observe |
| 2 | Identifies the likely cause based on the code | Think |
| 3 | Edits the function to fix the issue | Act |
| 4 | Runs `pytest` to check the fix | Observe |
| 5 | Sees a test failure in a different function | Observe |
| 6 | Reads the failing test to understand the dependency | Think |
| 7 | Adjusts the fix to handle the edge case | Act |
| 8 | Runs `pytest` again, all tests pass | Observe |
| 9 | Reports the fix and explains the reasoning | Done |

Each iteration through the loop makes the agent's understanding more grounded. This is why agent-produced code tends to be more contextually appropriate than code from a single prompt: the agent has iterated against your actual codebase, not a generic pattern.

## Three Types of Agents

For practical purposes, AI coding agents fall into three categories:

### Conversational agents

Answer questions, explain code, brainstorm ideas. The agent loop is short: observe your question (and maybe read a file for context), think, respond. You use conversational mode in Week 1 when the tools are restricted to asking questions about code.

**Example:** "What does `has_resources()` do and why are the income thresholds set at $10k/$15k/$25k?"

### Task agents

Execute multi-step work. The agent reads the codebase, plans changes, edits files, runs tests, and fixes failures. The loop can run for many iterations before the task is complete. You unlock task agent capabilities in later weeks when the progressive restrictions lift.

**Example:** "Add type hints to all functions in `household.py` and make sure the existing tests still pass."

### Orchestrator agents

Coordinate multiple task agents or manage complex workflows across several files or issues. Multi-issue planning (where the agent plans across a set of interdependent issues) is a taste of orchestration. Students will not build orchestrator agents in this curriculum, but understanding the concept helps you recognize what more advanced tooling does.

**Example:** "Plan the implementation order for the reporting feature cluster: backend API, metrics calculation, and frontend display."

The boundaries between these types are not rigid. A single conversation can start in conversational mode (you ask a question), shift to task mode (you ask the agent to implement a fix), and touch on orchestration (the fix spans multiple files with dependencies). The categories describe the dominant interaction pattern, not a strict classification.

## The Harness in Detail

The harness (piece #5 from the model above) deserves a closer look because it is what varies most between tools. A harness typically provides:

- **File system access:** Read and write files in your project
- **Command execution:** Run shell commands (tests, linters, git, build tools)
- **Context management:** Decide what information to include in the LLM's limited context window
- **Tool definitions:** Structured capabilities the LLM can invoke (search, edit, create files)
- **Safety rules:** Constraints on what the agent can do without asking permission

Claude Code, Gemini CLI, Cursor, and Copilot all have different harnesses. The same underlying LLM can behave very differently depending on the harness it runs inside. This is why asking the same question in Claude Code vs. the Claude web chat gives different results: the web chat has no harness (no file access, no commands), while Claude Code's harness lets the model see your actual codebase.

**Your project context file is harness configuration.** When you create a CLAUDE.md or GEMINI.md, you are telling the harness what to pay attention to: project structure, conventions, workflow rules, and what matters in this codebase. A well-written context file makes the agent's observations more relevant and its actions more aligned with the project's standards.

## The Focus Shift: Syntax to Engineering

When agents handle syntax, boilerplate, API lookups, and implementation mechanics, the developer's job shifts to higher-level engineering work. This table maps each skill to where it appears in the curriculum:

| Engineering skill | What it involves | Curriculum week |
|-------------------|-----------------|-----------------|
| Problem decomposition | Breaking a vague goal into concrete, actionable tasks | Week 1 (endpoint traces), Week 3 (specs) |
| Architecture decisions | Choosing approaches and documenting trade-offs in ADRs | Week 2 (introduced), Week 4 (auto-generated) |
| Specification writing | Defining what to build and why before writing code | Week 3 (specs before code) |
| Testing strategy | Deciding what to test, what edge cases matter, what coverage means | Week 2 (first tests), Week 3 (edge cases) |
| Code review | Evaluating correctness, design, security, and maintainability | Week 2 (peer), Week 3 (adversarial + LLM) |
| Documentation | Writing for future developers and for AI agents | Week 1 (context files), ongoing |
| Project coordination | Sequencing work, managing dependencies, maintaining roadmaps | Week 4 (multi-issue planning) |

This is the core idea of agentic engineering: you act more like an engineer or project manager and less like a typist. The agent handles "how do I write this in Python." You handle "what should we build, why, and how do we verify it works."

## Agentic Design Patterns

Design patterns are recurring strategies that show up across different tools and workflows. You do not need to implement these patterns yourself, but recognizing them helps you understand why the tools work the way they do and helps you evaluate new tools when they appear.

### Patterns you are already using

These patterns are built into the curriculum. You practice them before you name them.

**Reflection.** One agent evaluates another's output. In this curriculum, the adversarial review rotation (Week 3) is a reflection pattern: a reviewer opens a fresh agent session, feeds it someone else's code, and asks it to find problems. The agent critiques work it did not produce, which catches different issues than the original author's agent would.

**Planning.** The agent creates a structured plan before acting. Structured planning (Week 3) and multi-issue planning (Week 4) both use this pattern. Instead of immediately writing code, the agent explores the codebase, identifies the files and functions involved, and proposes an implementation sequence. You review the plan before any code changes happen.

**Tool use.** Every time the agent reads a file, runs a test, checks git status, or executes a linter, it is using a tool provided by the harness. Tool use is what separates agents from chatbots: the agent can verify its own answers against reality rather than guessing.

**Human-in-the-loop.** The entire agentic engineering workflow is a human-in-the-loop pattern. The agent proposes; you approve, reject, or redirect. You review every plan, every code change, every spec. The agent never ships code autonomously. This is the pattern that makes agentic engineering different from vibe coding.

**Memory and context management.** Project context files (CLAUDE.md, GEMINI.md) are a memory pattern. The agent has a limited context window and no persistent memory across sessions. The context file is how you give it knowledge that persists: project structure, conventions, and what matters.

### Patterns you will recognize later

These patterns appear in the curriculum's workflows, but at a higher level of abstraction.

**Prompt chaining.** Breaking a complex task into sequential steps where the output of one step feeds the next. The spec-first workflow (write spec, plan implementation, implement, review) is a human-managed chain. Each step's output constrains and informs the next.

**Routing.** Choosing different strategies based on the task. The "when to use each" table in Guide 11 is routing: small task leads to single-feature planning, cross-cutting work leads to multi-issue planning, pre-merge leads to branch-level review. You route the work to the right tool.

**Evaluation.** Multiple evaluators with different perspectives check the same output. The three-layer review pipeline (CI checks + human peer review + LLM adversarial review) is an evaluation pattern. Each layer catches different categories of issues.

## Connecting It All

Agents are tools. Powerful tools, but tools. The engineering judgment, the spec writing, the review, the prioritization, the decisions about what to build and why: that is your work. The curriculum teaches those skills because they are what matter when syntax is automated. When you evaluate a new AI development tool, ask: what patterns does it use? Does it plan before acting? Does it have human-in-the-loop? Can it reflect on its own output? Does it use tools to verify its answers? If a tool skips all of those, it is optimized for speed, not quality. Now you know the difference.

For how to assemble these patterns into a complete, repeatable workflow, see [Guide 13: Agentic Workflow Best Practices](13-agentic-workflow-best-practices).
