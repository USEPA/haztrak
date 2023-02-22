# Haztrak Web Server

---

This directory the Haztrak web-server! If you're looking for a
holistic overview of the Haztrak project, check the [README](/README.md) in the root directory or
the [docs/](/docs) for greater detail.

### What's in this directory?

The restful service's primary role is two-fold,

1. Expose resources to haztrak client.
2. Interface with [RCRAInfo](https://rcrainfo.epa.gov/) and leverage the e-Manifest web services.

All interaction with RCRAInfo goes through the backend for security purposes (i.e., a
[site manager's](https://www.epa.gov/e-manifest/frequent-questions-about-e-manifest#user_question6)
RCRAInfo API ID and key are not used by the front end).

### How was it made?

The web server makes extensive use of the Django ecosystem. It namely uses the below frameworks to
define data models, serialize and expose the API.

- The Django Framework (> 4.0)
- The Django Rest Framework (> 3.13)
- [e-Manifest API client library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py)

It also depends on the following other services being available.

- A message broker, such as [Redis](https://redis.io/).
- The [Celery](https://docs.celeryq.dev/en/stable/) task queue, which is already built into haztrak
  but is required to be spun up as separate service.
  - This is included in the [docker-compose](/docker-compose.yaml) file, or can be spun up
    separately.
