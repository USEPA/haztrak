"""App configuration for core app."""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Core app configuration."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        """Import signals."""
