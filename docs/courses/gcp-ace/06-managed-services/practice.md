# Module 6: Practice Questions

## Multiple Choice Questions

### Question 1
What is BigQuery primarily used for?

- A. Transactional databases
- B. Data warehousing and analytics
- C. Real-time applications
- D. File storage

<details>
<summary>Answer</summary>

**B. Data warehousing and analytics**

BigQuery is a serverless data warehouse designed for large-scale analytics and data warehousing workloads.

</details>

### Question 2
Which command runs a BigQuery SQL query?

- A. `bq query "SELECT * FROM dataset.table"`
- B. `gcloud bigquery query "SELECT * FROM dataset.table"`
- C. `gcloud bq execute "SELECT * FROM dataset.table"`
- D. `bq execute "SELECT * FROM dataset.table"`

<details>
<summary>Answer</summary>

**A. `bq query "SELECT * FROM dataset.table"`**

The `bq` command-line tool is used to interact with BigQuery.

</details>

### Question 3
What is Pub/Sub used for?

- A. Database storage
- B. Messaging and event streaming
- C. File storage
- D. Compute resources

<details>
<summary>Answer</summary>

**B. Messaging and event streaming**

Pub/Sub is a messaging service for building event-driven systems and real-time analytics pipelines.

</details>

### Question 4
Which command creates a Pub/Sub topic?

- A. `gcloud pubsub topics create TOPIC_NAME`
- B. `gcloud pub-sub create TOPIC_NAME`
- C. `gcloud messaging topics create TOPIC_NAME`
- D. `gcloud create pubsub-topic TOPIC_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud pubsub topics create TOPIC_NAME`**

This creates a new Pub/Sub topic.

</details>

### Question 5
What is the maximum message size in Pub/Sub?

- A. 1 MB
- B. 10 MB
- C. 100 MB
- D. 1 GB

<details>
<summary>Answer</summary>

**B. 10 MB**

Pub/Sub messages can be up to 10 MB in size.

</details>

### Question 6
Which BigQuery feature provides automatic scaling?

- A. Auto-scaling
- B. Serverless architecture
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery's serverless architecture automatically scales to handle queries of any size.

</details>

### Question 7
What is the purpose of Cloud Endpoints?

- A. API management
- B. Load balancing
- C. DNS management
- D. Firewall rules

<details>
<summary>Answer</summary>

**A. API management**

Cloud Endpoints provides API management including authentication, monitoring, and rate limiting.

</details>

### Question 8
Which command creates a BigQuery dataset?

- A. `bq mk dataset_name`
- B. `gcloud bigquery datasets create DATASET_NAME`
- C. `bq create-dataset DATASET_NAME`
- D. `gcloud bq create-dataset DATASET_NAME`

<details>
<summary>Answer</summary>

**A. `bq mk dataset_name`**

The `bq mk` command creates a new BigQuery dataset.

</details>

### Question 9
What is the difference between a Pub/Sub topic and subscription?

- A. Topic publishes, subscription consumes
- B. They are the same
- C. Topic consumes, subscription publishes
- D. Topic is for storage, subscription for compute

<details>
<summary>Answer</summary>

**A. Topic publishes, subscription consumes**

Publishers send messages to topics. Subscriptions receive messages from topics for consumption.

</details>

### Question 10
Which BigQuery pricing model charges for storage and queries?

- A. On-demand pricing
- B. Flat-rate pricing
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery charges for both storage and query processing. You can use on-demand or flat-rate pricing for queries.

</details>

### Question 11
What is the maximum retention period for Pub/Sub messages?

- A. 7 days
- B. 30 days
- C. 365 days
- D. Unlimited

<details>
<summary>Answer</summary>

**A. 7 days**

Pub/Sub retains unacknowledged messages for up to 7 days.

</details>

### Question 12
Which command creates a Pub/Sub subscription?

- A. `gcloud pubsub subscriptions create SUB_NAME --topic=TOPIC_NAME`
- B. `gcloud pub-sub create-subscription SUB_NAME --topic=TOPIC_NAME`
- C. `gcloud messaging subscriptions create SUB_NAME TOPIC_NAME`
- D. `gcloud create pubsub-subscription SUB_NAME --topic=TOPIC_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud pubsub subscriptions create SUB_NAME --topic=TOPIC_NAME`**

This creates a subscription to receive messages from the specified topic.

</details>

### Question 13
What is the purpose of BigQuery streaming inserts?

- A. To load data in real-time
- B. To improve query performance
- C. To reduce costs
- D. To enable backups

<details>
<summary>Answer</summary>

**A. To load data in real-time**

Streaming inserts allow loading data into BigQuery in real-time for immediate querying.

</details>

### Question 14
Which Pub/Sub delivery type ensures at-least-once delivery?

- A. At-least-once
- B. Exactly-once
- C. At-most-once
- D. All of the above

<details>
<summary>Answer</summary>

**A. At-least-once**

Pub/Sub provides at-least-once delivery, meaning messages may be delivered more than once.

</details>

### Question 15
What is the maximum number of Pub/Sub topics per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10,000**

Each project can have up to 10,000 Pub/Sub topics.

</details>

### Question 16
Which BigQuery feature provides data partitioning?

- A. Partitioned tables
- B. Clustered tables
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery supports both partitioned tables (by date or integer) and clustered tables for improved query performance.

</details>

### Question 17
What is the purpose of Cloud Endpoints API keys?

- A. To authenticate API requests
- B. To track API usage
- C. To rate limit requests
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

API keys can be used for authentication, usage tracking, and rate limiting in Cloud Endpoints.

</details>

### Question 18
Which command exports BigQuery data to Cloud Storage?

- A. `bq extract dataset.table gs://bucket/file`
- B. `gcloud bigquery export dataset.table gs://bucket/file`
- C. `bq export dataset.table gs://bucket/file`
- D. `gcloud bq extract dataset.table gs://bucket/file`

<details>
<summary>Answer</summary>

**A. `bq extract dataset.table gs://bucket/file`**

This exports BigQuery table data to Cloud Storage.

</details>

### Question 19
What is the maximum number of Pub/Sub subscriptions per topic?

- A. 10
- B. 100
- C. 1,000
- D. 10,000

<details>
<summary>Answer</summary>

**D. 10,000**

Each Pub/Sub topic can have up to 10,000 subscriptions.

</details>

### Question 20
Which BigQuery feature provides automatic schema detection?

- A. Auto-detect schema
- B. Schema auto-detection
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery can automatically detect schema when loading data from certain formats like JSON or CSV.

</details>

### Question 21
What is the purpose of Pub/Sub message ordering?

- A. To ensure messages are processed in order
- B. To improve performance
- C. To reduce costs
- D. To enable batching

<details>
<summary>Answer</summary>

**A. To ensure messages are processed in order**

Message ordering ensures messages with the same ordering key are delivered in order.

</details>

### Question 22
Which command lists all BigQuery datasets?

- A. `bq ls`
- B. `gcloud bigquery datasets list`
- C. `bq list-datasets`
- D. `gcloud bq list`

<details>
<summary>Answer</summary>

**A. `bq ls`**

This lists all datasets in the current project.

</details>

### Question 23
What is the maximum size of a BigQuery table?

- A. 1 TB
- B. 10 TB
- C. 100 TB
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

BigQuery tables can scale to virtually unlimited size.

</details>

### Question 24
Which Pub/Sub subscription type provides exactly-once delivery?

- A. Pull subscription
- B. Push subscription
- C. Both
- D. Neither (Pub/Sub provides at-least-once)

<details>
<summary>Answer</summary>

**D. Neither (Pub/Sub provides at-least-once)**

Pub/Sub provides at-least-once delivery. Exactly-once delivery is not guaranteed.

</details>

### Question 25
What is the purpose of BigQuery materialized views?

- A. To cache query results
- B. To improve query performance
- C. To reduce costs
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Materialized views cache pre-computed query results, improving performance and reducing query costs.

</details>

### Question 26
Which command publishes a message to a Pub/Sub topic?

- A. `gcloud pubsub topics publish TOPIC_NAME --message="MESSAGE"`
- B. `gcloud pub-sub publish TOPIC_NAME "MESSAGE"`
- C. `gcloud messaging publish TOPIC_NAME "MESSAGE"`
- D. `gcloud publish pubsub TOPIC_NAME "MESSAGE"`

<details>
<summary>Answer</summary>

**A. `gcloud pubsub topics publish TOPIC_NAME --message="MESSAGE"`**

This publishes a message to the specified topic.

</details>

### Question 27
What is the maximum number of BigQuery datasets per project?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

There's no limit on the number of datasets per project.

</details>

### Question 28
Which Cloud Endpoints feature provides rate limiting?

- A. Quota configuration
- B. Rate limiting
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Endpoints supports quota configuration to limit API request rates.

</details>

### Question 29
What is the purpose of BigQuery external tables?

- A. To query data in Cloud Storage without loading
- B. To improve performance
- C. To reduce costs
- D. To enable backups

<details>
<summary>Answer</summary>

**A. To query data in Cloud Storage without loading**

External tables allow querying data directly from Cloud Storage without importing it into BigQuery.

</details>

### Question 30
Which Pub/Sub feature provides message deduplication?

- A. Message deduplication
- B. Exactly-once delivery
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**D. Neither**

Pub/Sub does not provide built-in message deduplication. Applications must handle this.

</details>

### Question 31
What is the maximum number of columns in a BigQuery table?

- A. 100
- B. 1,000
- C. 10,000
- D. Unlimited

<details>
<summary>Answer</summary>

**C. 10,000**

A BigQuery table can have up to 10,000 columns.

</details>

### Question 32
Which command deletes a Pub/Sub topic?

- A. `gcloud pubsub topics delete TOPIC_NAME`
- B. `gcloud pub-sub delete TOPIC_NAME`
- C. `gcloud messaging delete-topic TOPIC_NAME`
- D. `gcloud delete pubsub-topic TOPIC_NAME`

<details>
<summary>Answer</summary>

**A. `gcloud pubsub topics delete TOPIC_NAME`**

This deletes the specified topic and all its subscriptions.

</details>

### Question 33
What is the purpose of BigQuery query caching?

- A. To cache query results
- B. To improve performance
- C. To reduce costs
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Query caching stores results for 24 hours, improving performance and reducing costs for repeated queries.

</details>

### Question 34
Which Pub/Sub subscription type requires polling?

- A. Pull subscription
- B. Push subscription
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Pull subscription**

Pull subscriptions require the subscriber to poll for messages. Push subscriptions deliver messages via HTTP POST.

</details>

### Question 35
What is the maximum message retention in Pub/Sub?

- A. 1 day
- B. 7 days
- C. 30 days
- D. 365 days

<details>
<summary>Answer</summary>

**B. 7 days**

Pub/Sub retains unacknowledged messages for up to 7 days.

</details>

### Question 36
Which BigQuery feature provides data encryption at rest?

- A. Encryption at rest
- B. Customer-managed encryption keys
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery encrypts all data at rest by default and supports customer-managed encryption keys (CMEK).

</details>

### Question 37
What is the purpose of Cloud Endpoints service management?

- A. To deploy and manage APIs
- B. To monitor API usage
- C. To configure authentication
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Cloud Endpoints provides comprehensive API management including deployment, monitoring, and authentication.

</details>

### Question 38
Which command loads data into BigQuery from Cloud Storage?

- A. `bq load dataset.table gs://bucket/file`
- B. `gcloud bigquery load dataset.table gs://bucket/file`
- C. `bq import dataset.table gs://bucket/file`
- D. `gcloud bq load dataset.table gs://bucket/file`

<details>
<summary>Answer</summary>

**A. `bq load dataset.table gs://bucket/file`**

This loads data from Cloud Storage into a BigQuery table.

</details>

### Question 39
What is the maximum number of Pub/Sub messages per second per topic?

- A. 1,000
- B. 10,000
- C. 100,000
- D. 1,000,000

<details>
<summary>Answer</summary>

**D. 1,000,000**

Each Pub/Sub topic can handle up to 1 million messages per second.

</details>

### Question 40
Which BigQuery feature provides automatic schema evolution?

- A. Schema auto-detection
- B. Schema evolution
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**B. Schema evolution**

BigQuery supports schema evolution, allowing you to add columns to tables without breaking existing queries.

</details>

### Question 41
What is the purpose of Pub/Sub dead letter topics?

- A. To handle failed message processing
- B. To improve performance
- C. To reduce costs
- D. To enable ordering

<details>
<summary>Answer</summary>

**A. To handle failed message processing**

Dead letter topics store messages that cannot be processed after multiple retry attempts.

</details>

### Question 42
Which command creates a BigQuery table?

- A. `bq mk dataset.table`
- B. `gcloud bigquery tables create dataset.table`
- C. `bq create-table dataset.table`
- D. `gcloud bq mk-table dataset.table`

<details>
<summary>Answer</summary>

**A. `bq mk dataset.table`**

This creates a new table in the specified dataset.

</details>

### Question 43
What is the maximum size of a BigQuery query result?

- A. 100 MB
- B. 1 GB
- C. 10 GB
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

BigQuery can return query results of any size (though large results may need to be exported to Cloud Storage).

</details>

### Question 44
Which Pub/Sub feature provides message filtering?

- A. Subscription filters
- B. Topic filters
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**A. Subscription filters**

Subscription filters allow subscribers to receive only messages matching certain attributes.

</details>

### Question 45
What is the purpose of BigQuery scheduled queries?

- A. To run queries on a schedule
- B. To automate data processing
- C. To update materialized views
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

Scheduled queries can run automatically on a schedule for data processing and materialized view updates.

</details>

### Question 46
Which command lists all Pub/Sub topics?

- A. `gcloud pubsub topics list`
- B. `gcloud pub-sub list-topics`
- C. `gcloud messaging topics list`
- D. `gcloud list pubsub-topics`

<details>
<summary>Answer</summary>

**A. `gcloud pubsub topics list`**

This lists all Pub/Sub topics in the project.

</details>

### Question 47
What is the maximum number of BigQuery tables per dataset?

- A. 1,000
- B. 10,000
- C. 100,000
- D. Unlimited

<details>
<summary>Answer</summary>

**D. Unlimited**

There's no limit on the number of tables per dataset.

</details>

### Question 48
Which Cloud Endpoints feature provides API versioning?

- A. API versioning
- B. Service versioning
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Cloud Endpoints supports API versioning to manage multiple versions of your API.

</details>

### Question 49
What is the purpose of BigQuery BI Engine?

- A. To accelerate SQL queries
- B. To provide in-memory analysis
- C. To improve dashboard performance
- D. All of the above

<details>
<summary>Answer</summary>

**D. All of the above**

BI Engine provides in-memory acceleration for faster SQL queries and improved dashboard performance.

</details>

### Question 50
Which Pub/Sub feature provides message acknowledgment?

- A. ACK mechanism
- B. Message acknowledgment
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

Pub/Sub requires message acknowledgment to confirm successful processing and prevent redelivery.

</details>

### Question 51
What is the maximum number of Cloud Endpoints services per project?

- A. 10
- B. 100
- C. 1,000
- D. Unlimited

<details>
<summary>Answer</summary>

**B. 100**

Each project can have up to 100 Cloud Endpoints services.

</details>

### Question 52
Which BigQuery feature provides data sharing across projects?

- A. Authorized datasets
- B. Dataset sharing
- C. Both
- D. Neither

<details>
<summary>Answer</summary>

**C. Both**

BigQuery supports sharing datasets across projects using authorized datasets and IAM.

</details>

## Scenario-Based Questions

### Scenario 1
You need to build a real-time analytics pipeline that:
- Receives events from multiple sources
- Processes events in real-time
- Scales automatically
- Ensures no message loss

Which Google Cloud services should you use?

<details>
<summary>Answer</summary>

**Use Pub/Sub + Dataflow/Cloud Functions**

1. **Pub/Sub** - Receives events from multiple publishers
   - Automatic scaling
   - At-least-once delivery ensures no message loss
   - Supports multiple subscriptions for different processing

2. **Dataflow or Cloud Functions** - Process events
   - Dataflow for complex streaming pipelines
   - Cloud Functions for simple event processing
   - Both can subscribe to Pub/Sub topics

3. **BigQuery** - Store and analyze results
   - Real-time streaming inserts
   - Analytics and reporting

</details>

### Scenario 2
You need to analyze 100 TB of historical data stored in Cloud Storage. The analysis needs to:
- Run complex SQL queries
- Complete in minutes, not hours
- Scale automatically
- Be cost-effective

Which service should you use?

<details>
<summary>Answer</summary>

**Use BigQuery**

BigQuery is ideal because:
- Can query data directly from Cloud Storage (external tables) or load it
- Serverless, automatically scales to handle any query size
- Complex SQL queries complete in seconds to minutes
- Pay only for data processed (on-demand pricing)
- No infrastructure management

You can either:
1. Load data into BigQuery tables (faster queries, storage cost)
2. Use external tables (query directly from Cloud Storage, no storage cost but slower)

</details>

Continue to [Module 7: Monitoring, Logging & Operations](../operations/overview).
