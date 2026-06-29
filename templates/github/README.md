# GitHub config for the FEAST repos

Copy-ready PR templates and the issue-linking enforcement workflow for
`FoodAccessSimulator/FEAST-backend` and `FoodAccessSimulator/FEAST-frontend`.

## What goes where

| File here | Copy to (in the target repo) |
|---|---|
| `backend.pull_request_template.md` | `FEAST-backend/.github/pull_request_template.md` |
| `frontend.pull_request_template.md` | `FEAST-frontend/.github/pull_request_template.md` |
| `require-linked-issue.yml` | both repos: `.github/workflows/require-linked-issue.yml` |

Rename on copy: the PR template must be exactly `pull_request_template.md`
at the repo's `.github/` root for GitHub to pre-fill it.

## Forcing issue linking (the important part)

A PR template **cannot enforce anything**. It only pre-fills the description
box, so the `Closes #` line is a prompt that a contributor can delete. Real
enforcement takes two pieces:

1. **The workflow** (`require-linked-issue.yml`) fails any non-draft PR that
   does not close an issue. It counts issues linked by a `Closes #N` keyword
   in the body *or* via the Development sidebar.
2. **Branch protection** makes that workflow a gate. Without this step the
   check runs but a red X does not block merge.

   In each repo: Settings > Branches > add/edit a rule for `dev` (and
   `staging`, `main`) > enable **Require status checks to pass before
   merging** > add **`Require linked issue`** to the required checks. Also
   enable **Do not allow bypassing the above settings** if you want it to
   apply to admins.

   CLI equivalent (needs admin + the `repo` scope):

   ```bash
   gh api -X PUT repos/FoodAccessSimulator/FEAST-backend/branches/dev/protection \
     -F 'required_status_checks[strict]=true' \
     -F 'required_status_checks[checks][][context]=Require linked issue' \
     -F 'enforce_admins=true' \
     -F 'required_pull_request_reviews[required_approving_review_count]=1' \
     -F 'restrictions=null'
   ```

## Notes

- The review-pipeline checklist in the templates mirrors the four-step
  review in `CONTRIBUTING.md` (LLM adversarial, optional second LLM, human
  reviewer 1, human reviewer 2). Checklists are not enforced; they are a
  prompt for reviewers. To require human approvals, use the
  `required_approving_review_count` setting above.
- Frontend test commands assume Vite + ESLint. Adjust if the frontend adds a
  test runner.
