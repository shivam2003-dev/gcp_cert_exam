---
sidebar_position: 9
---

# Observability & Monitoring Interview Deck

Demonstrate understanding of metrics, logs, traces, and alert hygiene.

## Core Questions

### 1. Monitoring vs Observability
<details>
<summary>Explain difference.</summary>

Monitoring answers "is it up?" via pre-defined dashboards. Observability helps answer "why is it failing?" by exposing high-cardinality metrics, structured logs, and traces that let you interrogate unknown unknowns.
</details>

### 2. Emitting Custom Metrics & Logs
<details>
<summary>How do you instrument services?</summary>

- Use OpenTelemetry SDKs to emit traces + metrics.
- Standardize log fields (tenant, request_id, severity) and ship via Fluent Bit.
- For Go services, expose `/metrics` for Prometheus scraping and structured JSON logs.
</details>

### 3. Push vs Pull Monitoring
<details>
<summary>Comparison.</summary>

Prometheus pull model simplifies service discovery, but push is useful for short-lived jobs (use Pushgateway) or air-gapped networks. We often mix both: scrape 90% workloads, push from batch jobs.
</details>

### 4. Noise Reduction Strategy
<details>
<summary>Woken up at 2AM by false alarms—what's next?</summary>

- Analyze alert history, identify flapping signals.
- Introduce multi-window burn-rate alerts aligning with SLOs (e.g., 1h/6h windows).
- Add automatic dampening (`for: 5m`), dedupe via PagerDuty event rules, and ensure alerts map to runbooks.
</details>

### 5. Tracing Microservices
<details>
<summary>How do you trace requests across services?</summary>

Inject W3C trace-context headers at ingress, propagate through services, export to Jaeger/Tempo. Enrich spans with k8s metadata for quick slicing.
</details>

### 6. OOMKilled Pod Investigation
<details>
<summary>Observability angle.</summary>

Scrape container memory metrics, correlate with OOM events (`kube_pod_container_status_last_terminated_reason`). Use `kubectl describe pod` for last state, inspect GC or allocation spikes. Adjust requests/limits and add memory profiling.
</details>

## Reference Dashboards

- Golden signals (latency, traffic, errors, saturation).
- Kubernetes cluster health.
- Business SLIs (checkout success, ingestion throughput).

## Additional References

- Google SRE Workbook – [Alerting on SLOs](https://sre.google/workbook/)
- Prometheus – [Alertmanager best practices](https://prometheus.io/docs/alerting/latest/)
- Honeycomb – [High-cardinality observability](https://www.honeycomb.io/blog/)
