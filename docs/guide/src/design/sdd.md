# Source Design Document

This document's purpose is to outline Haztrak's system architecture and design. For more information on the project's specifications and requirements, see the [Software Requirements Specification](./srs.md).

- [Architecture Overview](#architecture-overview)
  - [Server](./http-server.md)
  - [Database](./db-design.md)
  - [Task Queue](./task-queue.md)
  - [Task Scheduler](./task-queue.md#periodic-tasks)
  - [Browser Client](./browser-client.md)
  - [Admin Site](#admin-site)
- [Testing](./testing.md)
- [Versioning](#versioning)

## Architecture Overview

As a reference implementation, Haztrak follows a service oriented design however it would not be classified as a microservice architecture. The project is partitioned into a select number of containerized components that are deployed separately but closely work together, including:

1. An [HTTP server](./http-server.md) that provides a RESTful API for the client and admin site.
2. A [relational database](./db-design.md) for persisting user data and data synced with RCRAInfo.
3. An in memory database (caching layer)
4. A [task queue](./task-queue.md)
5. A [task scheduler](./task-queue.md#periodic-tasks)
6. A [user interface for the browser](./browser-client.md)

## Admin Site

The Admin site provides a quick, model-centric interface where trusted
users can manage content. It's not intended to provide a process centric interface,
admin user's should not be, for example, signing manifests through the admin site.

The admin interface is an out-of-the-box feature of the [Django framework](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).
It can be found by appending `/admin` to the URL of the host and port of HTTP server, for example `http://localhost:8000/admin`

## In-memory Database

The in-memory data store serves a couple purposes,

- As a message broker for Haztrak's [task queue](./task-queue.md)
- A cache for the [http server](./http-server.md)

As a cache, the in-memory data store is utilized to increase performance by allowing Haztrak to cut down on latency for recently used resources including recent database queries, and computed values. As a message broker, the data store provides a reliable way for the back end service to communicate which each other (e.g., launch background tasks).

The Haztrak project currently uses [Redis](https://redis.io/) as both the message broker and in-memory data store.

## Versioning

Haztrak uses [semantic versioning](https://semver.org/) to keep track
of its software releases. Semantic versioning is a widely used versioning system that allows
developers to convey the nature of the changes in the software using
a version number.

The Haztrak project stores versions are in
[Git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging). When a new
version of the software is released, a new Git tag is created to represent that version.
these tags are then used for the container images that are built and
released for that version. Since the Git tag and image tag correspond,
the source for a given container tag can always be easily found. Containers built
from non-release commits should use

Haztrak is stored in a monorepo, the front-end and back-end
containers are built and released simultaneously with the same version number.
