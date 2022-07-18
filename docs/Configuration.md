# Configuration

haztrak expects configurations in form of environment variables, Yay!
For development purposes, environment variables can be read from 2 `.env` files, present in
[backend](../backend) and [frontend](../frontend) directories. You can find an `.env.example` config
file in each, just copy it, and remove the `.example` suffix to use it as a starting template.

## Back End

### Required

The follow variables are required, haztrak will gracefully exit if not present.
`HAZTRAK_SECRET_KEY`: Salt for cryptographic hashing,
[required by Django](https://docs.djangoproject.com/en/4.0/ref/settings/#secret-key)

### Optional

* `HAZTRAK_DEBUG`
    * Value: `True` or `False`
    * Default: `False`
    * Description: [Django's DEBUG value](https://docs.djangoproject.com/en/4.0/ref/settings/#debug)
* `HAZTRAK_HOST`
    * Value: host/domain names that Django will serve
    * Default: ['localhost']
    * Description: the URL that the backend will serve from,
      see [Django's ALLOWED_HOSTS documentation](https://docs.djangoproject.com/en/4.0/ref/settings/#allowed-hosts)
        * Haztrak currently only accepts one value
* `HAZTRAK_TIMEZONE`
    * Value: one of the approved names from
      the [TZ Database list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
    * Default: 'UTC'
    * Description: see Django's documentation
      on [TIME_ZONE](https://docs.djangoproject.com/en/4.0/ref/settings/#time-zone-1)
        * In the future, `USE_TZ` will be enabled by default
* `RCRAINFO_ENV`
    * Value: `preprod`, `prod`, or the base url of the target RCRAInfo environment
    * Default: `preprod` (for now in the current development phase)
    * Description: RCRAInfo environment that Haztrak will interface with per
      the [e-Manifest API Client Library](https://github.com/USEPA/e-manifest/tree/master/emanifest-py#methods)

### Back End Database Configs

Haztrak may consider postgres option and password files in a future release,
for now, it expects one of two setups...

1. all these variables to be present
2. None of the following variables, in which case it will fallback to a local SQLite3

* `DB_ENGINE`: [The backend driver](https://docs.djangoproject.com/en/4.0/ref/settings/#engine)
  used by django's ORM (e.g., `django.db.backends.postgresql_psycopg2`)
* `DB_NAME`: Your database's name
* `DB_USER`: Database username
* `DB_PASSWORD`: Database password
* `DB_HOST`: Ip or hostname of your database
* `DB_PORT`: Database's port,
  [default for postgres is 5342](https://www.postgresql.org/docs/current/app-postgres.html)
* `TEST_DB_NAME`: [Name of database used for testing](https://docs.djangoproject.com/en/4.0/ref/settings/#test)
  defaults to `test` if not present

## Front End

By default, since it is a React app, environment variables that meet both following requirements
will automagically be available to the front end during runtime.

1. listed in the [frontend .env](../frontend/.env.example) file
2. Begin with `REACT_APP_`

### Required

* `REACT_APP_HAZTRAK_API_URL`
    * Value: host/domain name of the haztrak back end
    * Default: `http://localhost:8000`
    * Description: IP or URL of the back end haztrak server
