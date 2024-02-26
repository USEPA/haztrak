# Continuous Integration (CI) - Continuous Delivery (CD)

## CI Process

The CI process for Haztrak involves the following steps/aspects:

### 1. Source Control Management (SCM)

The project code is continually checked into a
[Git](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
and stored on [GitHub](https://github.com/USEPA/haztrak), which acts as the
primary source control management system.

### 2. Automated Testing

The project has a suite of automated tests that are run on push to remote branches on GitHub. Test should be quick to run, and preferably only take seconds so can be run on a whim.

Code will not be merged into the main branch upstream (USEPA) until all tests pass.

### 3. Code Quality

The project uses common linting and formatting tools to ensure a base level of code quality. This is also checked before code is merged into the main branch. Code that does not pass linting and formatting test will not be merged into the main branch.

To ensure that code is linted and formatted, we recommend using the following tools:

- [pre-commit](https://pre-commit.com/)
- [ruff](https://github.com/astral-sh/ruff)

See our contributing guide for more information on how to use these tools.

## CD process

Haztrak serves as a reference implementation, it currently is not deployment to production (or any other deployment environment other than local development). So the extent of ouf continuous delivery (and deployment) process is limited to building OCI compliant container images and pushing them to the GitHub Container Registry (GCR).
