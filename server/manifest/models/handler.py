"""Model definitions for entities listed as handlers of hazardous waste on the manifest."""

import logging
from typing import Optional

from django.core.exceptions import ValidationError
from django.db import models
from rcrasite.models import RcraSite

from .contact import ManifestPhone
from .signature import ESignature, PaperSignature

logger = logging.getLogger(__name__)


class HandlerManager(models.Manager):
    """model manager and query interface for a Handler model."""

    def save(self, instance: Optional["Handler"], **handler_data) -> "Handler":
        """Save the handler instance to the database."""
        paper_signature = handler_data.pop("paper_signature", None)
        e_signatures = handler_data.pop("e_signatures", [])
        if paper_signature is not None:
            paper_signature = PaperSignature.objects.create(**paper_signature)
        if handler_data.get("emergency_phone") is not None:
            handler_data["emergency_phone"] = ManifestPhone.objects.create(
                **handler_data.pop("emergency_phone"),
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
            msg = f"Handler created {manifest_handler}"
            logger.debug(msg)
            for e_signature_data in e_signatures:
                e_sig = ESignature.objects.save(
                    manifest_handler=manifest_handler,
                    **e_signature_data,
                )
                msg = f"ESignature created {e_sig}"
                logger.debug(msg)
            return manifest_handler
        except KeyError as exc:
            msg = f"KeyError while creating rcra_site {exc}"
            raise ValidationError(msg) from exc
        except ValidationError as exc:
            msg = f"ValidationError while creating rcra_site {exc}"
            logger.warning(msg)
            raise


class Handler(models.Model):
    """Handler corresponds to a RCRAInfo site that is listed on a manifest."""

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

    objects = HandlerManager()

    class Meta:
        """Metaclass."""

        ordering = ["rcra_site"]

    def __str__(self):
        """Human-readable representation."""
        return f"{self.rcra_site.epa_id}"

    @property
    def signed(self) -> bool:
        """Returns True if one of the signature types is present."""
        e_signature_exists = ESignature.objects.filter(
            manifest_handler=self,
            sign_date__isnull=False,
        ).exists()
        paper_signature_exists = self.paper_signature is not None
        return paper_signature_exists or e_signature_exists


class TransporterManager(HandlerManager):
    """Transporter Model database querying interface."""

    def save(self, instance: Optional["Transporter"], **data: dict) -> "Transporter | None":
        """Create a Transporter from a manifest instance and rcra_site dict."""
        e_signatures = data.pop("e_signatures", [])
        if data.get("paper_signature") is not None:
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
            msg = f"Handler created {transporter}"
            logger.debug(msg)
            for e_signature_data in e_signatures:
                e_sig = ESignature.objects.save(manifest_handler=transporter, **e_signature_data)
                msg = f"ESignature created {e_sig}"
                logger.debug(msg)
        except KeyError as exc:
            msg = f"KeyError while creating rcra_site {exc}"
            logger.warning(msg)
        except ValidationError as exc:
            msg = f"ValidationError while creating rcra_site {exc}"
            logger.warning(msg)
            raise
        else:
            return transporter


class Transporter(Handler):
    """Model definition for entities listed as transporters of hazardous waste on the manifest."""

    manifest = models.ForeignKey(
        "manifest.Manifest",
        related_name="transporters",
        on_delete=models.CASCADE,
    )
    order = models.PositiveIntegerField()

    objects = TransporterManager()

    class Meta:
        """Metaclass."""

        ordering = ["manifest__mtn"]

    def __str__(self):
        """Human-readable representation."""
        return f"{self.rcra_site.epa_id}"
