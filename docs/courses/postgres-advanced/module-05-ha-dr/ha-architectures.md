# HA Architectures

## Overview

High availability (HA) architectures ensure systems stay online despite failures. This chapter covers common HA patterns for PostgreSQL.

## Active-Standby Architecture

### Basic Setup

```
Primary (Active)
    |
    | WAL Streaming
    |
Standby (Passive)
```

**Characteristics:**
- Primary handles all traffic
- Standby ready for failover
- Automatic or manual promotion
- Zero or minimal data loss

**Use Cases:**
- Disaster recovery
- Planned maintenance
- Read scaling (standby can serve reads)

## Active-Active Architecture

### Multi-Master Setup

```
Primary 1 (Active)
    |
    | Logical Replication
    |
Primary 2 (Active)
```

**Characteristics:**
- Multiple active nodes
- Bidirectional replication
- Conflict resolution needed
- Higher complexity

**Use Cases:**
- Geographic distribution
- Write scaling (limited)
- High availability

:::warning Complexity Warning
Active-active setups are complex and have limitations. Most use cases are better served by active-standby.
:::

## Patroni-Based Clusters

Patroni provides automated HA management:

```
Leader (Active)
    |
    | Streaming Replication
    |
Replica 1 (Standby)
Replica 2 (Standby)
```

**Features:**
- Automatic leader election
- Automatic failover
- Configuration management
- Health checks

## Architecture Patterns

### Pattern 1: Single Standby

```
Primary -> Standby
```

**Pros:** Simple, cost-effective
**Cons:** Single point of failure (standby)

### Pattern 2: Multiple Standbys

```
Primary -> Standby 1
       -> Standby 2
       -> Standby 3
```

**Pros:** Redundancy, read scaling
**Cons:** More resources

### Pattern 3: Cascading Replication

```
Primary -> Standby 1 -> Standby 2
```

**Pros:** Reduces primary load
**Cons:** Increased lag for Standby 2

## Failover Strategies

### Automatic Failover

- Patroni-based clusters
- Health check failures trigger failover
- Leader election
- Application reconnection

### Manual Failover

- Operator-initiated
- Planned maintenance
- Testing procedures
- Controlled switchover

## Split-Brain Prevention

**Split-brain** occurs when multiple nodes think they're primary.

**Prevention:**
- Quorum-based decisions
- External coordination (etcd, Consul)
- Fencing mechanisms
- Witness nodes

## Best Practices

1. **Multiple replicas** - Don't rely on single standby
2. **Test failover** - Regularly test procedures
3. **Monitor health** - Automated health checks
4. **Document procedures** - Runbooks for operations
5. **Use Patroni** - For automated HA management

:::tip Production Insight
HA is not optional for production. Start with active-standby, add more replicas as needed, use Patroni for automation.
:::

## Next Steps

Continue to [Streaming Replication Setup](./replication-setup) for detailed replication configuration.
