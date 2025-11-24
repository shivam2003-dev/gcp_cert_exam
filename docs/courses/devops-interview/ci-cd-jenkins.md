---
sidebar_position: 5
---

# CI/CD & Jenkins Interview Deck

Focus on failure handling, pipeline governance, and supply-chain safeguards.

## Pipeline Blueprint

- Declarative Jenkinsfile stored with app code.
- Shared library for common stages (build, test, security, deploy).
- Artifacts stored in Artifactory/ECR with provenance metadata.
- Quality gates: lint → unit → integration → security scans → deploy.

## Core Questions

### 1. Jenkins Shared Libraries
<details>
<summary>How do they work and why use them?</summary>

Shared libraries encapsulate reusable Groovy code. Teams declare `@Library('platform-lib@main') _` at top of Jenkinsfile, granting access to versioned steps (`platformDockerBuild()`). They reduce duplication, enforce policy (e.g., vulnerability scanning), and ease upgrades.
</details>

### 2. CI Works Locally but Fails in Jenkins
<details>
<summary>Triage plan.</summary>

- Compare dependency versions (Python venv, Node, Java). Use lockfiles.
- Check environment variables and secrets injection.
- Inspect workspace cleanliness; Jenkins often reuses workspace unless `cleanWs()`.
- Examine agent OS differences (Alpine vs Ubuntu) or architecture (ARM builds!).
</details>

### 3. Pipeline Success but Production Broken
<details>
<summary>Needle-moving answer.</summary>

- Validate environment parity; maybe staging uses SQLite while prod uses Postgres.
- Check feature flags toggled post-deploy.
- Confirm observability gating—deploy only after smoke tests & synthetic checks.
- Use automated rollback (Argo Rollouts/K8s HPA) triggered by SLO breaches.
</details>

### 4. Pipeline Slows Over Time
<details>
<summary>Optimization approach.</summary>

- Profile stage timings from Jenkins Blue Ocean or DataDog CI Visibility.
- Cache dependencies strategically (Docker layer caching, npm cache, Maven local repo). Purge when causing mismatches.
- Parallelize independent stages; use matrix builds for multi-platform tests.
</details>

### 5. Build Fails—Dependency Download Error
<details>
<summary>Mitigation.</summary>

- Mirror dependencies to private repo (Artifactory, Nexus) with retention policy.
- Configure retries with exponential backoff.
- Pre-warm caches on long-running agents.
</details>

### 6. Triggerless Feature Branch
<details>
<summary>Why would a new branch skip pipeline?</summary>

Common reasons: Jenkins multibranch job filter regex excludes branch, webhooks misconfigured, or branch names contain characters blocked by Jenkins. Fix by updating `by default ignore` patterns and verifying GitHub webhook deliveries.
</details>

## Additional References

- Jenkins.io – [Shared library patterns](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- Harness – [CI/CD best practices](https://www.harness.io/blog)
- OWASP – [CI/CD security cheat sheet](https://cheatsheetseries.owasp.org/)
