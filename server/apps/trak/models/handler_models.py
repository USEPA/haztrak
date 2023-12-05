import logging
from typing import Dict, Optional

from django.core.exceptions import ValidationError
from django.db import models

from apps.sites.models import RcraSite

from .base_models import TrakBaseManager, TrakBaseModel
from .signature_models import ESignature, PaperSignature

logger = logging.getLogger(__name__)


class HandlerManager(TrakBaseManager):
    """Inter-model related functionality for the Handler Model"""

    def save(self, instance: Optional["Handler"], **handler_data) -> "Handler":
        paper_signature = handler_data.pop("paper_signature", None)
        e_signatures = handler_data.pop("e_signatures", [])
        if paper_signature:
            paper_signature = PaperSignature.objects.create(**paper_signature)
        try:
            if RcraSite.objects.filter(epa_id=handler_data["rcra_site"]["epa_id"]).exists():
                rcra_site = RcraSite.objects.get(epa_id=handler_data["rcra_site"]["epa_id"])
                handler_data.pop("rcra_site")
            else:
                rcra_site = RcraSite.objects.save(**handler_data.pop("rcra_site"))
            manifest_handler = self.model.objects.create(
                rcra_site=rcra_site,
                paper_signature=paper_signature,
                **handler_data,
            )
            logger.debug(f"Handler created {manifest_handler}")
            for e_signature_data in e_signatures:
                e_sig = ESignature.objects.save(
                    manifest_handler=manifest_handler, **e_signature_data
                )
                logger.debug(f"ESignature created {e_sig}")
            return manifest_handler
        except KeyError as exc:
            logger.warning(f"KeyError while creating Manifest rcra_site {exc}")
        except ValidationError as exc:
            logger.warning(f"ValidationError while creating Manifest rcra_site {exc}")
            raise exc


class Handler(TrakBaseModel):
    """Handler corresponds to a RCRAInfo site that is listed on a manifest."""

    class Meta:
        ordering = ["rcra_site"]

    objects = HandlerManager()

    rcra_site = models.ForeignKey(
        "sites.RcraSite",
        on_delete=models.CASCADE,
        help_text="Hazardous waste rcra_site associated with the manifest",
    )
    paper_signature = models.OneToOneField(
        "PaperSignature",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="The signature associated with hazardous waste custody exchange",
    )

    @property
    def signed(self) -> bool:
        """Returns True if one of the signature types is present"""
        e_signature_exists = ESignature.objects.filter(
            manifest_handler=self, sign_date__isnull=False
        ).exists()
        paper_signature_exists = self.paper_signature is not None
        return paper_signature_exists or e_signature_exists

    def __str__(self):
        return f"{self.rcra_site.epa_id}"


class TransporterManager(HandlerManager):
    """Inter-model related functionality for Transporter Model"""

    def save(self, **transporter_data: Dict) -> "Transporter":
        """Create a Transporter from a manifest instance and rcra_site dict"""
        return super().save(None, **transporter_data)


class Transporter(Handler):
    """Model definition for entities listed as transporters of hazardous waste on the manifest."""

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
