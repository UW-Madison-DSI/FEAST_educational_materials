---
layout: default
title: "Guide: Setting Up Linting"
---

# Guide: Setting Up Linting and CI

**Related issue**: #24

## Context

The FEAST codebase has no automated linting or CI checks. This means style issues, unused imports, and simple bugs go unnoticed until someone reads the code. Setting up linting is a small change that pays off on every future PR.

## Before You Start

- [ ] Read `pyproject.toml` to understand current dependencies
- [ ] Read `eslint.config.js` in the frontend (it exists but may not be wired up)
- [ ] Branch: `feature/issue-24-linting` (see [Git Fundamentals in Guide 01](01-environment-setup#git-fundamentals) for branching conventions)

## Steps

### 1. Add flake8 to dev dependencies

```bash
uv add --dev flake8
```

### 2. Create a `.flake8` config file in the project root

```ini
[flake8]
# Line length is unrestricted per project convention
extend-ignore = E501
max-complexity = 10

# Exclude files we haven't cleaned up yet
exclude =
    .venv,
    lib,
    __pycache__,
    *.egg-info
```

### 3. Run flake8 and assess the damage

```bash
uv run flake8
```

You'll likely get hundreds of errors. Don't fix them all. Instead:
- Fix the files you can handle in ~45 minutes
- Add unfixed files to the `exclude` list temporarily
- The goal is to get CI green, not to fix everything at once

### 4. Add a GitHub Actions workflow

Create `.github/workflows/lint.yml`:

```yaml
name: Lint

on:
  pull_request:
    branches: [dev, main]

jobs:
  backend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
      - run: uv sync --dev
      - run: uv run flake8

  frontend-lint:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: fass-frontend/fass-react
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx eslint src/
```

### 5. Verify locally

```bash
uv run flake8           # should pass (0 exit code)
```

## LLM Usage

- You CAN ask: "What does flake8 error E302 mean?"
- You should NOT ask: "Fix all the flake8 errors in this file"

## Definition of Done

- [ ] `.flake8` config exists and is reasonable
- [ ] `uv run flake8` passes locally
- [ ] GitHub Actions workflow runs on PRs
- [ ] PR opened linking to #24

## While You're In There

- Note which files have the most issues. File separate issues for the worst ones.
- Look for unused imports that flake8 catches. These often indicate dead code.

## Stretch Goals

- Add mypy type checking to the CI workflow
- Add a pre-commit hook that runs flake8 before each commit
- Get the frontend eslint check passing too
