from typing import Dict

from django.db import models

from .handler_models import ManifestHandler, ManifestHandlerManager


class TransporterManager(ManifestHandlerManager):
    """
    Inter-model related functionality for Transporter Model
    """

    def save(self, **transporter_data: Dict):
        """
        Create a Transporter from a manifest instance and epa_site dict
        ToDo: fix this implementation
        """
        return super().save(**transporter_data)


class Transporter(ManifestHandler):
    """
    Model definition for entities listed as transporters of hazardous waste on the manifest.
    """

    class Meta:
        ordering = ["manifest__mtn"]

    objects = TransporterManager()

    manifest = models.ForeignKey(
        "Manifest",
        related_name="transporters",
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.epa_site.epa_id}"
