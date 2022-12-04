# Deploying Haztrak

Below is a list of built-in options for deploying Haztrak yourself. Primarily, used for setting up a
development environment.

### Docker-compose

- The easiest way to deploy on your local workstation is to
  use [docker-compose](https://docs.docker.com/compose/gettingstarted/)
    - You can either export Haztrak's expected [environment variables](./Configuration.md) to
      the terminal before deploying or use a [config files](/configs)

```shell
$ docker-compose --env-file configs/.env.dev up --build
```

- The [docker-compose.dev.yaml](/docker-compose.dev.yaml) is an override file. It runs the React
  client and Django server as mounted volumes that allow for the app to be hot reloaded after
  change, in addition to the other services expected by the http server.
- It also loads fixtures to the configured database on start, namely 2 users which can be used for
  development purposes.
    1. username: testuser1, password: password1
    2. username: admin, password: password1
       The admin user has superuser privileges and can also log in to
       the [django admin portal](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/).
- To run docker-compose.dev.yaml...

```shell
$ docker-compose --env-file configs/.env.dev -f docker-compose.yaml -f docker-compose.dev.yaml up --build
```

- Instead of docker-compose, you could Build and deploy the containers with
  the [client](/client/Dockerfile), and [server](/server/Dockerfile) Dockerfiles.
    - [environment variables expected](/docs/Configuration.md)
    - Maybe we'll include helm charts in the future.

### NPM and Django scripts

If you don't have a way to build and run containers, or you're a gluten for punishment, you can
make use of the scripts exposed by django and create-react-app.

We have removed functionality to run haztrak from runhaz.sh since the number of services
that needs to run has grown beyond what's practical in a shell script.

#### Deploying the Django http server

Prerequisites

- Python >= 3.8
- [Redis](https://redis.io/)

  Haztrak also uses [Celery](https://github.com/celery/celery), which can be installed though PyPi,
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
        3. Configure you're environment, either with a local `/server/.env` file or environment
           variables directly in the terminal used to deploy the server.
        4. If you're not using an existing database, make Django's migrations and run then
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

Prerequisites
Node.js

1. Install dependencies
    ```shell
    $ cd ./client && npm install .
    ```
2. Configure the client with an .env in [client/.env](/docs/Configuration.md), or ensure your
   terminal
   has the appropriate variables.
    - We have a couple services covered by [mock-service-worker](https://mswjs.io/) which will
      intercept http requests from the browser and return test data. see the config docs.
3. Start the local development server
    ```shell
    $ npm run start
    ```

### Runhaz.sh

- haztrak also comes with a convenience shell script, [runhaz.sh](/runhaz.sh) which wraps around
  create-react-app and django's commands.
    - It includes options to
      make [Django migrations](https://docs.djangoproject.com/en/4.1/topics/migrations/), and
      load data from [fixture files](/server/fixtures)
    - `$ runhaz.sh -h` to see usage.
