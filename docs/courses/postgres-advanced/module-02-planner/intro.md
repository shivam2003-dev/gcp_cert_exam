# Module 2: Query Planner & Performance Tuning

## Overview

The query planner is PostgreSQL's brain. It decides how to execute your queries. Understanding how it works is essential for writing fast queries and fixing slow ones.

## Learning Objectives

By the end of this module, you will understand:

- How the query planner works
- How to read and interpret query plans
- Different index types and when to use them
- How to identify and fix slow queries
- Common query anti-patterns
- Performance tuning techniques

## Module Structure

1. [Query Planner Basics](./planner-basics) - How PostgreSQL plans queries
2. [EXPLAIN and Query Plans](./explain-plans) - Reading and interpreting plans
3. [Index Types Deep Dive](./index-types) - B-Tree, GIN, GiST, BRIN, Hash
4. [Statistics and ANALYZE](./statistics-analyze) - How statistics affect planning
5. [Slow Query Analysis](./slow-queries) - Finding and fixing slow queries
6. [Query Anti-Patterns](./anti-patterns) - Common mistakes and fixes
7. [Performance Tuning Techniques](./tuning-techniques) - Optimization strategies

## Why This Matters

Understanding the planner helps you:

- **Write better queries** - Know what the planner sees
- **Fix slow queries** - Understand why they're slow
- **Choose right indexes** - Match indexes to query patterns
- **Tune configurations** - Help the planner make better decisions
- **Debug performance** - Diagnose query performance issues

:::tip Production Insight
Most performance problems come from poor query plans. Understanding the planner is the key to fixing them.
:::

## Next Steps

Start with [Query Planner Basics](./planner-basics) to understand how PostgreSQL decides how to execute queries.

