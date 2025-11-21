# Load Balancing

## Types of Load Balancers

- **HTTP(S) Load Balancer:** Global, layer 7
- **TCP/UDP Load Balancer:** Regional or global, layer 4
- **Internal Load Balancer:** Regional, internal traffic only

## Creating HTTP(S) Load Balancer

```bash
# Create backend service
gcloud compute backend-services create BACKEND_SERVICE \
  --protocol=HTTP \
  --health-checks=HEALTH_CHECK \
  --global
```

