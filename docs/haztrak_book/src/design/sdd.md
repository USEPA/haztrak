# Source Design Document

This document provides a high-level overview of the Haztrak's system architecture and scope. You'll find the following
topics:

- [introduction](#source-design-document)
- [Purpose](#purpose-of-haztrak)
- [scope](#scope)
- [Architecture](#architecture)
  - [Front End Services](#front-end)
  - [Back End Services](#back-end)
- [Testing](#testing)
- [Requirements](#requirements)
- [Versioning](#versioning)

We also hope this document serves as food-for-thought for anyone scoping a project
that will need to interface with the U.S. Environmental Protection
Agency's [RCRAInfo](https://rcrainfo.epa.gov/rcrainfoprod/action/secured/login)
and [e-Manifest](https://www.epa.gov/e-manifest) systems.

## Purpose of Haztrak

Haztrak is, for lack of a better term, a proof of concept (POC) project that aims
to illustrate how third party system can leverage the resources exposed by the
U.S. Environmental Protection Agency's IT system, [RCRAInfo](https://rcrainfo.epa.gov).
More specifically, how these resources can be leveraged to electronically manifest
hazardous waste shipments to ensure proper management from cradle-to-grave instead
of the manual and paper intensive process that has been in place since the 1980's.

Please keep in mind, Haztrak is a labor of love. There's aspects of Haztrak that
will likely never, truly, be ready for a production deployment. Our biggest constraint
is time, and our entire budget is our what we can give in our spare time.

## Scope

The scope of this project is to develop a web application that demonstrates
how hazardous waste management software can interface with the Environmental
Protection Agency's (EPA) [e-manifest system](../e-Manifest.md) to electronically track hazardous
waste and leverage resources exposed by the [RCRAInfo](https://rcrainfo.epa.gov/rcrainfoprod/action/secured/login)
to properly manage hazardous waste.

The web application consists of a series of services such as a [single page application (SPA)](#front-end) and [HTTP server](#back-end) that allows users to input
information related to hazardous waste management, including information about
the waste generators, transporters, and disposal facilities. The web application
will then utilize the e-Manifest system's web services to electronically track
the hazardous waste throughout its lifecycle, from cradle-to-grave.

To ensure the accuracy and completeness of the data being collected, the
application will incorporate data validation and verification techniques at
various points of data entry. This will include data formatting, data
type, and completeness checks. Additionally, the application will
utilize authentication and authorization techniques to ensure that only
authorized users can access and modify the data.

The web application will be designed to be scalable.
The project will be developed using modern web development technologies and best
practices to ensure that the application is maintainable and provides a realistic working example.

Overall, the Haztrak project will demonstrate the benefits of integrating hazardous
waste management software with the e-Manifest system to properly manage hazardous
waste and reduce the risk of environmental harm. The web application developed in
this project will serve as a proof of concept that can be used to convince
stakeholders to invest in integrating their hazardous waste management software
with the e-Manifest system.

Haztrak does not offer a comprehensive suite of hazardous waste management
functionality but, instead, focuses on executing the electronic manifest
workflow. As such, we expect to support the following functionality.

- [x] Draft new electronic manifests.
- [ ] Upload draft manifests to RCRAInfo to create electronic manifests.
- [ ] Edit electronic manifests (when appropriate) and upload changes to RCRAInfo.
- [x] Use EPA's Quicker Sign functionality to sign electronic manifests.
- [x] Control access to resources based on user's permissions from RCRAInfo.

## Architecture

![Architecture](../assets/haztrak_architecture_poc.svg)

This section provides a high-level overview of how responsibilities of the system
are partitioned between system components/services.

The Haztrak system can be described as a series of services.

Throughout our documentation, you'll frequently see us place these services into
two categories, 'front end', and 'back end'.

### Front End

The Front End consist of two user interfaces.

1. A user interface (client)
2. An Admin Site

#### Client

The client is, fundamentally, responsible for rendering the user interface and
presenting the user with Haztrak's available functionality. Haztrak comes
pre-equipped with a client for the browser, specifically a single page application (SPA).

The browser client makes extensive use of the [React library and ecosystem](https://react.dev/).

For more information, see our [chapter on the browser client](./browser-client.md)

#### Admin Site

The Admin site provides a quick, model-centric interface where trusted
users can manage content. It's not intended to provide a process centric interface,
admin user's should not be, for example, signing manifests through the admin site.

The admin interface is an out-of-the-box feature of the [Django framework](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).
It can be found by appending `/admin` to the URL of the host and port of HTTP server, for example `http://localhost:8000/admin`

### Back End

The back end contains the following components:

1. An HTTP server
2. A relational database
3. An in memory database
4. A task queue
5. A task scheduler

#### Relational Database

Haztrak depends on a relational database to persist its user data as well as
information synced with (pulled from) RCRAInfo. RCRAInfo/e-Manifest should
always be treated as the source of truth, however, the database provides users
the means to, for example, draft or update electronic manifests without submitting
the changes to RCRAInfo immediately.

The database schema is maintained in version control via a series of 'migration'
scripts. This enables us to initiate a new database and scaffold the expected
schema quickly and consistently for local development, testing, and backup.

The Haztrak project currently utilizes [PostgreSQL](https://www.postgresql.org/),
a widely used open-source object-relational database system known for reliability and performance.

For more information, see our [chapter on database design](./db-design.md)

#### In-memory Database

The in-memory data store serves a couple purposes,

- As a message broker for Haztrak's [task queue](#task-queue)
- A cache for the [http server](#http-server)

As a cache, the in-memory data store is utilized to increase performance by allowing Haztrak to cut down on latency for recently used resources including recent database queries, and computed values. As a message broker, the data store provides a reliable way for the back end service to communicate which each other (e.g., launch background tasks).

The Haztrak project currently uses [Redis](https://redis.io/) as both the message broker and in-memory data store.

#### Task Queue

The task queue is responsible for jobs/scripts/tasks/batch processing that should occur outside
the [http request-response cycle](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).
For Haztrak, a large part of this is communicating with RCRAInfo via
its [web services](https://github.com/USEPA/e-manifest), a well documented
RESTful API. Offloading these external API calls keeps our user experience
feeling snappy and protects our [http server](#http-server) from network
errors cause by downtime in external systems.

The task queue can be scaled horizontally to include additional workers as needed.
We also deploy [task schedulers](#task-scheduler) for periodic tasks.

The Haztrak project uses the distributed task queue, [Celery](https://docs.celeryq.dev/en/stable/)

For more information, see our [chapter on the task queue](./task-queue.md)

#### Task Scheduler

The scheduler kicks off tasks at regular intervals, that are then executed by available
worker in the task queue. Only a single scheduler is running at any given point to avoid
duplicating tasks. Periodic tasks can be scheduled by:

- (Crontab)[https://crontab.guru/]
- Solar events (e.g., every day at sundown)
- Periodically (e.g., every 10 minutes)

The Haztrak project uses Celery's
[beat module](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html) to schedule periodic tasks.

For more information, see our [chapter on the task queue](./task-queue.md)

#### HTTP server

The RESTful API serves data to hydrate the client and handles user authentication.
It is client agnostic, so it's not tied to any specific client, whether it be a
browser or mobile application. The API does not directly communicate with RCRAInfo,
but instead manages tasks provided by the task queue and passes on any necessary parameters.

The Haztrak Project makes extensive use of the
[Django framework,](https://www.djangoproject.com/) and it's ecosystem.

For more information, see our [chapter on the HTTP server](./http-server.md)

## Testing

Haztrak employs a suite of automated tests for the HTTP server, the http client
(user interface), and the task queue. We rely heavily on these tests, as well as
our continuous integration pipeline to ensure that regressions do not enter the
base branch (often called 'main' or 'master').

We intentionally do not aim for 100% code coverage with our test suite because,
what inevitably happens, is the test suite contains a bunch of low quality tests.

The Haztrak project uses the [pytest framework](https://docs.pytest.org/en/7.2.x/)
for testing the backend python services to write readable, [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) tests.

For more information, see our [chapter on testing](./testing.md)

## Requirements

What dependencies and things needed to be able to deploy/build Haztrak.

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
