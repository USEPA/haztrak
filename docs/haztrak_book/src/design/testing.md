# Testing

Testing is a critical aspect of the Haztrak web application development process.
It ensures that the application functions as intended and that new features and
bug fixes don't introduce unintended consequences or errors. The Haztrak project uses a
combination of manual and automated testing to ensure that the application is
thoroughly tested.

- Unit tests ensure that each unit of code behaves as expected. Haztrak's unit
  tests are run automatically as part of the continuous integration process.
- Integration tests ensure that different components of the application work
  together correctly, and new features and changes don't break the overall
  functionality of the application.
- End-to-end tests simulate user behavior and ensure that the application works
  as expected from the user's perspective.

Contributors are encouraged to practice [test driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development), we
often ask that contributors provide tests to prove their PR are acting as intended.
However, we do not aim for 100% code coverage in our test suite. The Haztrak project
believes that doing so more often results in lengthy run times,
and unit test that don't actually prove anything.

For a more comprehensive overview of automated testing, we recommend the follow books:

- [Unit Testing: Principles, Practices, and Patterns ](https://www.goodreads.com/en/book/show/48927138)

## Testing the HTTP Server

The Haztrak HTTP server test suite includes a combination of unit tests,
integration tests. The test suite for each [Django app](https://docs.djangoproject.com/en/4.1/intro/tutorial07/)
is located in the `tests` directory of each app. These files
are ignored (not included) during the [container build](../development/cd.md#2-docker-build)
process.

The HTTP server is built around the Django ecosystem, Haztrak classes often
inherit from [Django](https://www.djangoproject.com/) and the
[Django Rest Framework](https://www.django-rest-framework.org/) base classes.
Documentation, tutorials, and examples on how to test these classes can be found
in their documentation. The following links provide a good overview of testing
withing the Django framework.

- [DRF Testing](https://www.django-rest-framework.org/api-guide/testing/)
- [Django Testing](https://docs.djangoproject.com/en/4.1/topics/testing/)

### Pytest and Fixtures

To get started writing test for the server, you will need to be familiar with
[pytest](https://docs.pytest.org/en/7.2.x/).
Pytest is a popular Python test runner that's compatible with the
[Python standard library's unittest library](https://docs.python.org/3/library/unittest.html).
The Haztrak project transitioned to a pytest based test suite as part of an attempt
to reduce the maintenance cost and streamline unit tests.

As part of the effort to reduce unit test maintenance cost, the haztrak project removed fixture files
(see
django [TestCase's fixture's attribute](https://docs.djangoproject.com/en/4.1/topics/testing/tools/#fixture-loading))
and replaced that data with [PyTest Fixtures](https://docs.pytest.org/en/7.2.x/reference/reference.html#fixtures).

For an introduction to using pytest fixtures to test django, see the following articles:

- [How to Provide Test Fixtures for Django Models in Pytest](https://realpython.com/django-pytest-fixtures/)
- [Effective Python Testing With PyTest](https://realpython.com/pytest-python-testing/)

### Running Server Tests

The client test suite can be run following these steps.

1. Clone the repo

```shell
git clone https://github.com/usepa/haztrak && cd haztrak/server
```

2. setup a virtual environment

```shell
python3 -m venv .venv && source .venv/bin/activate
```

3. Download the dependencies

```shell
pip install -r requirements_dev.txt
```

4. Run the tests

```shell
pytest
```

## Testing the React Client

Like the [server](#testing-the-http-server), the Haztrak client employs an
automated test suite with unit and integration tests to ensure the client is
reliable and bug-free. These tests should be run locally by developers to ensure
recent changes don't introduce errors as well during the [CI process](../development/ci.md).

Tests are stored in `*.spec.{ts,tsx}` files alongside the corresponding source file.
These files are ignored (not included) during the [container build](../development/cd.md#2-docker-build)
process.

### Dependencies

To test Haztrak, we use the following dependencies:

- [Vitest](https://vitest.dev/):
  - A JavaScript test runner specific to the [Vite](https://vitejs.dev/) framework.
    It provides an easy-to-use API, that's similar to [Jest](https://jestjs.io/).
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/):
  - A library that provides utilities for testing React components in a way that
    is more closely aligned with how users interact with the application.
- [Mock Service Worker (MSW)](https://mswjs.io/):
  - A library for mocking HTTP requests in tests.

### Running Client Tests

The client test suite can be run following these steps.

1. Clone the repo

```shell
git clone https://github.com/usepa/haztrak && cd haztrak/client
```

2. Download the dependencies

```shell
npm install .
```

3. configure the environment

```shell
cp ../configs/.env.test ./.env
```

4. Run Tests

```shell
npm test
```
