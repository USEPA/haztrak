"""Settings for test environment."""

from .base import *  # noqa: F403

# General
SECRET_KEY = "django-insecure-%btjqoun@6ps$e@8bw$48s+!x1e4aiz&5p2nrf6cmiw4)jsx5d"
DEBUG = True
CORS_ORIGIN_WHITELIST = [os.getenv("HT_CORS_DOMAIN", "http://*")]  # noqa: F405
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("HT_DB_ENGINE", "django.db.backends.sqlite3"),  # noqa: F405
        "NAME": os.environ.get("HT_DB_NAME", os.path.join(BASE_DIR, "db.sqlite3")),  # noqa: F405
        "USER": os.environ.get("HT_DB_USER", "user"),  # noqa: F405
        "PASSWORD": os.environ.get("HT_DB_PASSWORD", "password"),  # noqa: F405
        "HOST": os.environ.get("HT_DB_HOST", "localhost"),  # noqa: F405
        "PORT": os.environ.get("HT_DB_PORT", "5432"),  # noqa: F405
        "TEST": {
            "NAME": "test_db",
        },
    },
}
FIXTURE_DIRS = ["fixtures"]

# Haztrak settings
os.environ["HT_RCRAINFO_ENV"] = "PREPROD"  # noqa: F405
