# Connection Pooling

## Overview

Connection pooling reduces overhead by reusing database connections.

## PgBouncer

```conf
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

## Next Steps

You've completed Module 4! Move to [Module 5: High Availability & Disaster Recovery](../module-05-ha-dr/intro).

