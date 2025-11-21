# systemd Architecture

## Components

- `systemd`: PID 1, service manager
- `systemd-logind`: session management
- `systemd-networkd`, `systemd-resolved`: optional daemons
- `journald`: structured logging

## Unit Types

- service, socket, target, device, mount, automount, timer, swap, slice, scope

```bash
systemctl list-units --type=service --state=failed
systemctl list-unit-files --state=enabled
```

## Targets

- `default.target` usually `graphical.target` or `multi-user.target`
- Boot order defined by dependencies and `Before=/After=`

```bash
systemctl get-default
systemctl list-dependencies multi-user.target
```

## cgroup Integration

- systemd manages cgroups per unit
- Resource controls mapped to cgroup v2 files

```bash
systemd-run --scope -p MemoryMax=1G -p CPUWeight=200 stress-ng --cpu 4
systemd-cgls --memory
```

Next: [Unit Files & Journald](./unit-files).
