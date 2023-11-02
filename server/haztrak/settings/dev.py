import os

from .base import *  # noqa: F403

# General
SECRET_KEY = "django-insecure-%btjqoun@6ps$e@8bw$48s+!x1e4aiz&5p2nrf6cmiw4)jsx5d"
DEBUG = True
CORS_ORIGIN_WHITELIST = [os.getenv("HT_CORS_DOMAIN", "http://localhost:3000")]

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("HT_DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("HT_DB_NAME"),
        "USER": os.environ.get("HT_DB_USER"),
        "PASSWORD": os.environ.get("HT_DB_PASSWORD"),
        "HOST": os.environ.get("HT_DB_HOST"),
        "PORT": os.environ.get("HT_DB_PORT", "5432"),
    }
}
FIXTURE_DIRS = ["fixtures"]

# Haztrak settings
os.environ["HT_RCRAINFO_ENV"] = "PREPROD"
