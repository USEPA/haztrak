"""
Django settings for haztrak project.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# Expected environment keywords
ht_host = "HT_HOST"
ht_debug = "HT_DEBUG"
ht_secret = "HT_SECRET_KEY"
ht_timezone = "HT_TIMEZONE"
ht_test_db_name = 'HT_TEST_DB_NAME'
ht_cors_domain = 'HT_CORS_DOMAIN'
rcrainfo_env = 'RCRAINFO_ENV'

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# set RCRAInfo environment if not present
if not os.getenv(rcrainfo_env):
    os.environ[rcrainfo_env] = 'PREPROD'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(ht_secret)

# SECURITY WARNING: don't run with debug turned on in production!
debug = os.getenv(ht_debug, 'FALSE').upper()
if debug == 'TRUE':
    DEBUG = True
else:
    DEBUG = False

ALLOWED_HOST = [os.getenv(ht_host, 'localhost')]

WSGI_APPLICATION = 'haztrak.wsgi.application'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'drf_spectacular',
    'corsheaders',
    'django_extensions',
    'django_celery_results',
    'apps.trak',
    'apps.core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = [os.getenv(ht_cors_domain, 'http://localhost:3000')]

# URLs
ROOT_URLCONF = 'haztrak.urls'
APPEND_SLASH = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("HT_DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("HT_DB_NAME", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("HT_DB_USER", "user"),
        "PASSWORD": os.environ.get("HT_DB_PASSWORD", "password"),
        "HOST": os.environ.get("HT_DB_HOST", "localhost"),
        "PORT": os.environ.get("HT_DB_PORT", "5432"),
        'TEST': {
            'NAME': BASE_DIR / 'test_db.sqlite3',
        }
    }
}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
FIXTURE_DIRS = ['fixtures']

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = os.getenv(ht_timezone, 'UTC')
USE_I18N = False
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'apps/core/static'),
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'haztrak.authentication.BearerAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # I just keep this here for when I want to use browser to inspect the API for dev
    # 'DEFAULT_PERMISSION_CLASSES': [],
    # 'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
    'EXCEPTION_HANDLER': 'apps.core.exceptions.haztrak_exception_handler'
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Haztrak API',
    'DESCRIPTION': 'An open-source web app illustrating how hazardous waste '
                   'management software can integrate with EPA\'s RCRAInfo',
    'VERSION': '0.1.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SCHEMA_PATH_PREFIX': r'/api/[a-zA-Z]*/',
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": True,
    },
}

# Celery
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost"
                                                           ":6379")
CELERY_RESULT_EXTENDED = True
