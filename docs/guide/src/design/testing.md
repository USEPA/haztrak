# Testing

The Haztrak project uses a combination of manual and automated testing to ensure
that the application is
thoroughly tested.

Contributors are encouraged to
practice [test driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development),
we
often ask that contributors provide tests to prove their PR are acting as
intended.

## Testing the Server

The test suite for
each [Django app](https://docs.djangoproject.com/en/stable/intro/tutorial07/)
is located in the `tests` directory of each app.

test files are ignored during
the [container build](../development/cd.md#2-docker-build) process.

The following links provide a good overview of testing within the Django, and
DRF, ecosystems.

- [DRF Testing](https://www.django-rest-framework.org/api-guide/testing/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)

### Pytest and Fixtures

To get started writing test for the server, you will need to be familiar with
[pytest](https://docs.pytest.org/en/7.2.x/).

As part of the effort to reduce test maintenance cost, the haztrak project has
developed a series of
abstract factories as fixture. They are located in the `conftest.py` files,
which allows them to be
dependency injected into the test suite when requested by name.

For an introduction to using pytest fixtures to test django, see the following
articles:

- [How to Provide Test Fixtures for Django Models in Pytest](https://realpython.com/django-pytest-fixtures/)
- [Effective Python Testing With PyTest](https://realpython.com/pytest-python-testing/)

### Running Server Tests

The client test suite can be run following these steps.

1. set up your development environment, (e.g., clone the repo, setup a virtual
   environment)

  - Clone the repo
  - Create a virtual environment
  - Activate the virtual environment
  - Download the dependencies

2. Run the tests

  - To run all the test

   ```shell
   pytest
   ```

  - To run a specific test file or directory, just include the path to the test
    file or directory

   ```shell
   pytest path/to/test.py
   ```

## Testing the React Client

The Haztrak client employs an automated test suite with unit and integration
tests to ensure the client is
reliable and bug-free. These tests should be run locally by developers to ensure
recent changes don't introduce errors as well during
the [CI process](../development/ci-cd.md).

Tests are stored in `*.spec.{ts,tsx}` files alongside the corresponding source
file.
These files are ignored (not included) during the container build process.

### Running Client Tests

The client test suite can be run following these steps.

1. Setup the dev environment

  - Clone the repo
  - Change into the client directory
  - Download the dependencies

2. configure the environment

   ```shell
   cp ../configs/.env.test ./.env
   ```

3. Run Tests

   ```shell
   npm test
   ```
