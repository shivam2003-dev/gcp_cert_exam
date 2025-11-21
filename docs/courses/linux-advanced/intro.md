# Advanced Linux Engineering: Internals, Performance & Production Troubleshooting

Welcome to the **Advanced Linux Engineering** course. This curriculum is designed for experienced engineers who operate Linux in production. It assumes you already know how to use Linux; we focus on how Linux behaves under real load, how it fails, and how to fix it when the pager goes off at 3 a.m.

## 🎯 Course Philosophy

- **Internals-first** – understand kernel behavior so you can reason about failures
- **Production obsession** – every topic ties back to an on-call scenario
- **Tool mastery** – strace, perf, tcpdump, blktrace, auditd, and more
- **Actionable playbooks** – learn what to do, not just theory

## 🧠 Audience & Prereqs

This course is for DevOps Engineers, SREs, Platform Engineers, Linux Administrators, and Backend Engineers responsible for Linux production systems. You should already be comfortable with:

- Basic Linux commands and shell scripting
- SSH, users, permissions, sudo
- systemctl/service management
- Editing configuration files and reading logs

## 🗂️ Modules

1. **Linux Architecture & Internals** – user/kernel space, syscalls, process lifecycle, boot, systemd internals
2. **Process, CPU & Scheduling Internals** – CFS, perf, affinity, RT scheduling, CPU troubleshooting
3. **Memory Management & Tuning** – virtual memory, OOM killer, THP, NUMA tuning, leak detection
4. **Storage & Filesystem Internals** – I/O stack, filesystems, schedulers, disk debugging and recovery
5. **Networking Internals** – TCP/IP deep dive, packet flow, netfilter, queues, network troubleshooting
6. **Linux Containers & Namespaces** – namespaces, cgroups, container internals, isolation failures
7. **Systemd & Service Management** – systemd architecture, journald, dependency debugging, crash recovery
8. **Observability & Troubleshooting** – incident workflows, logs, load debugging, unresponsive systems
9. **Performance Optimization & Hardening** – sysctl tuning, security controls, auditd, SELinux/AppArmor
10. **Production Failure Scenarios** – kernel panics, OOM storms, disk/inode exhaustion, network outages

## 🧰 Toolbelt

Expect deep dives into:
- `strace`, `perf`, `eBPF` tooling
- `vmstat`, `slabtop`, `/proc` internals
- `iostat`, `blktrace`, `fio`
- `ss`, `tcpdump`, `iproute2`, `conntrack`
- `systemd-analyze`, `journalctl`, `coredumpctl`
- `auditctl`, `ausearch`, `semanage`

## 🏗️ Learning Approach

Each module includes:
- Conceptual breakdowns of how Linux works internally
- Production-grade examples and CLI walkthroughs
- Failure case studies with investigation → fix → prevention
- Checklists and tuning guides for real systems

## 🚀 Getting Started

Start with [Module 1: Linux Architecture & Internals](./module-01-architecture/architecture-overview) and progress sequentially. Treat each module as a lab: reproduce the scenarios, run the commands, and build your own playbooks.

Let’s go beyond “it works on my machine” and master how Linux behaves at scale.
