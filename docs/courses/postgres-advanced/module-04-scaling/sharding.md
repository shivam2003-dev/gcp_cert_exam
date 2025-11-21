# Sharding

## Overview

**Sharding** distributes data across multiple independent databases. Each shard contains a subset of the data, allowing horizontal write scaling.

## Sharding Strategies

### 1. Application-Level Sharding

Application routes queries to appropriate shard:

```python
def get_shard(user_id):
    shard_num = user_id % 4
    return f"shard_{shard_num}"

# Route query to shard
shard = get_shard(user_id)
query = f"SELECT * FROM users WHERE id = {user_id}"
execute_on_shard(shard, query)
```

**Pros:**
- Full control
- No special software needed
- Flexible routing

**Cons:**
- Application complexity
- Manual rebalancing
- Cross-shard queries difficult

### 2. Proxy-Based Sharding

Proxy handles routing:

```conf
# Proxy configuration
shard_key = user_id
shard_function = modulo
num_shards = 4
```

**Tools:**
- **PgShard** - PostgreSQL sharding proxy
- **Citus** - PostgreSQL extension
- **pg_partman** - Partition management

### 3. Citus Extension

Citus provides distributed PostgreSQL:

```sql
-- Enable extension
CREATE EXTENSION citus;

-- Create distributed table
SELECT create_distributed_table('users', 'id');

-- Query automatically routed
SELECT * FROM users WHERE id = 123;  -- Goes to correct shard
```

**Features:**
- Automatic sharding
- Distributed queries
- Rebalancing
- High availability

## Shard Key Selection

Choose shard key carefully:

### Good Shard Keys

- **High cardinality** - Many unique values
- **Even distribution** - Data spread evenly
- **Query alignment** - Most queries filter on shard key

### Bad Shard Keys

- **Low cardinality** - Few unique values
- **Skewed distribution** - Uneven data
- **Not in queries** - Requires cross-shard queries

## Sharding Patterns

### Hash-Based Sharding

```python
shard_id = hash(user_id) % num_shards
```

**Pros:** Even distribution
**Cons:** Hard to rebalance

### Range-Based Sharding

```python
if user_id < 1000000:
    shard = 'shard_0'
elif user_id < 2000000:
    shard = 'shard_1'
```

**Pros:** Easy to understand
**Cons:** Can cause hotspots

### Directory-Based Sharding

```python
shard = lookup_shard(user_id)  # From directory/mapping table
```

**Pros:** Flexible, easy rebalancing
**Cons:** Extra lookup overhead

## Challenges

### 1. Cross-Shard Queries

```sql
-- This requires querying all shards
SELECT COUNT(*) FROM users WHERE status = 'active';
```

**Solutions:**
- Aggregate in application
- Use materialized views
- Accept eventual consistency

### 2. Transactions Across Shards

```sql
-- This is difficult with sharding
BEGIN;
UPDATE users SET balance = balance - 100 WHERE id = 1;  -- Shard 1
UPDATE orders SET total = 100 WHERE user_id = 1;        -- Shard 2
COMMIT;
```

**Solutions:**
- Two-phase commit (complex)
- Saga pattern
- Design to avoid cross-shard transactions

### 3. Rebalancing

Moving data between shards:

- **Dual writes** - Write to old and new shard
- **Background migration** - Copy data gradually
- **Switchover** - Cut over when complete

## When to Shard

**Consider sharding when:**
- Single database can't handle write load
- Table too large for single database
- Need geographic distribution
- Vertical scaling exhausted

**Don't shard if:**
- Can solve with partitioning
- Can solve with read replicas
- Application doesn't support it
- Team lacks expertise

## Best Practices

1. **Start without sharding** - Only shard when necessary
2. **Choose shard key carefully** - Affects everything
3. **Plan for rebalancing** - Will be needed
4. **Minimize cross-shard queries** - Design around shards
5. **Test thoroughly** - Sharding adds complexity
6. **Monitor closely** - Catch issues early

:::warning Production Warning
Sharding significantly increases complexity. Only use when other scaling options are exhausted. Most applications never need sharding.
:::

## Next Steps

Continue to [Connection Pooling](./connection-pooling) to learn about managing database connections.
