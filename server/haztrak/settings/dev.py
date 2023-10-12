import os

from .base import *  # noqa: F403

os.environ["HT_RCRAINFO_ENV"] = "PREPROD"
SECRET_KEY = "django-insecure-%btjqoun@6ps$e@8bw$48s+!x1e4aiz&5p2nrf6cmiw4)jsx5d"
DEBUG = True
CORS_ORIGIN_WHITELIST = [os.getenv("HT_CORS_DOMAIN", "http://localhost:3000")]

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [  # noqa: F405
    "rest_framework.renderers.BrowsableAPIRenderer",
    "rest_framework.renderers.JSONRenderer",
]
