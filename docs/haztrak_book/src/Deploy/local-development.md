# Local Development Environment

Below is a list of built-in options for setting up a
local development environment.

### Docker-compose

- The easiest way to set up a local development environment is to
  use [docker compose](https://docs.docker.com/compose/gettingstarted/)
    - You can use one of our [config file](/configs) to inject the
      [environment variables](./configuration.md) needed to configure Haztrak (
      see [docker composes' documentation on environment files](https://docs.docker.com/compose/environment-variables/set-environment-variables/)).
    - You can either use the `--env-file` flag

```shell
$ docker compose --env-file configs/.env.dev up --build
```

or copy the config file to the project root as a `.env` file, modify it if needed, and docker will apply it by default.

```shell
$ cp ./configs/.env.dev .env
$ docker compose up --build
```

- On start, fixtures will be loaded to the database, including 2 users to aid local development.

| username  | password  |
|-----------|-----------|
| testuser1 | password1 |
| admin     | password1 |

- The admin user has superuser privileges and can also log in to
  the [django admin portal](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).

### Local development scripts

If you don't have a way to build and run containers, or you're a gluten for punishment, you can make use of the Django
management scripts and Create-React-App's npm scripts to set up a local
development environment, however it's not recommended.

### Working on the React client locally

Since many have expressed interest in contributing to the (React JS) front end but are not experienced with django or
cannot run containers
on your workstation. We have an option for you. The `haztrak/client/` directory
has [Mock Service Worker (MWS)](https://mswjs.io/) as a
dev dependency. When run, MSW will intercept http requests to the back end and return with mock data.

To run MSW, ensure the following environment variables are set

* `REACT_APP_HT_ENV=TEST`
* `REACT_APP_HT_API_URL=http://localhost:8000`

You can log in with the [testuser](#docker-compose) username and password.

### Development tools

* Haztrak includes a couple configs to help ensure contributions use a consistent style guide. Most popular IDEs have a
  plugin to support these configs.
* `pre-commit`
    * If you're writing any Python, please install these git hooks.
    * ```shell
      $ pip install -r requirements_dev.txt
      $ pre-commit install
      ```
    * [pre-commit](https://pre-commit.com/) hooks are set to run a number of linting and formatting checks before
      commits on any branch is accepted.
* `.editorconfig`
    * Universal IDE configs for formatting files, most IDEs will have a plugin you can
      install that will apply these configs.

* `runhaz.sh`
    * A bash script to help with development
    * See usage with `$ ./runhaz.sh -h`

* `Prettier`
    * [Prettier](https://prettier.io/) is used to autoformat source files, specifically
      the front end for now. If you're using an IDE, it will likely have a prettier plugin available.
    * The configs are found in [.prettierrc.json](/client/.prettierrc.json)
      and [.prettierignore](/client/.prettierignore)
