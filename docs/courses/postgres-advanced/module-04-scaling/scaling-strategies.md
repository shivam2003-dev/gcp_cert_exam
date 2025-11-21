# Scaling Strategies

## Vertical vs Horizontal Scaling

### Vertical Scaling

**Vertical scaling** means increasing resources on a single server:
- More CPU cores
- More RAM
- Faster storage
- Better network

**Pros:**
- Simple - no application changes
- No data distribution complexity
- Lower latency (single node)

**Cons:**
- Limited by hardware maximums
- Single point of failure
- Expensive at high scale
- Downtime for upgrades

### Horizontal Scaling

**Horizontal scaling** means adding more servers:
- Multiple database instances
- Read replicas
- Sharding
- Partitioning

**Pros:**
- Unlimited scale potential
- High availability
- Cost-effective
- No downtime for scaling

**Cons:**
- Application complexity
- Data distribution challenges
- Consistency trade-offs
- Network latency

## When to Scale Vertically

- Small to medium workloads
- Low latency requirements
- Simple architecture preferred
- Budget allows for premium hardware

## When to Scale Horizontally

- Very large datasets
- High read load
- Need high availability
- Cost optimization important

## Next Steps

Continue to [Streaming Replication](./streaming-replication) to learn about physical replication.

