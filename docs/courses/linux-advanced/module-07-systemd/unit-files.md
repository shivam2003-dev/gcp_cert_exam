# Unit Files, journald & Debugging

## Unit File Anatomy

```ini
[Unit]
Description=Sidecar Proxy
Requires=network-online.target
After=network-online.target

[Service]
Type=notify
ExecStart=/usr/local/bin/sidecar --config /etc/sidecar.yaml
Restart=on-failure
RestartSec=3
LimitNOFILE=131072
OOMScoreAdjust=-500

[Install]
WantedBy=multi-user.target
```

### Editing

```bash
sudo systemctl edit --full sidecar.service
sudo systemctl daemon-reload
sudo systemctl restart sidecar.service
```

## Dependency Debugging

```bash
systemctl list-dependencies --reverse sidecar.service
systemctl show sidecar.service | egrep 'Before=|After='
```

## journald Deep Dive

```bash
# Persistent logging
echo Storage=persistent | sudo tee /etc/systemd/journald.conf.d/persistent.conf
systemctl restart systemd-journald

journalctl -u sidecar.service -b --no-pager
journalctl _PID=1234 -o json-pretty
```

## Crash Recovery

```bash
# Capture core dumps
coredumpctl list
coredumpctl info <PID>
coredumpctl gdb <PID>
```

Next: [Boot Bottlenecks & Service Failures](./boot-debugging).
