# Logical Replication

## Overview

Logical replication replicates at the logical level, allowing selective table replication.

## Setup

```sql
-- Create publication
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- Create subscription
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=primary_host dbname=mydb user=replicator'
PUBLICATION my_publication;
```

## Next Steps

Continue to [Partitioning](./partitioning).

