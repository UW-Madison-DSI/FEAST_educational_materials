---
layout: default
title: "Guide: Deployment Configuration"
---

# Guide: Deployment Configuration

## Context

FEAST has three independently deployable layers (frontend, backend, database), each configurable to point at any environment. Most setup and debugging problems come from one layer pointing at the wrong environment. This guide is a reference card for understanding and troubleshooting deployment configurations.

## The Three Configuration Levers

Each lever controls which environment one layer talks to.

### 1. Frontend -> Backend

**File:** `src/shared/client.js:3` (the `baseURL` in the Axios client)

This determines which backend API the frontend sends requests to. Currently hardcoded (not an env var).

| Value | Points at |
|-------|-----------|
| `http://127.0.0.1:8000/api` | Your local backend |
| `https://fassfrontstage.pods.icicleai.tapis.io/api` | Tapis staging backend |

### 2. Backend -> Database

**File:** `.env` in the backend repo root

| Variable | Local value | Staging value |
|----------|-------------|---------------|
| `DB_HOST` | `localhost` | (staging hostname) |
| `DB_PORT` | `5432` | (staging port) |
| `DB_NAME` | `fassdb` | (staging DB name) |
| `DB_USER` | `postgres` | (staging username) |
| `DB_PASS` | (your local password) | (staging password) |

### 3. Backend -> Frontend (CORS)

**File:** `food_access_model/main.py` (CORS middleware origins list)

This controls which frontend origins the backend accepts requests from. If your frontend's origin isn't in this list, API requests fail silently (the browser blocks them).

| Entry point | Allowed origins |
|-------------|-----------------|
| `food_access_model/main.py` (via `run_local.py`) | `localhost:5173` + Tapis staging |
| `api_server.py` (legacy, do not use) | Tapis staging only |

## Common Configurations

| Setup | Frontend | Backend | Database | When to use |
|-------|----------|---------|----------|-------------|
| Full local | localhost:5173 | localhost:8000 | localhost:5432 | Daily development |
| Local FE + staging API | localhost:5173 | Tapis staging | staging DB | Frontend-only work, no local backend needed |
| Full staging | Tapis FE | Tapis API | staging DB | Shared testing, demos |
| Mixed (common mistake) | localhost:5173 | localhost:8000 | staging DB | Accidentally pointing local backend at shared DB |

## Diagnosing Configuration Problems

**Symptom: CORS errors in browser console**
- Your frontend's origin isn't in the backend's CORS list
- Check: Are you using `run_local.py` (allows localhost:5173) or `api_server.py` (allows only Tapis)?

**Symptom: "Connection refused"**
- The frontend can't reach the backend, or the backend can't reach the database
- Check: Is the backend running? Is `client.js` baseURL pointing at the right port (8000 for `run_local.py`, 8080 for gunicorn)?

**Symptom: Unexpected data or "someone else's simulation"**
- Your backend is pointed at a shared database instead of your local one
- Check: `.env` DB_HOST should be `localhost` for local development

**Symptom: Changes you make locally appear on the staging site (or vice versa)**
- Multiple layers pointing at the same backend or database across environments
- Check all three levers: client.js, .env, and CORS origins

## Safety Rules

1. **Never point a local backend at a production database.** Accidental writes to shared data are hard to undo.
2. **Never commit `.env` files with real credentials.** Verify `.env` is in `.gitignore`.
3. **Never commit `client.js` changes that point at production.** Dev branches should point at localhost or staging.
4. **Always verify your configuration after switching branches.** Different branches may have different values in `client.js` or `.env`.

## LLM Usage

- You CAN ask the LLM to explain CORS, environment variables, or deployment topology
- You CAN ask the LLM to help diagnose a configuration mismatch given your symptoms
- You should NOT ask the LLM to generate credentials or deployment configurations
