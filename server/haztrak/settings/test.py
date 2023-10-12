from .base import *  # noqa: F403

os.environ["HT_RCRAINFO_ENV"] = "PREPROD"  # noqa: F405
SECRET_KEY = "django-insecure-%btjqoun@6ps$e@8bw$48s+!x1e4aiz&5p2nrf6cmiw4)jsx5d"
DEBUG = True
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
]
