import pytest


@pytest.fixture(autouse=True)
def use_local_mem_cache_backend(settings):
    settings.CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }


@pytest.fixture
def cache_factory(settings):
    """Abstract factory for Haztrak Contact model"""

    def create_cache(location):
        settings.CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
                "LOCATION": location,
            }
        }

    return create_cache
