# Task Queue

The distributed task queue serves as Haztrak's way to , asynchronously, perform operations that cannot give reasonable guarantees around the time necessary to complete. Sending computationally intensive or network dependant operation to the task queue allows Haztrak to remove long-lasting process from the HTTP request-response lifecycle to provide a 'smooth' user experience and allows haztrak to handle a higher volume of traffic.

For Haztrak, a large part of this is communicating with RCRAInfo via its [web services](https://github.com/USEPA/e-manifest). Offloading these external API calls keeps our user experience
feeling snappy and protects our [http server](#http-server) from network
errors cause by downtime in external systems.

The task queue can be scaled horizontally to include additional workers as needed.
We also deploy [task schedulers](#task-scheduler) for periodic tasks.

## Implementation

Haztrak uses the [Celery](https://docs.celeryq.dev/en/stable/#) and Celery beat for asynchronous task management. Tasks can be scheduled to run at a specific time (via Celery Beat), or they can be triggered by events such as user actions or system events. Celery also provides support for task chaining and task result handling. Haztrak utilizes [Redis](https://redis.io/) as its Message Broker.

## Periodic Tasks

The scheduler kicks off tasks at regular intervals, that are then executed by available worker in the task queue. Only a single scheduler is running at any given point to avoid duplicating tasks. Periodic tasks can be scheduled by:

- (Crontab)[https://crontab.guru/]
- Solar events (e.g., every day at sundown)
- Periodically (e.g., every 10 minutes)

The Haztrak project uses Celery's [beat package](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html) to schedule periodic tasks.

Haztrak comes preconfigured with an opinionated number of tasks that it believes should be executed periodically to ensure that it remains in sync with RCRAInfo. Many of these tasks are (to be implemented) related to keeping in sync with [RCRAInfo's 'Lookups']() (sorry, do not have link for this).

Additional periodic tasks can be scheduled by a user with admin privileges through the Admin user interface. The Results of periodic tasks will be stored in the task results table, which is also accessible through the admin interface (see below).

## Task Results

Tasks results are persisted in Django's configured database, results can be viewed through the [Django admin user interface](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/). Please note that task results must b JSON serializable (i.e., you won't see a python native object in the task's results).

## Idempotent Tasks

While a task my have side effects (arguably, all of them do), all tasks should be idempotent by design.
For example, a task launched to pull and update federal waste codes from RCRAInfo should update the waste codes (add new added waste codes, delete codes removed from regulation) the first time the task is called, but should leave Haztrak's federal wastes codes in the exact same state the second time a task is called (assuming no new modifications are made the federal waste codes, which is unlikely).
