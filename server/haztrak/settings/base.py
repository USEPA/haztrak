"""
Haztrak project settings.
"""
import os
from pathlib import Path

# Globals
HAZTRAK_VERSION = "0.7.0"

# Environment variable mappings
CACHE_URL = "HT_CACHE_URL"
TIMEZONE_ENV = "HT_TIMEZONE"
TEST_DB_NAME_ENV = "HT_TEST_DB_NAME"
HT_LOG_LEVEL = os.getenv("HT_LOG_LEVEL", "INFO")
HT_TRAK_LOG_LEVEL = os.getenv("HT_TRAK_LOG_LEVEL", HT_LOG_LEVEL)
HT_CORE_LOG_LEVEL = os.getenv("HT_CORE_LOG_LEVEL", HT_LOG_LEVEL)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

AUTH_USER_MODEL = "core.HaztrakUser"

WSGI_APPLICATION = "haztrak.wsgi.application"

SITE_ID = 1

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.sites",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "allauth",
    "allauth.account",
    "dj_rest_auth",
    "corsheaders",
    "django_extensions",
    "health_check",
    "health_check.db",
    "health_check.cache",
    "health_check.contrib.celery",
    "health_check.contrib.migrations",
    "health_check.contrib.redis",
    "django_celery_results",
    "django_celery_beat",
    "drf_spectacular",
    "apps.handler",
    "apps.rcrasite",
    "apps.core",
    "apps.manifest",
    "apps.wasteline",
    "apps.org",
    "apps.site",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Cross Origin Resource Sharing (CORS)
CORS_ALLOW_CREDENTIALS = True

# URLs
ROOT_URLCONF = "haztrak.urls"
APPEND_SLASH = False

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation" ".UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv(TIMEZONE_ENV, "UTC")
USE_I18N = False
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "EXCEPTION_HANDLER": "apps.core.exceptions.haztrak_exception_handler",
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Haztrak API",
    "DESCRIPTION": "An open-source web app illustrating how hazardous waste "
    "management software can integrate with EPA's RCRAInfo",
    "VERSION": HAZTRAK_VERSION,
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api\/(?:rcra)?",
    "EXTERNAL_DOCS": {
        "description": "Haztrak Documentation",
        "url": "https://usepa.github.io/haztrak/",
    },
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": False,
    },
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.getenv(CACHE_URL, "redis://redis:6379"),
    },
}
REDIS_URL = os.getenv(CACHE_URL, "redis://redis:6379")  # used for Health Checks

# Celery
CELERY_TASK_TRACK_STARTED = True
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379")
CELERY_RESULT_EXTENDED = True
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# Logging
# https://docs.python.org/3/library/logging.html#logrecord-attributes
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "superverbose": {
            "format": "%(levelname)s %(asctime)s %(module)s:%(lineno)d %(process)d "
            "%(thread)d %(message)s"
        },
        "verbose": {"format": "%(levelname)s %(asctime)s %(module)s:%(lineno)d %(message)s"},
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": os.getenv("HT_LOG_FORMAT", "verbose"),
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
        "formatter": "verbose",
    },
    "loggers": {
        "django": {
            "level": HT_LOG_LEVEL,
            "handlers": ["console"],
            "propagate": False,
        },
        "apps.trak": {
            "level": HT_TRAK_LOG_LEVEL,
            "handlers": ["console"],
            "propagate": False,
        },
        "apps.rcrasite": {
            "level": HT_TRAK_LOG_LEVEL,
            "handlers": ["console"],
            "propagate": False,
        },
        "apps.core": {
            "level": HT_CORE_LOG_LEVEL,
            "handlers": ["console"],
            "propagate": False,
        },
    },
}

REST_AUTH = {"USER_DETAILS_SERIALIZER": "apps.core.serializers.HaztrakUserSerializer"}
