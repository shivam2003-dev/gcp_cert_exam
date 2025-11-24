---
sidebar_position: 7
---

# Docker & Containerization Interview Deck

Targets real production issues: image hygiene, debugging, and registry ops.

## Core Questions

### 1. Container Exits Immediately
<details>
<summary>Diagnosis steps.</summary>

- Check entrypoint/cmd; container exits when main process ends.
- Review logs via `docker logs <id>` or `kubectl logs`.
- Use `docker run -it --entrypoint /bin/sh image` to reproduce locally.
- Ensure long-running processes stay in foreground (no daemonizing).
</details>

### 2. Purpose of EXPOSE
<details>
<summary>Commonly misunderstood.</summary>

`EXPOSE 8080` documents container ports and informs runtime defaults. It does **not** publish ports; you still need `-p 8080:8080` or Kubernetes Service. We ensure Dockerfiles list only actually used ports to avoid confusion.
</details>

### 3. Persistence Across Restarts
<details>
<summary>Data lost after container restart—how to fix?</summary>

Mount volumes: `docker run -v /data/app:/var/lib/app`. In Kubernetes use PVCs with defined storage class. For single-writer workloads we prefer StatefulSets with volumeClaimTemplates.
</details>

### 4. App Change Not Reflected After Rebuild
<details>
<summary>Explain.</summary>

Likely due to build cache. Ensure `COPY package.json` before `npm install` so rebuild invalidates cache when code changes. Alternatively run `docker build --no-cache` for verification.
</details>

### 5. Cleaning Disk Space
<details>
<summary>Docker host running out of disk.</summary>

Use `docker system df`, then `docker image prune -a`, `docker container prune`, remove dangling volumes. Automate via cron/CI. In Kubernetes, configure `imageGC` thresholds and ephemeral storage limits.
</details>

### 6. Debugging Live Container
<details>
<summary>How do you inspect without exec privileges?</summary>

Use `kubectl debug` (ephemeral debug containers) or `nsenter` into namespace with read-only shell. Alternatively run `docker cp` to extract logs. Always respect compliance—some environments forbid shell access, so rely on telemetry.
</details>

## Registry Practices

- Sign images (Sigstore/Cosign).
- Scan on push (Trivy, Grype) and block critical CVEs.
- Enforce immutability + retention windows to curb bloat.

## Additional References

- Docker Docs – [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- Chainguard – [Securing container supply chains](https://www.chainguard.dev/blog)
- Google SRE – [Borg/Omega container lessons](https://sre.google/resources/)
