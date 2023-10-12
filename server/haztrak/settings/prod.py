import os

from .base import *  # noqa: F403

# General
DEBUG = False
SECRET_KEY = os.getenv("HT_SECRET_KEY")
ALLOWED_HOSTS = [os.getenv("HT_HOST")]
CORS_ORIGIN_WHITELIST = [os.getenv("HT_CORS_DOMAIN", "http://*")]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("HT_DB_ENGINE", "django.db.backends.postgresql"),
        "NAME": os.environ.get("HT_DB_NAME"),
        "USER": os.environ.get("HT_DB_USER"),
        "PASSWORD": os.environ.get("HT_DB_PASSWORD"),
        "HOST": os.environ.get("HT_DB_HOST"),
        "PORT": os.environ.get("HT_DB_PORT", "5432"),
    }
}

# Haztrak settings
os.environ["HT_RCRAINFO_ENV"] = "PROD"
