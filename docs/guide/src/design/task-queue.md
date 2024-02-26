# Task Queue

The distributed task queue serves as Haztrak's way to ,asynchronously, perform operations that cannot give reasonable guarantees around the time necessary to complete. Sending computationally intensive or network dependant operation to the task queue allows Haztrak to remove long-lasting process from the HTTP request-response lifecycle to provide a 'smooth' user experience and allows haztrak to handle a higher volume of traffic.

For Haztrak, a large part of this is communicating with RCRAInfo via its [web services](https://github.com/USEPA/e-manifest)

## Implementation

Haztrak uses the [Celery](https://docs.celeryq.dev/en/stable/#) and Celery beat for asynchronous task management. Tasks can be scheduled to run at a specific time (via Celery Beat), or they can be triggered by events such as user actions or system events. Celery also provides support for task chaining and task result handling. Haztrak utilizes [Redis](https://redis.io/) as its Message Broker.

All tasks should be idempotent by design.

## Task Results

Tasks results are persisted in Django's configured database, results can be viewed through the [Django admin user interface](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/). Please note that task results must be JSON serializable.
