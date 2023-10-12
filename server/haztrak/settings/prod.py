import os

from .base import *  # noqa: F403

os.environ["HT_RCRAINFO_ENV"] = "PROD"
DEBUG = False
SECRET_KEY = os.getenv("HT_SECRET_KEY")
ALLOWED_HOSTS = [os.getenv("HT_HOST")]
