---
sidebar_position: 12
---

# Scripting & Tooling Interview Deck

Focus on automation stories and language choices.

## Core Questions

### 1. Daily Python Usage
<details>
<summary>Describe a recent automation.</summary>

Example: Python script that scans CloudWatch metrics for anomalies, opens Jira tickets, and posts to Slack webhook. Uses `boto3`, `pandas`, Pydantic validation, packaged with Poetry and executed via Lambda or containerized cronjob.
</details>

### 2. Pattern Search in Massive Logs
<details>
<summary>Approach.</summary>

Use `gzip` + `zgrep` for compressed logs, or write Python streaming script (use `fileinput` module) that yields matches without loading entire file. In distributed environments, push logs to OpenSearch and query via DSL.
</details>

### 3. Favorite DevOps Packages
<details>
<summary>List with justification.</summary>

- `boto3/azure-mgmt` for cloud automation.
- `rich` or `click` for CLI UX.
- `pyinvoke` or `fabric` for orchestration.
- `jq`, `yq`, `jo` for JSON/YAML manipulation in shell.
</details>

### 4. Service Health Monitor Script
<details>
<summary>Outline.</summary>

Bash script loops through service list, runs `systemctl is-active`, logs output with timestamps, triggers PagerDuty via API if failure persists after configurable retries. Cron-scheduled and writes to `/var/log/service-health.log`.
</details>

### 5. Bulk User Report
<details>
<summary>Create CSV of today’s logins.</summary>

`last -F | awk 'NR>1 {print $1","$5","$6" "$7}' > logins.csv`. In stricter setups query auditd logs or Active Directory (ldapsearch) and enrich output.
</details>

## Additional References

- Real Python – [Automating DevOps workflows](https://realpython.com/)
- ShellHacks – [Bash scripting cookbook](https://www.shellhacks.com/)
