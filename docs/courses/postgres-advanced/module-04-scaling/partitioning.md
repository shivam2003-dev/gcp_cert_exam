# Partitioning

## Overview

Partitioning splits large tables into smaller, manageable pieces.

## Range Partitioning

```sql
CREATE TABLE orders (
    id SERIAL,
    created_at TIMESTAMP,
    total DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_01 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## List Partitioning

```sql
CREATE TABLE users (
    id SERIAL,
    country VARCHAR(2)
) PARTITION BY LIST (country);

CREATE TABLE users_us PARTITION OF users
    FOR VALUES IN ('US');
```

## Hash Partitioning

```sql
CREATE TABLE data (
    id SERIAL,
    value TEXT
) PARTITION BY HASH (id);

CREATE TABLE data_0 PARTITION OF data
    FOR VALUES WITH (modulus 4, remainder 0);
```

## Next Steps

Continue to [Sharding](./sharding).

