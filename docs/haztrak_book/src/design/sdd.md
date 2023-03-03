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

The scope of this project is to develop a single page web application (SPA) that demonstrates
how hazardous waste management software can interface with the Environmental
Protection Agency's (EPA) [e-manifest system](../e-Manifest.md) to electronically track hazardous
waste and leverage resources exposed by the [e-Manifest web services](https://github.com/USEPA/e-manifest)
to properly manage hazardous waste.

The web application consists of a [user interface](#front-end) that allows users to input
information related to hazardous waste management, including information about
the waste generators, transporters, and disposal facilities. The application
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
practices to ensure that the application is maintainable and efficient.

Overall, this project aims to demonstrate the benefits of integrating hazardous
waste management software with the e-Manifest system to properly manage hazardous
waste and reduce the risk of environmental harm. The web application developed in
this project will serve as a proof of concept that can be used to convince
stakeholders to invest in integrating their hazardous waste management software
with the e-Manifest system.

Haztrak does not offer a comprehensive suite of hazardous waste management
functionality but, instead, focuses on executing the electronic manifest
workflow. As such, we expect to support the following functionality.

- [ ] Draft new electronic manifests.
- [ ] Upload draft manifests to RCRAInfo to create electronic manifests.
- [ ] Edit electronic manifests (when appropriate) and upload changes to RCRAInfo.
- [ ] Use EPA's Quicker Sign functionality to sign electronic manifests.
- [ ] Control access to resources based on user's permissions from RCRAInfo.

## Architecture

This section provides a high-level overview of how responsibilities of the system
are partitioned between subsystems/services.

The Haztrak system can be described as a series of services.

Throughout our documentation, you'll frequently see us place these services into
two categories, 'front end', and 'back end'.

#### Front End

1. A user interface (client)

#### Back End

1. A HTTP server
2. A relational database
3. An in memory database
4. A task queue

At this phase in the developments lifecycle we don't employ a logging service,
however this could be added in the near future.

### Front End

#### Client

The client is, fundamentally, responsible for rendering the user interface and
presenting the user with Haztrak's available functionality. Haztrak comes
pre-equipped with a client that can be accessed via the user's browser,
specifically a single page application (SPA).

### Back End

The back end is partitioned into the first four of the services discussed [above](#architecture).

#### Relational Database

Haztrak depends on a relational database to persist its user data as well as
information synced with (pulled from) RCRAInfo.

The database schema is maintained in version control via a series of 'migration'
scripts. This enables us to initiate a new database and scaffold the expected
schema quickly and consistently for local development, testing, and backup.

#### In-memory Database

The in memory database acts as a broker for Haztrak's [task queue](#task-queue)
as well as a cache for the [http server](#http-server) to help cut down on
latency for recently requested resources.

#### Task Queue

The task queue is responsible for jobs/scripts/tasks that should occur outside
the [http request-response cycle](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).
For Haztrak, a large part of this is communicating with RCRAInfo via
its [web services](https://github.com/USEPA/e-manifest), a well documented
RESTful API. Offloading these external API calls keeps our user experience
feeling snappy and protects our [http server](#http-server) from network
errors cause by downtime in external systems.

The task queue can be scaled horizontally to include additional workers as needed.
We also deploy schedulers for periodic tasks.

#### HTTP server

The RESTful API serves data to hydrate the client and handles user authentication.
It is client agnostic, so it's not tied to any specific client, whether it be a
browser or mobile application. The API does not directly communicate with RCRAInfo,
but instead manages tasks provided by the task queue and passes on any necessary parameters.

## Testing

Haztrak employs a suite of automated tests for the HTTP server, the http client
(user interface), and the task queue. We rely heavily on these tests, as well as
our continuous integration pipeline to ensure that regressions do not enter the
base branch (often called 'main' or 'master').

We intentionally do not aim for 100% code coverage with our test suite because,
what inevitably happens, is the test suite contains a bunch of low quality tests.

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

Haztrak is stored in a monorepo, as a result, the front-end and back-end
containers are built and released simultaneously with the same version number.
