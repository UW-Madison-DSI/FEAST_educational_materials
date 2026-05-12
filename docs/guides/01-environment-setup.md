---
layout: default
title: "Guide: Environment Setup"
---

# Guide: Environment Setup

## Context

Get the FEAST backend and frontend running locally so you can use the tool and explore the code.

## Before You Start

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ and npm installed
- [ ] PostgreSQL running locally (or access to a shared instance)
- [ ] Git configured with GitHub access (verify: `git --version`, `git config --get user.name`, `ssh -T git@github.com`)
- [ ] uv installed (`pip install uv`)

## Git Fundamentals

If you've never used git before, this section is for you. If you're comfortable with git already, skip ahead to [Steps](#steps) and help a teammate who's learning.

### What is git?

Git is version control for code. Think of it as a system of save points: every time you commit, git takes a snapshot of all your files. You can always go back to any previous snapshot. When multiple people work on the same project, git tracks everyone's changes and helps combine them.

Two key pieces:
- **Your local copy.** When you clone a repo, you get the entire project and its history on your machine. You work here.
- **GitHub (the remote).** The shared copy that everyone pushes to and pulls from. This is the source of truth.

### Core concepts

| Concept | What it means |
|---------|--------------|
| **Repository (repo)** | A project folder tracked by git. Contains every file and the full history of changes. |
| **Commit** | A snapshot of your files at a moment in time. Each commit has a message describing what changed. Like a save point you can return to. |
| **Branch** | A named line of development. The FEAST project uses `main` (stable), `dev` (integration), and feature branches (your work). |
| **Staging area** | A holding zone between "files you changed" and "files you committed." You choose which changes go into each commit using `git add`. |
| **Remote** | The copy of the repo on GitHub. `git push` sends your commits there; `git pull` brings down everyone else's. |

### Commands you need this week

| Command | What it does | When you use it |
|---------|-------------|-----------------|
| `git clone <url>` | Download a repo from GitHub to your machine | Once, during setup |
| `git checkout <branch>` | Switch to a different branch | When moving between branches |
| `git status` | Show what files changed, what's staged, what branch you're on | Constantly. This is your "where am I?" command. |
| `git add <file>` | Stage a file for the next commit | Before committing |
| `git commit -m "message"` | Save a snapshot with a descriptive message | After staging changes |
| `git push` | Upload your commits to GitHub | After committing, to share your work |
| `git pull` | Download the latest changes from GitHub | Before starting new work |
| `git log --oneline` | See recent commits (one line each) | To check history |
| `git diff` | See what you changed since the last commit | To review your own changes before committing |

### Your first commit (J-tier walkthrough)

You'll do this for real during the endpoint trace assignment. Here's what the sequence looks like:

```bash
# 1. Make sure you're on the dev branch and up to date
git checkout dev
git pull

# 2. Create a new branch for your work
git checkout -b feature/trace-your-name

# 3. Do your work (create your trace file, etc.)

# 4. Check what changed
git status

# 5. Stage your new file
git add docs/traces/your-trace-file.md

# 6. Commit with a descriptive message
git commit -m "Add endpoint trace for GET /simulation-instances"

# 7. Push to GitHub
git push -u origin feature/trace-your-name
```

After pushing, you'll open a pull request on GitHub. We'll cover PRs in detail during Week 2.

### Common mistakes and how to recover

**"I don't know what's going on."** Run `git status`. It tells you what branch you're on, what files changed, and what's staged. When in doubt, `git status`.

**"git won't let me switch branches because of uncommitted changes."** You have unsaved work. Either commit it first (`git add` then `git commit`) or stash it temporarily (`git stash`, switch branches, then `git stash pop` to get it back).

**"I committed to the wrong branch."** Don't try to fix this yourself yet. Ask your S-tier partner or an instructor. Git can undo almost anything, but the recovery commands are easy to get wrong.

**"I see a merge conflict."** This means two people changed the same lines. The file will have markers like `<<<<<<<` and `>>>>>>>` showing both versions. Ask your S-tier partner to walk you through resolving it. This is normal and expected when teams share code.

> **S-tier students:** You probably know most of this already. Your job this week is to help J students through their first commit and push. If a J student's git is broken, that's your problem too.

## Steps

### 1. Clone the repos

```bash
git clone https://github.com/ICICLE-ai/Food-Access-Model.git
git clone <fass-frontend-repo-url>
```

### 2. Backend setup

```bash
cd Food-Access-Model
git checkout minimum_viable_product    # active development branch
cp .env.example .env                   # then edit with your DB credentials
uv sync                                # install Python dependencies
```

Required `.env` variables:
```
DB_NAME=fassdb
DB_USER=postgres
DB_PASS=<your-password>
DB_HOST=localhost
DB_PORT=5432
```

You'll need to create the database and tables. Check if there's a schema file or if the app creates tables on startup.

### 3. Run the backend

```bash
uv run python run_local.py
```

This runs `uvicorn food_access_model.main:app --reload --port 8000`.

**Important:** Use `run_local.py` (which runs `food_access_model.main:app`). Do NOT use `api_server.py` -- it's an older entry point with different CORS settings that will cause issues with your local frontend.

Test it:
```bash
curl http://localhost:8000/api/simulation-instances
```

You should get a JSON response (possibly an empty list if no data yet).

### 4. Frontend setup

```bash
cd FASS-Frontend/fass-react
git checkout Brown-County-Frontend
npm install
```

Edit `src/shared/client.js` line 3 -- change the `baseURL` to:
```
http://127.0.0.1:8000/api
```

The API URL is hardcoded in this file, not configured via environment variable. The file has commented alternatives for staging/production URLs.

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 5. See it work

You should see a Leaflet map centered on Brown County, WI. If there's data in the database, you'll see colored household markers and store markers.

## Configuration Points

Your local setup has three configuration levers. Most setup problems come from one of these pointing at the wrong place.

| Lever | File | Controls |
|-------|------|----------|
| Frontend -> Backend | `src/shared/client.js:3` (baseURL) | Which backend API the frontend talks to |
| Backend -> Database | `.env` (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS) | Which database the backend reads/writes |
| Backend -> Frontend (CORS) | `food_access_model/main.py` (CORS origins) | Which frontends the backend accepts requests from |

For local development, all three should point at localhost. See the [Deployment Configuration](10-deployment-configuration) guide for the full picture of how these work across environments.

## Common Problems

- **"Connection refused" on backend**: Is PostgreSQL running? Are `.env` creds correct? Is the backend on port 8000 (`run_local.py`)? Make sure `client.js` baseURL matches.
- **Empty map**: Database might not have data. Check the preprocessing pipeline or ask if there's a database dump to restore.
- **CORS errors in browser console**: If using `food_access_model/main.py` (via `run_local.py`), CORS already allows `localhost:5173`. If you accidentally used `api_server.py`, it only allows a Tapis staging URL and you'll get CORS errors.
- **Import errors**: Make sure you're on the `minimum_viable_product` branch (backend) and `Brown-County-Frontend` branch (frontend), not `main`.
- **Unexpected data / "someone else's simulation"**: Your backend might be pointed at a staging database instead of your local one. Check `.env` -- `DB_HOST` should be `localhost`.

## LLM Usage

- You CAN ask the LLM to explain error messages you encounter during setup
- You should NOT ask the LLM to write setup scripts for you

## Definition of Done

- [ ] Backend responds to `curl http://localhost:8000/api/simulation-instances`
- [ ] Frontend loads in browser and shows a map
- [ ] You can see households and/or stores on the map
