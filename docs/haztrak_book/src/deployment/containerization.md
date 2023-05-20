# Containerization

This chapter provides some notes on our containerization strategy and using related tools with this project.

For more information on using Docker for local development, see [Local Development](../development/local-development.md#docker-compose).

## Docker

[Docker](https://www.docker.com/) is a tool that allows you to package an application with
all of its dependencies into a standardized unit for running and distributing applications.
If you're not familiar with Docker, we recommend you check out their [getting started guide](https://docs.docker.com/get-started/).

### Dockerfiles

Haztrak uses [Dockerfiles](https://docs.docker.com/engine/reference/builder/) to build images for
local development and deployment. The Dockerfiles are located in the [client](/client) and [server](/server) directories.

#### Dockerfile targets

The Dockerfiles have multiple targets, which allow us to build images for different purposes without duplicating code.

- `dev` - used for local development
- `production` - used for deployment
- `builder` - used by the other targets as a preliminary step for building the images for deployment
  - not intended to be used directly by the users

For example, if using the `dev` target for the server, the image will be built the same way as the `production` target,
however it will start the development server instead of the production server.
Which will allow us to use the hot reloading. We have something similar in the client Dockerfile.

### Docker Compose

The docker-compose file, found in the project root, is used for local development.
It uses the `dev` targets of the Dockerfiles to build the images and start the containers.
It also starts a postgres database container and a redis container for the celery worker.

#### Celery images

The [Celery](https://docs.celeryproject.org/en/stable/) worker and beat scheduler use the same image as the server
but are initiated with different (custom) django management command. This custom commands start the celery
worker and beat scheduler and allow us to use django's hot reloading for local development.

For now this suffices, but we may want to consider using a separate image for the celery worker
and scheduler, or removing autoreload in production-like deployments, later down the road.

The custom celery commands can be found in the
[server/apps/core/management/commands](https://github.com/USEPA/haztrak/tree/main/server/apps/core/management/commands) directory.
