# CI/CD Runbook (Phase 12)

## Branch protection (main)

Use GitHub CLI to enforce Pull Request based merges, at least one approval, and required status check `quality-gate`.

```bash
gh api -X PUT repos/{owner}/{repo}/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_linear_history=true \
  -F enforce_admins=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f required_conversation_resolution=true \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_pull_request_reviews[require_code_owner_reviews]=false \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f restrictions= \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]=quality-gate
```

Verify the active protection config:

```bash
gh api repos/{owner}/{repo}/branches/main/protection
```

## PR assignment fallback

- Auto-assignment workflow attempts `copilot-swe-agent` on PR open/reopen/ready-for-review.
- If assignment fails due to permissions or account availability, workflow logs a `fallback to human review` summary and continues.
- In fallback scenarios, assign a human reviewer manually from the PR UI.

## Release operations

Create and push a version tag:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

Expected result:

- GitHub Actions `build.yml` runs on `push.tags` matching `v*`.
- Workflow produces installer `dist/*.exe` and `psm-app-portable-vX.Y.Z.zip`.
- Draft release is created (not published) with both `.exe` and `.zip` assets.

Quick verification with GitHub CLI:

```bash
gh release view vX.Y.Z
gh release view vX.Y.Z --json isDraft,assets
```
