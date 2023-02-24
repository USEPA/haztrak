# Continuous Delivery (CD)

Where feasible, Haztrak automates the process of packaging and releasing new developed feature through [Continuous Delivery](https://www.atlassian.com/continuous-delivery/principles) (CD), a process that enables us to frequently build and deploy software updates through automated 'pipelines' . The Haztrak project utilizes the CD process to streamline the building and releasing of [OCI](https://opencontainers.org/) compliant containers (e.g., docker containers) and this documentation.

The Haztrak project does not directly deploy the haztrak web application.

## Process (AKA "Pipeline")

The CD process for Haztrak builds on top of the [Continuous Integration](https://www.atlassian.com/continuous-delivery/continuous-integration) process discussed in the [previous chapter](./ci.md):

### 1. The CI process:

The process is initiated when a user with access pushes a [git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) to the remote git repository hosted on GitHub. The CI pipeline is run to ensure that things such as automated tests and linters pass and the application is behaving, programmatically, as expected.

### 2. Docker Build

Once the code changes pass the CI process, the Dockerfile(s) are used to build a Docker images containing the latest version of the application sub-systems (i.e., the http server, the single page application server). Once built, the images contain all the necessary dependencies required for the application to run. The same containers can be used for a production, pre-production, or dev deployment depending on the configurations injected through [environment variables](./configuration.md).

The docker images are tagged with the version control tag (along with `:latest`). This way, the source code for an image can always be easily found by finding the corresponding git tag. Currently, haztrak is stored in a monorepo, which has its upsides, but unfortunately, we generally release a new docker image for both the font end and back end services with every release, even when there are no modifications to one of them. On a positive note, we always know that `haztrak-server:X:Y:Z` works with `haztrak-client:X:Y:Z` and we don't need to worry about a range of compatibility.

### 3. Container Registry

The Docker images are pushed to the [GitHub Container Registry (GCR)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), which acts as the central repository for all Docker images released by Haztrak.

### 4. Release

A GitHub release is published using the same [annotated Git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) that initiated the CD pipeline. We are currently working on implementing a changelog that automatically details the modifications since the last release.

The CD process for Haztrak ensures that new features and bug fixes are continuously delivered without manual intervention. This not only reduces the time it takes to deliver new features and fixes but also reduces the risk of errors and conflicts during the deployment process.
