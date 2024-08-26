import logging
from typing import Dict, Optional

from django.core.exceptions import ValidationError
from django.db import models
from rcrasite.models import RcraSite

from .contact import ManifestPhone
from .signature import ESignature, PaperSignature

logger = logging.getLogger(__name__)


class HandlerManager(models.Manager):
    """model manager and query interface for Handler model."""

    def save(self, instance: Optional["Handler"], **handler_data) -> "Handler":
        paper_signature = handler_data.pop("paper_signature", None)
        e_signatures = handler_data.pop("e_signatures", [])
        if paper_signature is not None:
            paper_signature = PaperSignature.objects.create(**paper_signature)
        if handler_data.get("emergency_phone", None) is not None:
            handler_data["emergency_phone"] = ManifestPhone.objects.create(
                **handler_data.pop("emergency_phone")
            )
        try:
            if RcraSite.objects.filter(epa_id=handler_data["rcra_site"]["epa_id"]).exists():
                rcra_site = RcraSite.objects.get(epa_id=handler_data["rcra_site"]["epa_id"])
                handler_data.pop("rcra_site")
            else:
                rcra_site = RcraSite.objects.save(None, **handler_data.pop("rcra_site"))
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
            raise ValidationError(f"KeyError while creating rcra_site {exc}")
        except ValidationError as exc:
            logger.warning(f"ValidationError while creating rcra_site {exc}")
            raise exc


class Handler(models.Model):
    """Handler corresponds to a RCRAInfo site that is listed on a manifest."""

    class Meta:
        ordering = ["rcra_site"]

    objects = HandlerManager()

    rcra_site = models.ForeignKey(
        "rcrasite.RcraSite",
        on_delete=models.CASCADE,
        help_text="Hazardous waste rcra_site associated with the manifest",
    )
    emergency_phone = models.ForeignKey(
        "ManifestPhone",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        help_text="Emergency phone number for the hazardous waste rcra_site",
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
    """Transporter Model database querying interface"""

    def save(self, instance: Optional["Transporter"], **data: Dict) -> "Transporter":
        """Create a Transporter from a manifest instance and rcra_site dict"""
        e_signatures = data.pop("e_signatures", [])
        if data.get("paper_signature", None) is not None:
            data["paper_signature"] = PaperSignature.objects.create(**data.pop("paper_signature"))
        try:
            if RcraSite.objects.filter(epa_id=data["rcra_site"]["epa_id"]).exists():
                rcra_site = RcraSite.objects.get(epa_id=data["rcra_site"]["epa_id"])
                data.pop("rcra_site")
            else:
                rcra_site = RcraSite.objects.save(None, **data.pop("rcra_site"))
            transporter, created = self.model.objects.update_or_create(
                manifest=data.pop("manifest"),
                order=data.pop("order"),
                rcra_site__epa_id=rcra_site.epa_id,
                rcra_site=rcra_site,
                defaults=data,
            )
            logger.debug(f"Handler created {transporter}")
            for e_signature_data in e_signatures:
                e_sig = ESignature.objects.save(manifest_handler=transporter, **e_signature_data)
                logger.debug(f"ESignature created {e_sig}")
            return transporter
        except KeyError as exc:
            logger.warning(f"KeyError while creating rcra_site {exc}")
        except ValidationError as exc:
            logger.warning(f"ValidationError while creating rcra_site {exc}")
            raise exc


class Transporter(Handler):
    """Model definition for entities listed as transporters of hazardous waste on the manifest."""

    class Meta:
        ordering = ["manifest__mtn"]

    objects = TransporterManager()

    manifest = models.ForeignKey(
        "manifest.Manifest",
        related_name="transporters",
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.rcra_site.epa_id}"
