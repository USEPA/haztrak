# Containerization

This chapter provides some notes on our containerization strategy and using related tools with this project.

For more information on using Docker for local development, see [Local Development](../development/local-development.md#docker-compose).

## Goals

The primary goals of the containerization strategy for Haztrak are:

- Ensuring consistent and reproducible deployments across different environments.
- Simplifying the development and testing processes by encapsulating application dependencies.
- Enabling scalability and flexibility to handle varying workload demands.
- Facilitating continuous integration and deployment practices.

## Technology Stack

The containerization strategy for Haztrak leverages the following technologies:

- **[Docker](https://docs.docker.com/)**: Used to create lightweight and isolated containers that encapsulate the application and its dependencies.
- **[Docker Compose](https://docs.docker.com/compose/)**: Facilitates the orchestration of multiple containers to define and manage the entire application stack.
- **[Kubernetes](https://kubernetes.io/)**: Provides a container orchestration platform for managing containerized applications in a scalable and resilient manner.
- **[Helm](https://helm.sh/)**: Used for packaging and deploying the application as Helm charts, enabling efficient management and configuration of the application stack.

### Docker

[Docker](https://www.docker.com/) is a tool that allows us to package an application with
all of its dependencies into a standardized unit for running and distributing applications.
If you're not familiar with Docker, we recommend you check out their [getting started guide](https://docs.docker.com/get-started/).

#### Dockerfiles

Haztrak uses [Dockerfiles](https://docs.docker.com/engine/reference/builder/) to build images for
local development and deployment. The Dockerfiles are located in the [client](/client) and [server](/server) directories.

The Dockerfiles have multiple [targets](https://docs.docker.com/build/building/multi-stage/),
which allow us to build images for different purposes without duplicating code (or multiple files).

- `dev` - used for local development
- `production` - used for deployment
- `builder` - used by the other targets as a preliminary step for building the images for deployment
  - not intended to be used directly by the users

For example, the django http server `dev` target builds the initial layers of the
image the same way as the `production` target, however it will start the
django `manage.py runserver` command instead of a production server.
The client Dockerfile has a similar strategy for local development.

### Docker Compose

The [docker-compose](https://github.com/USEPA/haztrak/tree/main/docker-compose.yaml)
file, found in the project root, is used for local development. It uses the `dev` targets of
the Dockerfiles to build the images and start the containers. It also starts a postgres
relational database service and a redis service.

#### Celery images

The [Celery](https://docs.celeryproject.org/en/stable/) worker and beat scheduler use the same image as the server
but are initiated with different (custom) django management command. This custom commands start the celery
worker and beat scheduler and allow us to use django's hot reloading for local development.

For now this suffices, but we may want to consider using a separate image for the celery worker
and scheduler, or removing autoreload in production-like deployments, later down the road.

The custom celery commands can be found in the
[server/apps/core/management/commands](https://github.com/USEPA/haztrak/tree/main/server/apps/core/management/commands) directory.

### Kubernetes

[Kubernetes](https://kubernetes.io/), also known as K8s, is an open-source system for automating deployment,
scaling, and management of containerized applications. If you're unfamiliar
with Kubernetes, we recommend you check out their [getting started guide](https://kubernetes.io/docs/setup/).

### Helm

[Helm](https://helm.sh/) is a package manager for Kubernetes. It allows us to
define, install, and upgrade applications deployed to Kubernetes. Helm uses a packaging format called
[charts](https://helm.sh/docs/topics/charts/), which are a collection of template (yaml) files that we can
feed values to in order to facilitate the deployment/install/upgrade of a Haztrak deployment.
