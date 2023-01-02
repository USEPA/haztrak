# Deployment

Simply put, Haztrak is intended to be operated as a series of containers
that service each other. The following services are expected to be present...

1. A RESTful API, ours is built using the Django framework.
2. A web server, like Nginx, that delivers our React based client for the browser.
3. An in memory database, like Redis.
4. Task Queue like Celery.
5. An relational database, like Postgresql.

The containers are configured through environmental variables. You can find a
list of the expected environmental variables, and their defaults
in chapter on [configuration](./configuration.md)
