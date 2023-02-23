# Configuration

## Table of Contents

- [Overview](#Overview)
- [Server Configuration](#Server)
  - [Required](#required--server-)
  - [Optional](#optional--server-)
    - [Database](#Database)
    - [Celery](#Celery)
    - [Logging](#logging)
- [Client Configuration](#Client)
  - [Required Parameters](#required--client-)

## Overview

haztrak expects configurations in form of environment variables supplied at runtime, Yay!
For non-containerized local development, you can place '.env' files in the [server](/)
and [client](/) directories, with the outlined values below and the values will be
automatically added. You can find [example configs here](/configs).

Haztrak also comes with Dockerfiles and a docker-compose files,
including [docker-compose.yaml](/docker-compose.yaml). Environment variables can be passed
to a
using [docker-composes --env-file flag](https://docs.docker.com/compose/environment-variables/#using-the---env-file--option)
like so.

```shell
$ docker-compose --env-file configs/.env.dev up --build
```

## Server

### Required (server)

The follow variables are required, haztrak will exit if not present.
`HT_SECRET_KEY`: Salt for cryptographic hashing,
[required by Django](https://docs.djangoproject.com/en/4.1/ref/settings/#secret-key)

### Optional (server)

- `HT_DEBUG`
  - Value: `True` or `False`
  - Default: `False`
  - Description: [Django's DEBUG value](https://docs.djangoproject.com/en/4.1/ref/settings/#debug)
- `HT_HOST`
  - Value: host/domain names that Django will serve
  - Default: ['localhost']
  - Description: the URL that the server will serve from,
    see [Django's ALLOWED_HOSTS documentation](https://docs.djangoproject.com/en/4.1/ref/settings/#allowed-hosts)
    - Haztrak currently only accepts one value
- `HT_TIMEZONE`
  - Value: one of the approved names from
    the [TZ Database list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  - Default: 'UTC'
  - Description: see Django's documentation
    on [TIME_ZONE](https://docs.djangoproject.com/en/4.1/ref/settings/#time-zone-1)
    - In the future, `USE_TZ` will be enabled by default
- `HT_RCRAINFO_ENV`
  - Value: `preprod`, `prod`, or the base url of the target RCRAInfo environment
  - Default: `preprod` (for now in the current development phase)
  - Description: RCRAInfo environment that Haztrak will interface with per
    the [e-Manifest API Client Library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)
- `HT_CORS_DOMAIN`
  - Value for cross-origin resource sharing, the domain that the React app is deployed
  - Example for local development: should be something like `http://localhost:3000'

#### Database

Technically these are optional. If these environment variables are not found, Haztrak will fall back
to a [SQLite3](https://www.sqlite.org/index.html) database in the [server](/) directory, which
may not be recommended for production, but this is an example web application.

- `HT_DB_ENGINE`
  - [The server driver](https://docs.djangoproject.com/en/4.1/ref/settings/#engine) used by
    django's ORM (e.g., `django.db.backends.postgresql_psycopg2`)
  - default: `django.db.backends.sqlite3`
- `HT_DB_NAME`
  - default: `db.sqlite3`
- `HT_DB_USER`
  - default: `user`
- `HT_DB_PASSWORD`
  - default: `password`
- `HT_DB_HOST`
  - default: `localhost`
- `HT_DB_PORT`
  - default: `5432`
  - [default for postgres is 5342](https://www.postgresql.org/docs/current/app-postgres.html)
- `HT_TEST_DB_NAME`
  - [Name of database used for testing](https://docs.djangoproject.com/en/4.1/ref/settings/#test)
    defaults to `test` if not present

#### Celery

Haztrak offloads expensive tasks to a task queue, [Celery](https://docs.celeryq.dev/en/stable/).
It requires access to a message broker like [Redis](https://redis.io/)
or [RabbitMQ](https://www.rabbitmq.com/).

- `CELERY_BROKER_URL`
  - default: `redis://localhost:6379`
- `CELERY_RESULT_BACKEND`
  - default: `redis://localhost:6379`

#### Logging

These configurations control the format and level of logging for our task queue and http server.

- `HT_LOG_FORMAT`
  - Value: string corresponding to a formatter, `simple`, `verbose`, `superverbose`. See `server/haztrak/settings.py`
    LOGGING section for details.
  - default: `verbose`

logging can be filtered to only include logs that exceed a threshold. We use the
python standard library logging module, levels can be found in their documentation here
https://docs.python.org/3/library/logging.html#logging-levels

- `HT_DJANGO_LOG_LEVEL`
  - default: `INFO`
- `HT_TRAK_LOG_LEVEL`
  - default: `INFO`
- `HT_CORE_LOG_LEVEL`
  - default: `INFO`

## Client

### Required (client)

- `REACT_APP_HT_API_URL`
  - Value: host/domain name of the haztrak back end
  - Default: `http://localhost:8000`
- `REACT_APP_HT_ENV`
  - Default: `PROD`
  - Options: `PROD`, `DEV`, `TEST`
  - Description: The deployment environments, `TEST` mock service worker that intercepts API calls
    and responds with test data. It can be used for testing, but also to develop the React client
    without the django server, however it is feature incomplete.
