# Connection Pooling

## Overview

**Connection pooling** reduces overhead by reusing database connections instead of creating new ones for each request.

## Why Connection Pooling?

### Connection Overhead

Each PostgreSQL connection:
- Uses ~10MB of memory
- Has initialization overhead
- Limits total connections (max_connections)

### Without Pooling

```python
# Bad: New connection per request
for request in requests:
    conn = psycopg2.connect(...)  # Expensive!
    cursor = conn.cursor()
    cursor.execute(query)
    conn.close()
```

### With Pooling

```python
# Good: Reuse connections
pool = psycopg2.pool.SimpleConnectionPool(1, 20, ...)
for request in requests:
    conn = pool.getconn()  # Reused connection
    cursor = conn.cursor()
    cursor.execute(query)
    pool.putconn(conn)  # Return to pool
```

## PgBouncer

**PgBouncer** is a lightweight connection pooler for PostgreSQL.

### Installation

```bash
# Ubuntu/Debian
apt-get install pgbouncer

# Or compile from source
```

### Configuration

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 100
max_user_connections = 100
```

### Pool Modes

#### Session Pooling

```ini
pool_mode = session
```

- Connection held for entire session
- Best for: Long-running transactions
- Worst for: High concurrency

#### Transaction Pooling

```ini
pool_mode = transaction
```

- Connection held only for transaction
- Best for: Short transactions, high concurrency
- Limitations: Some features not supported

#### Statement Pooling

```ini
pool_mode = statement
```

- Connection held only for statement
- Best for: Autocommit mode
- Limitations: Transactions not supported

### Starting PgBouncer

```bash
# Start PgBouncer
pgbouncer -d pgbouncer.ini

# Connect through pool
psql -h localhost -p 6432 -U user -d mydb
```

## Application-Level Pooling

### Python (psycopg2)

```python
from psycopg2 import pool

# Create pool
connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,
    host="localhost",
    database="mydb",
    user="user",
    password="password"
)

# Use pool
conn = connection_pool.getconn()
# ... use connection ...
connection_pool.putconn(conn)
```

### Python (SQLAlchemy)

```python
from sqlalchemy import create_engine

# Engine manages pool automatically
engine = create_engine(
    'postgresql://user:password@localhost/mydb',
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True
)
```

### Node.js (pg)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  user: 'user',
  password: 'password',
  max: 20,  // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool
pool.query('SELECT * FROM users', (err, res) => {
  // ...
});
```

## Pool Sizing

### Calculate Pool Size

```
pool_size = (max_connections - superuser_reserve) / num_app_servers
```

**Example:**
- max_connections = 100
- superuser_reserve = 10
- app_servers = 3
- pool_size = (100 - 10) / 3 = 30 per server

### Common Mistakes

**Too Small:**
- Connections exhausted
- Requests wait for connections
- Poor performance

**Too Large:**
- Wastes memory
- May exceed max_connections
- No benefit

## Monitoring Pools

### PgBouncer Statistics

```sql
-- Connect to PgBouncer admin database
psql -h localhost -p 6432 -U pgbouncer pgbouncer

-- Show pools
SHOW POOLS;

-- Show clients
SHOW CLIENTS;

-- Show servers
SHOW SERVERS;

-- Show stats
SHOW STATS;
```

### Application Pool Stats

Monitor pool metrics:
- Active connections
- Idle connections
- Wait time for connections
- Connection errors

## Best Practices

1. **Use transaction pooling** - For most applications
2. **Size pools correctly** - Not too small, not too large
3. **Monitor pool usage** - Track metrics
4. **Set timeouts** - Prevent connection leaks
5. **Use PgBouncer** - For high concurrency
6. **Test under load** - Verify pool sizing

:::tip Production Insight
Connection pooling is essential for high-concurrency applications. PgBouncer can handle 1000s of client connections with just 25 database connections.
:::

## Next Steps

You've completed Module 4! Move to [Module 5: High Availability & Disaster Recovery](../module-05-ha-dr/intro).
