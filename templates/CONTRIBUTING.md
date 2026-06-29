# Contributing to FEAST

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL (local instance or access to a shared one)
- Git with GitHub access
- uv (`pip install uv`)

### Backend Setup

```bash
git clone https://github.com/[COHORT-ORG]/FEAST-backend.git
cd FEAST-backend
git checkout minimum_viable_product
cp .env.example .env   # edit with your DB credentials
uv sync
```

Required `.env` variables:
```
DB_NAME=fassdb
DB_USER=postgres
DB_PASS=<your-password>
DB_HOST=localhost
DB_PORT=5432
```

Run the backend:
```bash
uv run uvicorn api_server:app --host 0.0.0.0 --port 8080 --reload
```

Test it:
```bash
curl http://localhost:8080/api/simulation-instances
```

### Frontend Setup

```bash
cd FEAST-frontend/fass-react
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev
```

Open http://localhost:5173.

### Common Problems

<!-- Students: add problems you encountered and how you solved them here -->

- **CORS errors**: The backend CORS is hardcoded in `api_server.py`. For local dev, change the origin to `http://localhost:5173` or `["*"]`.
- **Empty map**: The database may not have data. Check if there's a database dump to restore, or run the preprocessing pipeline.
- **Import errors**: Make sure you're on the `minimum_viable_product` branch. Different branches have different code.
- **Python version mismatch**: `pyproject.toml` says 3.11.11, Dockerfile says 3.12. Use 3.11+ locally.

## Development Workflow

1. **Find or file an issue** on GitHub
2. **Claim it** by commenting on the issue
3. **Create a branch**: `git checkout -b feature/issue-NUMBER-short-desc`
4. **Write a plan** in the issue comments before coding (for non-trivial changes)
5. **Implement** with tests
6. **Open a PR** using the PR template. Link the issue with `Closes #NNN` (a `require-linked-issue` check enforces this)
7. **Review** (four steps): (1) LLM adversarial review posted as a comment, (2) optional second LLM pass, (3) human reviewer 1 does a full code review against the issue, (4) human reviewer 2 confirms all comments are addressed and merges
8. **Merge** to `dev` after the pipeline is complete

## PR Guidelines

- Max ~200 lines of changed code (non-test). Smaller is better.
- Must link to the issue it addresses with `Closes #NNN` (enforced by the `require-linked-issue` check)
- Must include: summary, test plan, tradeoffs considered
- Use the PR template

## Testing

```bash
# Run all tests
uv run pytest tests/ -v

# Run with mutation testing (validates test quality)
uv run mutmut run --paths-to-mutate=food_access_model/abm/household.py
```

## Linting

```bash
uv run flake8
```

## Branch Strategy

- `main` - production (stable, deployed)
- `staging` - pre-production validation
- `dev` - integration branch
- `feature/issue-NNN-desc` - feature branches off dev
