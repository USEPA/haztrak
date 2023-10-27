# Continuous Integration (CI)

## CI Process

The CI process for Haztrak involves the following steps/aspects:

### 1. Source Control Management (SCM)

The project code is continually checked into a
[Git](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
and stored on [GitHub](https://github.com/USEPA/haztrak), which acts as the
primary source control management system.

### 2. Automated Testing

The Haztrak code base is accompanied by a [suite of automated tests](../design/testing.md).
When developers push changes to the remote GitHub repository and initiate a
[Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request),
the CI process is triggered using [GitHub Actions](https://docs.github.com/en/actions).
The CI process runs the automated tests for the Django RESTful HTTP server, React JS client,
and other subsystems to ensure that the changes don't break the existing functionality of the
application. If the tests fail, the CI process stops, and the developer is notified of the failure.

### 3. Pull Request Labeling and Review

While test are being run, the Haztrak CI workflow automatically labels the pull
request with a labels. These tags/labels convey meaning to the maintainers to aid
triage and navigation.

The PR then needs to be review, and if necessary modified further, until the
desired specifications are met. The PR can be rejected on the Haztrak maintainer's
discretion.

### 4. Documentation

Once a PR is merged, a workflow is triggered to automatically build
and deploy the static HTML documentation (that you are reading right now) for
the Haztrak application. The documentation is only built and updated if modification
are made the markdown files that are used to generate the HTML. We don't currently
version the documentation, in part for simplicity and limited time.
This documentation is generated using [mdbook](https://rust-lang.github.io/mdBook/),
a tool often used in the [Rust Programming language community](https://www.rust-lang.org/)
and is automatically deployed to [GitHub Pages](https://pages.github.com/).
This documentation provides users with up-to-date information on how to use the Haztrak application.
