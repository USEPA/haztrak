# Configuration

haztrak expects configurations in form of environment variables.
variables will be read from a `.env` file, present in the root directory.
Environment variables already present will not be overridden by parameters in
the `.env` file (i.e., variables supplied at docker run time).

## Environment Variables

### Required configs

The follow variables are required, haztrak will gracefully exit if not
present.\
`HAZTRAK_SECRET_KEY`: Salt for cryptographic
hashing, [required by Django](https://docs.djangoproject.com/en/4.0/ref/settings/#secret-key)

### Optional configs (and their defaults)

* `HAZTRAK_DEBUG`: [django DEBUG value](https://docs.djangoproject.com/en/4.0/ref/settings/#debug)
    * True or False
    * Default: False
* `HAZTRAK_HOST`: [Django's ALLOWED_HOSTS](https://docs.djangoproject.com/en/4.0/ref/settings/#allowed-hosts)
    * IP address or domain name(s)
    * Default: ['127.0.0.1', 'localhost']
* `HAZTRAK_TIMEZONE`: [Django's TIME_ZONE](https://docs.djangoproject.com/en/4.0/ref/settings/#time-zone-1)
    * Default: 'UTC'
* `RCRAINFO_ENV`: [which RCRAInfo environment per emanifestpy](https://github.com/USEPA/e-manifest/tree/master/emanifest-py#methods)
    * Expected values include `preprod`, `prod`, or the base url of the target
      environment
    * Default: 'preprod'

### Database configs

Haztrak supports Postgres, SQLite has also been used, but of course, not
recommended for production.
Haztrak may consider postgres option and password files in a future release,
for now, it expects all these variables to be present or gracefully exit.

if none of the below variables are present, haztrak will assume you're working
on it and fallback to creating a SQLite3 file in the root of the directory.

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
