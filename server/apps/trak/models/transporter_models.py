from typing import Dict

from django.db import models

from .handler_models import Handler, HandlerManager


class TransporterManager(HandlerManager):
    """
    Inter-model related functionality for Transporter Model
    """

    def save(self, **transporter_data: Dict):
        """
        Create a Transporter from a manifest instance and rcra_site dict
        ToDo: fix this implementation
        """
        return super().save(**transporter_data)


class Transporter(Handler):
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
        return f"{self.rcra_site.epa_id}"
