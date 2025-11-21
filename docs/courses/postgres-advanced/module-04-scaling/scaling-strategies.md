# Scaling Strategies

## Vertical vs Horizontal Scaling

### Vertical Scaling

**Vertical scaling** (scale up) means increasing resources on a single server:
- More CPU cores
- More RAM
- Faster storage (SSD, NVMe)
- Better network

**Pros:**
- Simple - no application changes needed
- No data distribution complexity
- Lower latency (single node)
- Easier to manage

**Cons:**
- Limited by hardware maximums
- Single point of failure
- Expensive at high scale
- Downtime required for upgrades
- Diminishing returns

**When to Use:**
- Small to medium workloads
- Low latency requirements
- Simple architecture preferred
- Budget allows for premium hardware
- Application doesn't support horizontal scaling

### Horizontal Scaling

**Horizontal scaling** (scale out) means adding more servers:
- Multiple database instances
- Read replicas
- Sharding
- Partitioning

**Pros:**
- Unlimited scale potential
- High availability (no single point of failure)
- Cost-effective (commodity hardware)
- No downtime for scaling
- Geographic distribution possible

**Cons:**
- Application complexity increases
- Data distribution challenges
- Consistency trade-offs
- Network latency between nodes
- More complex operations

**When to Use:**
- Very large datasets
- High read load
- Need high availability
- Cost optimization important
- Geographic distribution needed

## Scaling Dimensions

### Read Scaling

Distribute read queries across multiple replicas:

```sql
-- Primary handles writes
INSERT INTO users (email) VALUES ('user@example.com');

-- Replicas handle reads
SELECT * FROM users WHERE email = 'user@example.com';  -- On replica
```

**Techniques:**
- Streaming replication (read replicas)
- Connection pooling with read/write splitting
- Application-level routing

### Write Scaling

PostgreSQL has limited write scaling options:

1. **Partitioning** - Distribute writes across partitions
2. **Sharding** - Split data across multiple databases
3. **Read replicas with async writes** - Acceptable for some workloads

:::warning Reality Check
PostgreSQL doesn't scale writes horizontally easily. Most write scaling requires application-level sharding or accepting eventual consistency.
:::

## Scaling Approaches

### 1. Read Replicas

**Best for:** Read-heavy workloads

```sql
-- Primary: All writes
-- Replica 1: Read queries
-- Replica 2: Read queries
-- Replica 3: Read queries
```

**Limitations:**
- Replication lag
- Eventually consistent reads
- Write capacity unchanged

### 2. Partitioning

**Best for:** Large tables with time-based or categorical data

```sql
-- Partition by date
CREATE TABLE orders (...) PARTITION BY RANGE (created_at);
```

**Benefits:**
- Faster queries (partition pruning)
- Easier maintenance
- Better for archival

**Limitations:**
- Still single database
- Write scaling limited

### 3. Sharding

**Best for:** Very large datasets, need write scaling

```sql
-- Shard 1: users 1-1000000
-- Shard 2: users 1000001-2000000
-- Shard 3: users 2000001-3000000
```

**Benefits:**
- True horizontal write scaling
- Unlimited scale potential

**Limitations:**
- Application complexity
- Cross-shard queries difficult
- Data distribution challenges

### 4. Connection Pooling

**Best for:** High connection count

```conf
# PgBouncer
max_client_conn = 1000
default_pool_size = 25
```

**Benefits:**
- Handle more connections
- Reduce connection overhead

**Limitations:**
- Doesn't scale database capacity
- Just manages connections

## Choosing a Strategy

### Decision Matrix

| Workload Type | Recommended Approach |
|--------------|---------------------|
| Small to medium | Vertical scaling |
| Read-heavy | Read replicas |
| Very large tables | Partitioning |
| Need write scaling | Sharding |
| High connection count | Connection pooling |
| Need HA | Read replicas + failover |

## Scaling Checklist

Before scaling, consider:

1. **Identify bottleneck** - CPU, memory, I/O, connections?
2. **Measure current load** - Queries per second, data size
3. **Project growth** - How much will you need?
4. **Choose approach** - Based on workload characteristics
5. **Plan implementation** - Step-by-step approach
6. **Test thoroughly** - Before production deployment
7. **Monitor closely** - After deployment

## Best Practices

1. **Start simple** - Vertical scaling first
2. **Measure everything** - Know your bottlenecks
3. **Scale proactively** - Before hitting limits
4. **Test failover** - If using replicas
5. **Document procedures** - For operations team
6. **Monitor continuously** - Catch issues early

:::tip Production Insight
Most applications can scale vertically much further than expected. Only move to horizontal scaling when vertical scaling is exhausted or cost-prohibitive.
:::

## Next Steps

Continue to [Streaming Replication](./streaming-replication) to learn how to set up read replicas.
