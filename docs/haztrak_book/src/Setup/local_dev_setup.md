# Local Development Environment

Below is a list of built-in options for setting up a
local development environment.

### Docker-compose

- The easiest way to set up a local development environment is to
  use [docker-compose](https://docs.docker.com/compose/gettingstarted/)
    - We recommend using the [config files](/configs) to provide Haztrak's
      expected [environment variables](haztrak_book/src/Setup/configuration.md).
    - This docker-compose file is for development only as it overrides the client and
      server's [Dockerfile]() commands and mounts the source for hto reload.

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
the [client](/Dockerfile), and [server](/Dockerfile) Dockerfiles.
Maybe we'll include helm charts in the future.

See [environment variables](/docs/haztrak_book/src/Setup/configuration.md) expected by
haztrak.

### NPM and Django scripts

If you don't have a way to build and run containers, or you're a gluten for punishment,
you can make use of the scripts exposed by django and create-react-app to set up a local
development environment.

We have removed functionality to run haztrak from runhaz.sh since the number of services
that needs to run has grown beyond what's practical in a shell script.

#### Deploying the Django http server locally

Prerequisites

- Python >= 3.8
- [Redis](https://redis.io/)

  Haztrak also uses [Celery](https://github.com/celery/celery), which can be installed
  though PyPi,
  and will need to be deployed separately.

    - Setup Python environment
        1. Cd into server, create a virtual environment, and activate
            ```shell
            $ cd ./server && python3 -m venv .venv && source .venv/bin/activate # should be .venv/scripts/activate on windows
            ```
        2. Install the dependencies
            ```shell
            $ pip install -r requirements.txt
            ```
        3. Configure you're environment, either with a local `/server/.env` file or
           environment
           variables directly in the terminal used to deploy the server.
        4. If you're not using an existing database, make Django's migrations and run
           then
            ```shell
            $ python manage.py makemigrations && python manage.py migrate
            ```
           or use runhaz.sh
            ```shell
            $ cd .. && ./runhaz.sh -m # this will make and run all django migrations
            ```
        5. Run Django's development server
            ```shell
            $ python manage.py runserver
            ```

### Deploying The React client locally

We have development options if you would like to run the front end (client) locally
but are not experienced with django or cannot run containers on your workstation.

Prerequisites

- Node.js

1. Install the dependencies
    ```shell
    $ cd ./client && npm install .
    ```
2. Configure the client with an .env
   in [client/.env](/docs/haztrak_book/src/Setup/configuration.md), or
   ensure your
   terminal has the appropriate variables.
    - If the `REACT_APP_HT_ENV` environment variable is set
      to `TEST`, [mock-service-worker](https://mswjs.io/) handlers
      intercept http requests from the browser and return test data. see the config
      docs.
    ```shell
    $ export REACT_APP_HT_ENV=TEST
    $ export REACT_APP_HT_API_URL='http://localhost:8000'
    ```
3. Start the local development server
    ```shell
    $ npm run start
    ```
4. You can log in with the [testuser]() username and password.

### Development tools

* To make life a little easier, we've included a couple configs to help get a
  development environment setup.
* `.editorconfig`
    * Universal IDE configs for formatting files, most IDEs will have a plugin you can
      install

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
      the
      front end for now. If you're using an IDE, it likely have a prettier plugin
      available.
    * The configs are found in [.prettierrc.json](/.prettierrc.json)
      and [.prettierignore](/.prettierignore)
