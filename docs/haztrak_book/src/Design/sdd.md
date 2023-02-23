# Source Design Document

This document provides a high-level overview of the Haztrak's system architecture and scope. You'll find the following topics:

1. [introduction](#source-design-document)
2. [Purpose](#purpose-of-haztrak)
3. [scope](#scope)
4. [Architecture](#architecture)
   - [Front End Services](#front-end)
   - [Back End Services](#back-end)
5. [Testing](#testing)
6. [Requirements](#requirements)
7. [Packaging](#versioning-packaging-and-containerization)
8. [Timeline](#timeline)

We also hope this document serves as food-for-thought for anyone scoping a project that will need to interface with the U.S. Environmental Protection Agency's [RCRAInfo](https://rcrainfo.epa.gov/rcrainfoprod/action/secured/login) and [e-Manifest](https://www.epa.gov/e-manifest) systems.

## Purpose of Haztrak

Haztrak is, for lack of a better term, a proof of concept (POC) project that aims to illustrate how third party system can leverage the resources exposed by the U.S. Environmental Protection Agency's IT system, [RCRAInfo](https://rcrainfo.epa.gov). More specifically, how these resources can be leveraged to electronically manifest hazardous waste shipments to ensure proper management from cradle-to-grave instead of the manual and paper intensive process that has been in place since the 1980's.

Please keep in mind, Haztrak is a labor of love. There's aspects of Haztrak that will likely never, truly, be ready for a production deployment. Our biggest constraint is time, and our entire budget is our what we can give in our spare time.

## Scope

Haztrak does not offer a comprehensive suite of hazardous waste management functionality but, instead, focuses on executing the electronic manifest workflow. As such, we expect to support the following functionality.

- [ ] Draft new electronic manifests.
- [ ] Upload draft manifests to RCRAInfo to create electronic manifests.
- [ ] Edit electronic manifests (when appropriate) and upload changes to RCRAInfo.
- [ ] Use EPA's Quicker Sign functionality to sign electronic manifests.
- [ ] Pull and store a user's permissions from RCRAInfo.

## Architecture

This section provides a high-level overview of how responsibilities of the system are partitioned between subsystems/services.

The Haztrak system can be described as a series of services.

Throughout our documentation, you'll frequently see us place these services into two categories, 'front end', and 'back end'.

#### Front End

1. A user interface (client)

#### Back End

1. A HTTP server
2. A relational database
3. An in memory database
4. A task queue

At this phase in the developments lifecycle we don't employ a logging service, however this could be added in the near future.

### Front End

#### Client

The client is, fundamentally, responsible for rendering the user interface and presenting the user with Haztrak's available functionality. Haztrak comes pre-equipped with a client that can be accessed via the user's browser, specifically a single page application (SPA).

### Back End

The back end is partitioned into the first four of the services discussed [above](#architecture).

#### Relational Database

Haztrak depends on a relational database to persist its user data as well as information synced with (pulled from) RCRAInfo.

The database schema is maintained in version control via a series of 'migration' scripts. This enables us to initiate a new database and scaffold the expected schema quickly and consistently for local development, testing, and backup.

#### In-memory Database

The in memory database acts as a broker for Haztrak's [task queue](#task-queue) as well as a cache for the [http server](#http-server) to help cut down on latency for recently requested resources.

#### Task Queue

The task queue is responsible for jobs/scripts/tasks that shouldn't occur during the [http request-response cycle](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol). For Haztrak, a large part of this is communicating with RCRAInfo via its [public web services](https://github.com/USEPA/e-manifest), a well documented RESTful API. Offloading these external API calls keeps our user experience feeling snappy and protects our [http server](#http-server) from network errors cause by downtime in external systems.

#### HTTP server

The RESTful API serves data to hydrate the client and handles user authentication. It is client agnostic, so it's not tied to any specific client, whether it be a browser or mobile application. The API does not directly communicate with RCRAInfo, but instead manages tasks provided by the task queue and passes on any necessary parameters.

## Testing

Haztrak employs a suite of automated tests for the HTTP server, the http client (user interface), and the task queue. We rely heavily on these tests, as well as our continuous integration pipeline to ensure that regressions do not enter the base branch (often called 'main' or 'master').

We intentionally do not aim for 100% code coverage with our test suite because, what inevitably happens, is the test suite contains a bunch of low quality tests.

## Requirements

What dependencies and things needed to be able to deploy/build Haztrak.

## Versioning, Packaging and Containerization

How Haztrak is delivered in its various forms.

## Timeline

It's difficult to say when this project will be complete since it's highly dependent on our workload, Haztrak is often put on the back burner when other pragmatic priorities arise. With that being said, we plan on finishing all features listed in the [scope](#scope) section by the end of 2023.
