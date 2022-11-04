# Haztrak Documentation

### Table of Contents

- [Deploying Haztrak](#Deploying-Haztrak)
    - [Docker Compose](#docker-compose)
    - [runhaz](#runhazsh)
    - [Individual Containers](#deploy-the-individual-containers)
    - [Deploying Locally](#deploying-locally)
- [Configuration](./Configuration.md)
- [Project Structure]()
- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Demo Code](#demo-code)

## Deploying Haztrak

- If you're reading this, you probably want to give haztrak a try or you're looking to setup a local
  development environment. Haztrak comes with these built-in options...
  ### Docker-compose
    - The easiest way to deploy on your local workstation is to
      use [docker-compose](https://docs.docker.com/compose/gettingstarted/)
        - The terminal is expected to include the same [environment variables](./Configuration.md)
          as the other options
  ### Runhaz.sh
    - haztrak also comes with a convenience shell script, [runhaz.sh](/runhaz.sh)
        - It includes options to
          make [Django migrations](https://docs.djangoproject.com/en/4.1/topics/migrations/), and
          load data from [fixture files](/server/tests/fixtures)
        - `$ runhaz.sh -h` to see usage.
  ### Deploy the individual containers
    - Deploy the containers yourself, [client](/client/Dockerfile), and [server](/server/Dockerfile)
      .
        - Again, [environment variables expected](/docs/Configuration.md)
        - Maybe we'll include helm charts in the future.
  ### Deploying locally
    - Run locally for development without containerization, note this only runs the
      Django Restful API and the React SPA. If Haztrak moves to a more complicated structure that
      requires other services
      such as [Redis](https://redis.io/) and/or [Celery](https://github.com/celery/celery), those
      will need to be deployed separately.
    - This has the added benefit that both Django and React local development servers hot swap
      development changes
        - Setup Python environment
            1. Cd into server, create a virtual environment, and activate
                ```shell
                $ cd ./server && python3 -m venv .venv && source .venv/bin/activate # should be .venv/scripts/activate on windows
                ```
            2. Install the django dependencies
                ```shell
                $ pip install -r requirement.txt
                ```
            3. Configure you're environment, either with a local `/server/.env` file or environment
               variables directly.
            4. If you're not using an existing database, make Django's migrations and run then
                ```shell
                $ python manage.py makemigrations && python manage.py migrate
                ```
               or use runhaz.sh
                ```shell
                $ cd .. && ./runhaz.sh -m # this make and run all django migrations
                ```
            5. Run Django's development server
                ```shell
                $ python manage.py runserver
                ```
               or use runhaz.sh
                ```shell
                $ cd .. && ./runhaz.sh -r # this will run both the client and server
                ```

        - Setup React
            1. Open a separate terminal and install dependencies
                ```shell
                $ cd ./client && npm install .
                ```
            2. Start the local development server
                ```shell
                $ npm run start
                ```

## Configuration

Haztrak expects it's configuration in the form of environment variables. See
our [Configuration Docs](/docs/Configuration.md)

## Project Structure

ToDo

## Contributing

You are cordially invited to contribute to haztrak. Please see
our [guide on how to contribute](/docs/CONTRIBUTING.md).

## Code of Conduct

We love your feedback, we just ask that you do it constructively. Contributors are expected to
follow our [Code of Conduct](/docs/CODE_OF_CONDUCT.md)

## Demo Code

As a demo application, Haztrak contains code that is, intentionally, not meant for production (i.e.,
code that shows off features while deployed locally). If anyone ever imagines doing something with
this source, they should probably adjust this parts.

All demo code is marked with comments beginning with `Begin HT demo` and `End HT demo`. The Demo
code will often only run if the [REACT_APP_HT_ENV](./Configuration.md#client) environment varible is
set to `local`

```typescript
// Begin HT demo
// Brief Explanation
someDemoFn()
// commented out ProdFn()
// End HT demo

```
