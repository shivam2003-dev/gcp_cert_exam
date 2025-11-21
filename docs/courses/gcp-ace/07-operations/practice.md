# Module 7: Practice Questions

## Multiple Choice Questions

### Question 1
What is Cloud Monitoring used for?

- A. To monitor resource metrics and performance
- B. To store logs
- C. To manage VMs
- D. To configure networking

<details>
<summary>Answer</summary>

**A. To monitor resource metrics and performance**

Cloud Monitoring collects metrics, creates dashboards, and sets up alerts for Google Cloud resources.

</details>

### Question 2
Which command queries Cloud Logging logs?

- A. `gcloud logging read "resource.type=gce_instance"`
- B. `gcloud logs read "resource.type=gce_instance"`
- C. `gcloud log query "resource.type=gce_instance"`
- D. `gcloud read-logs "resource.type=gce_instance"`

<details>
<summary>Answer</summary>

**A. `gcloud logging read "resource.type=gce_instance"`**

This reads logs matching the specified filter.

</details>

### Question 3
What is Cloud Trace used for?

- A. Distributed tracing
- B. Log storage
- C. Performance monitoring
- D. Error tracking

<details>
<summary>Answer</summary>

**A. Distributed tracing**

Cloud Trace provides distributed tracing to understand request flows across microservices.

</details>

### Question 4
Which command creates a monitoring alert policy?

- A. `gcloud monitoring alert-policies create --policy-from-file=POLICY_FILE`
- B. `gcloud monitoring create-alert POLICY_FILE`
- C. `gcloud monitoring alerts create POLICY_FILE`
- D. `gcloud create monitoring-alert POLICY_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring alert-policies create --policy-from-file=POLICY_FILE`**

Alert policies are created from YAML or JSON files.

</details>

### Question 5
What is Error Reporting used for?

- A. To track and analyze application errors
- B. To fix errors automatically
- C. To prevent errors
- D. To log errors only

<details>
<summary>Answer</summary>

**A. To track and analyze application errors**

Error Reporting automatically detects, analyzes, and reports errors in your applications.

</details>

### Question 6
Which Cloud Logging feature provides log-based metrics?

- A. Log-based metrics
- B. Derived metrics
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Logging supports log-based metrics that extract metrics from log entries.

</details>

### Question 7
What is the purpose of Cloud Debugger?

- A. To debug production applications
- B. To fix bugs automatically
- C. To prevent bugs
- D. To log debug information

<details>
<summary>Answer</summary>

**A. To debug production applications**

Cloud Debugger allows you to inspect application state in production without stopping or slowing down the application.

</details>

### Question 8
Which command exports logs to Cloud Storage?

- A. `gcloud logging sinks create SINK_NAME storage.googleapis.com/BUCKET`
- B. `gcloud logs export SINK_NAME gs://BUCKET`
- C. `gcloud logging export SINK_NAME gs://BUCKET`
- D. `gcloud logs create-sink SINK_NAME gs://BUCKET`

<details>
<summary>Answer</summary>

**A. `gcloud logging sinks create SINK_NAME storage.googleapis.com/BUCKET`**

Logging sinks export logs to destinations like Cloud Storage, BigQuery, or Pub/Sub.

</details>

### Question 9
What is the maximum log retention period in Cloud Logging?

- A. 7 days
- B. 30 days
- C. 365 days
- D. Configurable up to 365 days

<details>
<summary>Answer</summary>

**D. Configurable up to 365 days**

Cloud Logging retention can be configured from 1 day to 365 days, depending on log type.

</details>

### Question 10
Which Cloud Monitoring feature provides custom metrics?

- A. Custom metrics
- B. User-defined metrics
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Monitoring supports custom metrics that you define for your applications.

</details>

### Question 11
What is the purpose of uptime checks in Cloud Monitoring?

- A. To monitor service availability
- B. To check VM status
- C. To verify network connectivity
- D. To test performance

<details>
<summary>Answer</summary>

**A. To monitor service availability**

Uptime checks verify that your services are available and responding correctly.

</details>

### Question 12
Which command lists all log entries for a specific resource?

- A. `gcloud logging read "resource.type=gce_instance AND resource.labels.instance_id=INSTANCE_ID"`
- B. `gcloud logs list --resource=gce_instance`
- C. `gcloud logging list-entries --resource=INSTANCE_ID`
- D. `gcloud logs read --instance=INSTANCE_ID`

<details>
<summary>Answer</summary>

**A. `gcloud logging read "resource.type=gce_instance AND resource.labels.instance_id=INSTANCE_ID"`**

Use filter expressions to query logs for specific resources.

</details>

### Question 13
What is the difference between Cloud Monitoring and Cloud Logging?

- A. Monitoring is for metrics, Logging is for log entries
- B. They are the same
- C. Monitoring is for logs, Logging is for metrics
- D. Monitoring is free, Logging costs money

<details>
<summary>Answer</summary>

**A. Monitoring is for metrics, Logging is for log entries**

Cloud Monitoring tracks metrics and performance data. Cloud Logging stores and analyzes log entries.

</details>

### Question 14
Which Cloud Logging feature provides log sampling?

- A. Log sampling
- B. Log filtering
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Log sampling**

Log sampling reduces log volume and costs by sampling log entries.

</details>

### Question 15
What is the purpose of Cloud Trace spans?

- A. To represent operations in a trace
- B. To store trace data
- C. To analyze performance
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Spans represent individual operations in a distributed trace and contain timing and metadata.

</details>

### Question 16
Which command creates a monitoring dashboard?

- A. `gcloud monitoring dashboards create --config-from-file=DASHBOARD_FILE`
- B. `gcloud monitoring create-dashboard DASHBOARD_FILE`
- C. `gcloud dashboards create DASHBOARD_FILE`
- D. `gcloud create monitoring-dashboard DASHBOARD_FILE`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring dashboards create --config-from-file=DASHBOARD_FILE`**

Dashboards are created from JSON configuration files.

</details>

### Question 17
What is the maximum number of metrics per project in Cloud Monitoring?

- A. 100
- B. 500
- C. 1,500
- D. 10,000

<details>
<summary>Answer</summary>

**C. 1,500**

Each project can have up to 1,500 custom metrics.

</details>

### Question 18
Which Cloud Logging feature provides log routing?

- A. Log sinks
- B. Log routing
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Log sinks route logs to different destinations, providing log routing capabilities.

</details>

### Question 19
What is the purpose of Cloud Monitoring notification channels?

- A. To send alerts
- B. To configure alert destinations
- C. To manage alert policies
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Notification channels define where alerts are sent (email, SMS, PagerDuty, etc.).

</details>

### Question 20
Which command exports logs to BigQuery?

- A. `gcloud logging sinks create SINK_NAME bigquery.googleapis.com/projects/PROJECT/datasets/DATASET`
- B. `gcloud logs export-to-bigquery SINK_NAME DATASET`
- C. `gcloud logging export bigquery SINK_NAME DATASET`
- D. `gcloud logs create-bigquery-sink SINK_NAME DATASET`

<details>
<summary>Answer</summary>

**A. `gcloud logging sinks create SINK_NAME bigquery.googleapis.com/projects/PROJECT/datasets/DATASET`**

Logging sinks can export to BigQuery for advanced log analysis.

</details>

### Question 21
What is the difference between Cloud Trace and Cloud Profiler?

- A. Trace shows request flows, Profiler shows performance bottlenecks
- B. They are the same
- C. Trace is for logs, Profiler for metrics
- D. Trace is free, Profiler costs money

<details>
<summary>Answer</summary>

**A. Trace shows request flows, Profiler shows performance bottlenecks**

Cloud Trace shows how requests flow through services. Cloud Profiler identifies CPU and memory bottlenecks.

</details>

### Question 22
Which Cloud Monitoring metric type tracks resource utilization?

- A. Gauge
- B. Delta
- C. Cumulative
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Monitoring supports gauge (current value), delta (change over time), and cumulative (total since start) metric types.

</details>

### Question 23
What is the maximum log entry size in Cloud Logging?

- A. 100 KB
- B. 256 KB
- C. 1 MB
- D. 10 MB

<details>
<summary>Answer</summary>

**A. 100 KB**

Individual log entries can be up to 100 KB in size.

</details>

### Question 24
Which command lists all alerting policies?

- A. `gcloud monitoring alert-policies list`
- B. `gcloud monitoring list-alerts`
- C. `gcloud alerts list`
- D. `gcloud monitoring policies list`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring alert-policies list`**

This lists all alerting policies in the project.

</details>

### Question 25
What is the purpose of Cloud Monitoring workspaces?

- A. To organize monitoring resources
- B. To manage multiple projects
- C. To create dashboards
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Workspaces allow you to monitor multiple projects from a single view and organize resources.

</details>

### Question 26
Which Cloud Logging feature provides log exclusion filters?

- A. Log exclusions
- B. Log filters
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Log exclusions**

Log exclusions prevent certain log entries from being stored, reducing costs.

</details>

### Question 27
What is the maximum number of alerting policies per project?

- A. 100
- B. 500
- C. 1,000
- D. 2,500

<details>
<summary>Answer</summary>

**B. 500**

Each project can have up to 500 alerting policies.

</details>

### Question 28
Which command creates a log-based metric?

- A. `gcloud logging metrics create METRIC_NAME --log-filter="FILTER"`
- B. `gcloud logs create-metric METRIC_NAME --filter="FILTER"`
- C. `gcloud logging create-log-metric METRIC_NAME FILTER`
- D. `gcloud metrics create-log METRIC_NAME FILTER`

<details>
<summary>Answer</summary>

**A. `gcloud logging metrics create METRIC_NAME --log-filter="FILTER"`**

This creates a metric that extracts data from log entries.

</details>

### Question 29
What is the purpose of Cloud Monitoring SLI/SLO?

- A. To define service level objectives
- B. To measure service reliability
- C. To set performance targets
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

SLI (Service Level Indicator) and SLO (Service Level Objective) help define and measure service reliability targets.

</details>

### Question 30
Which Cloud Logging feature provides log retention policies?

- A. Retention policies
- B. Log lifecycle
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Logging supports configurable retention policies for different log types.

</details>

### Question 31
What is the maximum number of dashboards per project in Cloud Monitoring?

- A. 10
- B. 100
- C. 500
- D. 1,000

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 dashboards.

</details>

### Question 32
Which command exports logs to Pub/Sub?

- A. `gcloud logging sinks create SINK_NAME pubsub.googleapis.com/projects/PROJECT/topics/TOPIC`
- B. `gcloud logs export-to-pubsub SINK_NAME TOPIC`
- C. `gcloud logging export pubsub SINK_NAME TOPIC`
- D. `gcloud logs create-pubsub-sink SINK_NAME TOPIC`

<details>
<summary>Answer</summary>

**A. `gcloud logging sinks create SINK_NAME pubsub.googleapis.com/projects/PROJECT/topics/TOPIC`**

Logging sinks can export logs to Pub/Sub for real-time processing.

</details>

### Question 33
What is the purpose of Cloud Trace latency analysis?

- A. To identify slow operations
- B. To optimize performance
- C. To debug issues
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Latency analysis helps identify bottlenecks, optimize performance, and debug slow requests.

</details>

### Question 34
Which Cloud Monitoring feature provides anomaly detection?

- A. Anomaly detection
- B. Intelligent alerting
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Monitoring can detect anomalies and provide intelligent alerting based on ML models.

</details>

### Question 35
What is the maximum number of log sinks per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 log sinks.

</details>

### Question 36
Which command queries Cloud Monitoring metrics?

- A. `gcloud monitoring time-series list --filter="metric.type=compute.googleapis.com/instance/cpu/utilization"`
- B. `gcloud metrics query "compute.googleapis.com/instance/cpu/utilization"`
- C. `gcloud monitoring query-metrics "cpu/utilization"`
- D. `gcloud metrics list --type=cpu/utilization`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring time-series list --filter="metric.type=compute.googleapis.com/instance/cpu/utilization"`**

This queries time-series data for the specified metric.

</details>

### Question 37
What is the purpose of Cloud Error Reporting error grouping?

- A. To group similar errors
- B. To reduce noise
- C. To identify patterns
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Error Reporting automatically groups similar errors, reducing noise and helping identify patterns.

</details>

### Question 38
Which Cloud Logging feature provides log-based alerts?

- A. Log-based alerts
- B. Alerting on logs
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

You can create alerting policies based on log-based metrics.

</details>

### Question 39
What is the maximum number of notification channels per project?

- A. 10
- B. 100
- C. 500
- D. 1,000

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 notification channels.

</details>

### Question 40
Which command creates an uptime check?

- A. `gcloud monitoring uptime-checks create CHECK_NAME --http-check=URL`
- B. `gcloud monitoring create-uptime-check CHECK_NAME URL`
- C. `gcloud uptime-checks create CHECK_NAME --url=URL`
- D. `gcloud monitoring uptime create CHECK_NAME URL`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring uptime-checks create CHECK_NAME --http-check=URL`**

This creates an HTTP uptime check for the specified URL.

</details>

### Question 41
What is the difference between Cloud Logging and Cloud Monitoring logs?

- A. They are the same
- B. Cloud Logging stores logs, Monitoring analyzes them
- C. Cloud Monitoring is for metrics only
- D. Cloud Logging is free, Monitoring costs money

<details>
<summary>Answer</summary>

**B. Cloud Logging stores logs, Monitoring analyzes them**

Cloud Logging stores log entries. Cloud Monitoring can analyze logs through log-based metrics and create alerts.

</details>

### Question 42
Which Cloud Monitoring feature provides service monitoring?

- A. Service monitoring
- B. Application performance monitoring
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Monitoring provides service monitoring and APM capabilities for applications.

</details>

### Question 43
What is the maximum retention period for Cloud Trace data?

- A. 7 days
- B. 30 days
- C. 90 days
- D. 365 days

<details>
<summary>Answer</summary>

**B. 30 days**

Cloud Trace retains trace data for 30 days.

</details>

### Question 44
Which command lists all log sinks?

- A. `gcloud logging sinks list`
- B. `gcloud logs list-sinks`
- C. `gcloud logging list-sinks`
- D. `gcloud sinks list`

<details>
<summary>Answer</summary>

**A. `gcloud logging sinks list`**

This lists all configured log sinks.

</details>

### Question 45
What is the purpose of Cloud Monitoring metric descriptors?

- A. To define custom metrics
- B. To describe metric metadata
- C. To configure metrics
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Metric descriptors define custom metrics and their metadata.

</details>

### Question 46
Which Cloud Logging feature provides log streaming?

- A. Log streaming
- B. Real-time logs
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Logging supports streaming logs in real-time through the API or gcloud.

</details>

### Question 47
What is the maximum number of uptime checks per project?

- A. 10
- B. 50
- C. 100
- D. 500

<details>
<summary>Answer</summary>

**B. 50**

Each project can have up to 50 uptime checks.

</details>

### Question 48
Which command deletes a log sink?

- A. `gcloud logging sinks delete SINK_NAME`
- B. `gcloud logs delete-sink SINK_NAME`
- C. `gcloud logging delete-sink SINK_NAME`
- D. `gcloud sinks delete SINK_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud logging sinks delete SINK_NAME`**

This deletes the specified log sink.

</details>

### Question 49
What is the purpose of Cloud Monitoring MQL (Monitoring Query Language)?

- A. To query metrics
- B. To create complex queries
- C. To analyze time-series data
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

MQL provides a powerful language for querying and analyzing metrics and time-series data.

</details>

### Question 50
Which Cloud Logging feature provides log views?

- A. Log views
- B. Saved queries
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Log views allow you to save and reuse log queries.

</details>

### Question 51
What is the maximum number of custom metrics per project?

- A. 100
- B. 500
- C. 1,500
- D. 10,000

<details>
<summary>Answer</summary>

**C. 1,500**

Each project can have up to 1,500 custom metrics.

</details>

### Question 52
Which command creates a notification channel?

- A. `gcloud monitoring notification-channels create --display-name=NAME --type=email --channel-labels=email_address=EMAIL`
- B. `gcloud monitoring create-notification NAME --email=EMAIL`
- C. `gcloud notifications create NAME --email=EMAIL`
- D. `gcloud monitoring notify create NAME EMAIL`

<details>
<summary>Answer</summary>

**A. `gcloud monitoring notification-channels create --display-name=NAME --type=email --channel-labels=email_address=EMAIL`**

This creates a notification channel for sending alerts via email.

</details>

## Scenario-Based Questions

### Scenario 1
You need to monitor a production application and:
- Get alerted when CPU usage exceeds 80%
- Track error rates
- Monitor response times
- View dashboards with key metrics

How would you set this up?

<details>
<summary>Answer</summary>

**Solution:**

1. **Create alerting policy for CPU:**
```bash
# Create alert policy file (cpu-alert.yaml)
# Then create the policy
gcloud monitoring alert-policies create --policy-from-file=cpu-alert.yaml
```

2. **Create log-based metric for errors:**
```bash
gcloud logging metrics create error_rate \
  --log-filter='severity>=ERROR'
```

3. **Create alert on error metric:**
```bash
# Create alert policy for error rate
gcloud monitoring alert-policies create --policy-from-file=error-alert.yaml
```

4. **Create dashboard:**
```bash
# Create dashboard configuration file
gcloud monitoring dashboards create --config-from-file=dashboard.json
```

5. **Set up Cloud Trace** for response time monitoring (automatic for App Engine, Cloud Run, GKE)

</details>

### Scenario 2
You need to export application logs to BigQuery for long-term analysis and compliance. The logs should be retained for 2 years. How would you configure this?

<details>
<summary>Answer</summary>

**Solution:**

1. **Create BigQuery dataset:**
```bash
bq mk --dataset --location=US logs_dataset
```

2. **Create log sink to BigQuery:**
```bash
gcloud logging sinks create bigquery-sink \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/logs_dataset \
  --log-filter='resource.type="gce_instance"'
```

3. **Configure log retention:**
   - In Cloud Logging console, set retention to maximum (365 days)
   - BigQuery stores logs indefinitely (compliance requirement)

4. **Set up scheduled queries** in BigQuery for analysis

**Note:** Cloud Logging retention is max 365 days, but BigQuery stores data indefinitely, meeting the 2-year requirement.

</details>

Continue to [Module 8: Security Best Practices](../security/overview).
