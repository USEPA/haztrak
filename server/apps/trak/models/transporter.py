from typing import Dict

from django.db import models

from . import Handler, Manifest


class TransporterManager(models.Manager):
    """
    Inter-model related functionality for Transporter Model
    """

    @staticmethod
    def create_transporter(manifest: Manifest, **data: Dict):
        """Create a Transporter from a manifest instance and handler dict"""
        handler_data = data.pop("handler")
        new_handler = Handler.objects.create_handler(**handler_data)
        return Transporter.objects.create(handler=new_handler, manifest=manifest, **data)


class Transporter(models.Model):
    """
    Model definition for entities listed as transporters of hazardous waste on the manifest.
    """

    objects = TransporterManager()

    handler = models.ForeignKey(
        Handler,
        on_delete=models.CASCADE,
    )
    manifest = models.ForeignKey(
        Manifest,
        related_name="transporters",
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.handler.epa_id}: transporter {self.order} on {self.manifest.mtn}"
