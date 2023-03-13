from typing import Dict

from django.db import models

from .handler_model import Handler, ManifestHandler, ManifestHandlerManager
from .manifest_model import Manifest


class TransporterManager(ManifestHandlerManager):
    """
    Inter-model related functionality for Transporter Model
    """

    @staticmethod
    def create_transporter(manifest: Manifest, **data: Dict):
        """
        Create a Transporter from a manifest instance and handler dict

        ToDo: See ManifestHandlerManager method, there's overlap that can be refactored
         as a bigger item, look at our custom model managers, see where we can apply a better
         design to take advantage of polymorphism and inheritance
        """
        handler_data = data.pop("handler")
        new_handler = Handler.objects.create_handler(**handler_data)
        return Transporter.objects.create(handler=new_handler, manifest=manifest, **data)


class Transporter(ManifestHandler):
    """
    Model definition for entities listed as transporters of hazardous waste on the manifest.
    """

    objects = TransporterManager()

    manifest = models.ForeignKey(
        "Manifest",
        related_name="transporters",
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.handler.epa_id}: transporter {self.order} on {self.manifest.mtn}"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"
