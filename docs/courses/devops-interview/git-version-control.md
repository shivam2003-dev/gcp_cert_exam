---
sidebar_position: 2
---

# Git & Version Control Interview Deck

Senior-level Git scenarios that frequently surface in panel rounds. Focus on strategy, recovery, and production hygiene rather than rote commands.

## Quick Primer

- Use **forks** for long-lived contributions outside the main org repo; use **clone** for day-to-day work inside the same trust boundary.
- Keep the default branch protected; require PR reviews + automated checks.
- Treat Git history as an audit log—rewrite only on feature branches.

## Core Questions

### 1. Fork vs Clone in a Regulated Org
<details>
<summary>Explain when you choose fork over clone in enterprise setups.</summary>

Forks create an isolated namespace under your account or another org, perfect when contributors lack push rights to the upstream repository (common for contractors or OSS contributions). Cloning keeps the same remote and is preferable when you already have write privileges and need to collaborate inside the same security boundary. In regulated orgs we often fork public SDKs, mirror them to the internal GitHub Enterprise instance, and then keep forks in sync via scheduled `git fetch upstream && git merge upstream/main` jobs.
</details>

### 2. Git Fetch vs Git Pull Pipeline Impact
<details>
<summary>Why do you encourage teams to run fetch before pull?</summary>

`git fetch` updates refs without touching the working tree. CI agents run `git fetch --depth=1 origin main` to keep checkout times low, then explicitly reset to `FETCH_HEAD`. Pull performs an implicit merge or rebase, which may create merge commits on developer laptops and complicate bisects. Teaching engineers to fetch first lets them inspect `git log origin/main..HEAD` before deciding whether to rebase or merge.
</details>

### 3. Rebase vs Merge Policy
<details>
<summary>Describe your merge strategy for long-lived feature branches.</summary>

We rebase feature branches against `main` daily to keep history linear, then use squash merges for small PRs and regular merge commits for release branches that shouldn’t be flattened (so we retain the granularity of hotfix commits). Release managers tag the merge commit (`v2024.11.0`) and sign it using GPG to satisfy compliance.

:::warning Production Warning
Never rebase or force-push protected branches that other engineers already track; enforce this via GitHub’s branch protection rules.
:::

</details>

### 4. Handling Merge Conflicts at Scale
<details>
<summary>Walk through your conflict-resolution workflow.</summary>

1. Recreate the conflict locally (`git pull --rebase origin main`).
2. Use `git diff --name-only --diff-filter=U` to scope conflicted files.
3. Open each file with conflict markers, decide winning blocks, re-run tests.
4. `git rebase --continue`, then force-push the feature branch.
5. Document the root cause—often missing tests or shared files lacking ownership—which feeds into post-merge action items.
</details>

### 5. Repairing Accidental Secrets
<details>
<summary>Response plan when secrets land in Git history.</summary>

- Rotate the credential immediately (cloud IAM, k8s secret, etc.).
- Use `git filter-repo --invert-paths --path secret.yaml` (or BFG Repo-Cleaner) to purge the secret from history.
- Force-push the cleaned branch and invalidate cached clones via `git gc --prune=now` on server-side mirrors.
- Add a `pre-commit` hook scanning for high-entropy strings plus enforce `detect-secrets` or GitHub push protection moving forward.
</details>

### 6. Squashing Commits for Auditability
<details>
<summary>How do you keep commit history tidy while preserving traceability?</summary>

Engineers rebase interactively (`git rebase -i origin/main`) and squash WIP commits before opening PRs. For releases we do not squash; instead we tag and sign the merge commit so `git describe --tags` remains informative. Code owners rely on structured commit messages (`feat|fix|chore|docs: subject`) to build changelogs automatically.
</details>

## Hands-on Assignment

1. Fork `https://github.com/techlearn-platform/sample-api`.
2. Implement a feature branch, commit twice, squash to one logical commit, and open a PR against upstream.
3. Document the output of `git log --graph --oneline --decorate -5` in the PR description to prove history cleanliness.

## Additional References

- GitHub Engineering – [How we rebase large monorepos safely](https://github.blog/)
- Atlassian – [Branching strategy playbook](https://www.atlassian.com/git/tutorials/comparing-workflows)
- Trunk.io – [Scaling pre-commit enforcement](https://trunk.io/blog)
