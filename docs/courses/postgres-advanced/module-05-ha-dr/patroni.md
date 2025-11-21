# Patroni Clusters

## Overview

**Patroni** provides automated high availability management for PostgreSQL clusters using distributed consensus (etcd, Consul, ZooKeeper).

## How Patroni Works

1. **Leader election** - Uses distributed consensus
2. **Health monitoring** - Checks PostgreSQL health
3. **Automatic failover** - Promotes replica on failure
4. **Configuration management** - Manages postgresql.conf
5. **Replication management** - Handles streaming replication

## Architecture

```
etcd/Consul (Consensus)
    |
    |
Leader (Primary)
    |
    | Streaming Replication
    |
Replica 1
Replica 2
```

## Installation

### Install Patroni

```bash
pip install patroni[etcd]
```

### Install etcd

```bash
# Ubuntu/Debian
apt-get install etcd

# Or use Docker
docker run -d -p 2379:2379 quay.io/coreos/etcd
```

## Configuration

### patroni.yml

```yaml
scope: postgres
namespace: /db/
name: postgres1

restapi:
  listen: 0.0.0.0:8008
  connect_address: 192.168.1.1:8008

etcd:
  hosts: 192.168.1.10:2379

bootstrap:
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 30
    maximum_lag_on_failover: 1048576
    postgresql:
      use_pg_rewind: true
      parameters:
        wal_level: replica
        hot_standby: "on"
        max_connections: 100
        max_wal_senders: 10
        wal_keep_size: 1GB

postgresql:
  listen: 0.0.0.0:5432
  connect_address: 192.168.1.1:5432
  data_dir: /var/lib/postgresql/data
  pgpass: /var/lib/postgresql/.pgpass
  authentication:
    replication:
      username: replicator
      password: secure_password
    superuser:
      username: postgres
      password: secure_password
  parameters:
    unix_socket_directories: '/var/run/postgresql'

tags:
  nofailover: false
  noloadbalance: false
  clonefrom: false
  nosync: false
```

## Starting Patroni

```bash
# Start Patroni
patroni patroni.yml

# Or as systemd service
systemctl start patroni
```

## Cluster Operations

### Check Cluster Status

```bash
# Via REST API
curl http://localhost:8008/patroni

# Via etcd
etcdctl get /db/leader
```

### Manual Failover

```bash
# Via REST API
curl -X POST http://leader:8008/failover
```

### Switchover

```bash
# Graceful switchover
curl -X POST http://leader:8008/switchover
```

## Monitoring

### REST API Endpoints

- `GET /patroni` - Cluster status
- `GET /health` - Health check
- `GET /history` - Failover history
- `POST /restart` - Restart PostgreSQL
- `POST /reload` - Reload configuration

### Integration with Monitoring

```bash
# Prometheus metrics
curl http://localhost:8008/metrics
```

## Best Practices

1. **Use etcd/Consul** - For distributed consensus
2. **Multiple replicas** - At least 2 for HA
3. **Monitor Patroni** - Track cluster health
4. **Test failover** - Regularly test procedures
5. **Document procedures** - For operations team

:::tip Production Insight
Patroni is the industry standard for PostgreSQL HA. It handles the complexity of leader election and failover automatically.
:::

## Next Steps

Continue to [Backup Strategies](./backups) to learn about different backup methods.
