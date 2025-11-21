# Module 5: High Availability & Disaster Recovery

## Overview

Production databases must survive failures. This module covers HA architectures, replication, failover, backups, and disaster recovery procedures.

## Learning Objectives

By the end of this module, you will understand:

- High availability architectures
- Streaming replication for HA
- Patroni-based cluster management
- Failover procedures and split-brain prevention
- Backup strategies (pg_dump, pg_basebackup, continuous archiving)
- Point-in-time recovery (PITR)
- RPO and RTO design

## Module Structure

1. [HA Architectures](./ha-architectures) - Designing for availability
2. [Streaming Replication Setup](./replication-setup) - Configuring replication
3. [Patroni Clusters](./patroni) - Automated failover
4. [Backup Strategies](./backups) - Different backup methods
5. [Disaster Recovery](./disaster-recovery) - Recovery procedures

## Why This Matters

HA and DR are critical for:

- **Business continuity** - Systems must stay online
- **Data protection** - Preventing data loss
- **Compliance** - Meeting RPO/RTO requirements
- **Customer trust** - Reliable service
- **Disaster recovery** - Recovering from failures

:::warning Production Critical
A database without proper HA/DR is a time bomb. Understanding these concepts is not optional for production systems.
:::

## Next Steps

Start with [HA Architectures](./ha-architectures).

