---
sidebar_position: 8
---

# Kubernetes Interview Deck

Covers control-plane comprehension, networking, and production pitfalls.

## Core Questions

### 1. Cluster Architecture Walkthrough
<details>
<summary>Explain control-plane + node components.</summary>

- API Server: front door & RBAC enforcement.
- etcd: strongly consistent key-value store.
- Controller Manager & Scheduler: reconcile desired vs current state.
- Kubelet: node agent ensuring pods run.
- kube-proxy: programs iptables/IPVS for Services.
</details>

### 2. CrashLoopBackOff Playbook
<details>
<summary>Step-by-step.</summary>

- `kubectl describe pod` for last events.
- `kubectl logs pod -c container --previous` to view prior crash output.
- Check liveness/readiness misconfig (failing probes restart pods repeatedly).
- Ensure config/secret mounts exist and permissions correct.
</details>

### 3. Services & Kube-Proxy
<details>
<summary>Relationship explanation.</summary>

Services create virtual IPs; kube-proxy watches API server and programs iptables/IPVS rules mapping ClusterIP to pod endpoints. NodePort exposes service on each node; LoadBalancer integrates with cloud LB. Headless service (`clusterIP: None`) publishes endpoints directly for StatefulSets.
</details>

### 4. Restricting DB Pod Access
<details>
<summary>Scenario-based answer.</summary>

Use NetworkPolicies: allow ingress from specific app label selector; default deny all other traffic. Example:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-db
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: payments
      podSelector:
        matchLabels:
          app: payments-api
    ports:
    - protocol: TCP
      port: 5432
```
</details>

### 5. Pod replica mismatch
<details>
<summary>Deployment wants 3 pods but only 1 running.</summary>

Check events for insufficient CPU, pending PVs, or taints. Use `kubectl get events --sort-by='.metadata.creationTimestamp'` and `kubectl describe node` to inspect taints. HPA misconfiguration may also throttle replicas.
</details>

### 6. ConfigMap Updates Not Applied
<details>
<summary>Answer.</summary>

Volume-mounted ConfigMaps update only when pod restarts. Use `kubectl rollout restart deployment/foo` or implement checksum-based annotations so new pods roll automatically.
</details>

## Additional References

- Kubernetes.io – [Production best practices](https://kubernetes.io/docs/setup/production-environment/)
- Learnk8s – [Troubleshooting handbook](https://learnk8s.io/blog)
- CNCF TAG Observability – [Patterns for tracing in k8s](https://tag-observability.cncf.io/)
