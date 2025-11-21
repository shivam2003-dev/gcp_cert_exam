# Partition Management

## Adding Partitions

```sql
CREATE TABLE orders_2024_02 PARTITION OF orders
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

## Dropping Partitions

```sql
DROP TABLE orders_2023_01;
```

## Next Steps

Continue to [High Concurrency](./high-concurrency).

