# Local Development Environment

Below is a list of built-in options for setting up a
local development environment.

### Docker-compose

- The easiest way to set up a local development environment is to
  use [docker-compose](https://docs.docker.com/compose/gettingstarted/)
    - We recommend using the [config files](/configs) to provide Haztrak's
      expected [environment variables](./configuration.md).
    - This docker-compose file is for development only as it overrides the client and
      server's Dockerfile commands and mounts the source for hot reload.

```shell
$ docker-compose --env-file configs/.env.bak.dev up --build
```

- It also loads fixtures to the configured database on start, namely 2 users which can
  be used for development purposes.

| username  | password  |
|-----------|-----------|
| testuser1 | password1 |
| admin     | password1 |

- The admin user has superuser privileges and can also log in to
  the [django admin portal](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).

Instead of docker-compose, you could Build and deploy the containers with
the [client](/client/Dockerfile), and [server](/server/Dockerfile) Dockerfiles.
Maybe we'll include helm charts in the future.

See [environment variables](/docs/haztrak_book/src/Deploy/configuration.md) expected by
haztrak.

### Local development scripts

If you don't have a way to build and run containers, or you're a gluten for punishment,
you can make use of the scripts exposed by django and create-react-app to set up a local
development environment.

We have removed functionality to run haztrak from runhaz.sh since the number of services
that needs to run has grown beyond what's practical to maintain in a shell script.

If you'd like to do this, you'll need experience with the services you'd like to run. You can still use
Create-React-Apps npm scripts, and Django's `runserver` command, however it's not recommended.

### Working on the React client locally

We understand many are interested in contributing to the (React JS) front end but are not experienced with django or
cannot run containers
on your workstation. We have an option for you. The `haztrak/client/` directory
has [Mock Service Worker (MWS)](https://mswjs.io/) as a
dev dependency. When run, MSW will intercept http requests to the back end and return with mock data.

To run MSW, ensure the following environment variables are set

* `REACT_APP_HT_ENV=TEST`
* `REACT_APP_HT_API_URL=http://localhost:8000`

You can log in with the [testuser](#docker-compose) username and password.

### Development tools

* To make life a little easier, we've included a couple configs to help get a
  development environment setup.
* `.editorconfig`
    * Universal IDE configs for formatting files, most IDEs will have a plugin you can
      install that will apply these configs.

* pre-commit
    * [pre-commit](https://pre-commit.com/) hooks are set to run a number
      of linting and formatting checks before commits on any branch is
      accepted.
    * Install [pre-commit](https://pre-commit.com/) on your workstation
    * In the root directory, run `$ pre-commit install`
        * Alternatively, `$ ./runhaz.sh -p` will install and run the hooks

* `runhaz.sh`
    * A bash script to help with development
    * See usage with `$ ./runhaz.sh -h`

* `Prettier`
    * [Prettier](https://prettier.io/) is used to autoformat source files, specifically
      the front end for now. If you're using an IDE, it will likely have a prettier plugin available.
    * The configs are found in [.prettierrc.json](/client/.prettierrc.json)
      and [.prettierignore](/client/.prettierignore)
