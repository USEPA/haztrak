# Deployment

Simply put, Haztrak is intended to be operated as a series of containers in a Service Oriented Architecture (SoA). The
following services are expected to be present...

1. An HTTP server, ours is built using the Django framework.
2. An HTTP client, such as a React JS client for the browser, delivered via a web server, like Nginx.
3. An in memory database, like Redis.
4. Task Queue like Celery for long-running, asynchronous tasks.
5. A relational database, like Postgresql, to persist changes.

The containers are configured through environmental variables. You can find a
list of the expected environmental variables, and their defaults
in chapter on [configuration](./configuration.md)

## Contents

- [Setting up a Local Development environment](local-development.md)
- [Configuration](configuration.md)
- [Testing](testing.md)
