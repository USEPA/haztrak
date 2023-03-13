import logging
import re
from typing import Dict

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Max
from django.utils.translation import gettext_lazy as _

from apps.trak.models import ManifestHandler
from apps.trak.models.base_model import TrakManager

logger = logging.getLogger(__name__)


def draft_mtn():
    """
    A callable that returns a timestamped draft MTN in lieu of an
    official MTN from e-Manifest
    """
    manifests = Manifest.objects.all()
    if not manifests:
        max_id = 1
    else:
        max_id = manifests.aggregate(Max("id"))
    return f"{str(max_id).zfill(9)}DFT"


def validate_mtn(value):
    if not re.match(r"[0-9]{9}[A-Z]{3}", value):
        raise ValidationError(
            _("%(value)s is not in valid MTN format: [0-9]{9}[A-Z]{3}"),
            params={"value": value},
        )


class ManifestManager(TrakManager):
    """
    Inter-model related functionality for Manifest Model
    """

    def save(self, manifest_data: Dict):
        """Create a manifest with its related models instances"""
        additional_info = None
        manifest_generator = None
        manifest_tsd = None
        # Create manifest handlers (generator and TSD) and all related models
        if "generator" in manifest_data:
            manifest_generator = ManifestHandler.objects.save(**manifest_data.pop("generator"))
        if "tsd" in manifest_data:
            manifest_tsd = ManifestHandler.objects.save(**manifest_data.pop("tsd"))
        if "additional_info" in manifest_data:
            additional_info = AdditionalInfo.objects.create(**manifest_data.pop("additional_info"))
        # Create model instances
        return super().save(
            generator=manifest_generator,
            tsd=manifest_tsd,
            additional_info=additional_info,
            **manifest_data,
        )


class Manifest(models.Model):
    """
    Model definition the e-Manifest Uniform Hazardous Waste Manifest
    """

    class LockReason(models.TextChoices):
        ASYNC_SIGN = "ACS", _("AsyncSign")
        CHANGE_BILLER = "ECB", _("EpaChangeBiller")
        CORRECTION = "EPC", _("EpaCorrection")

    class OriginType(models.TextChoices):
        WEB = "Web", _("Web")
        SERVICE = "Service", _("Service")
        MAIL = "Mail", _("Mail")

    class SubType(models.TextChoices):
        ELECTRONIC = "FullElectronic", _("Full Electronic")
        DATA_IMAGE = "DataImage5Copy", _("Data + Image")
        HYBRID = "Hybrid", _("Hybrid")
        IMAGE = "Image", _("Image")

    class Status(models.TextChoices):
        NOT_ASSIGNED = "NotAssigned", _("Not Assigned")
        PENDING = "Pending", _("Pending")
        SCHEDULED = "Scheduled", _("Scheduled")
        IN_TRANSIT = "InTransit", _("In Transit")
        READY_FOR_SIGNATURE = "ReadyForSignature", _("Ready for Signature")
        SIGNED = "Signed", _("Signed")
        CORRECTED = "Corrected", _("Corrected")
        UNDER_CORRECTION = "UnderCorrection", _("Under Correction")
        VALIDATION_FAILED = "MtnValidationFailed", _("MTN Validation Failed")

    objects = ManifestManager()

    created_date = models.DateTimeField(
        null=True,
        auto_now=True,
    )
    update_date = models.DateTimeField(
        auto_now=True,
    )
    mtn = models.CharField(
        verbose_name="manifest Tracking Number",
        max_length=30,
        default=draft_mtn,
        unique=True,
        validators=[validate_mtn],
    )
    status = models.CharField(
        max_length=25,
        choices=Status.choices,
        default="NotAssigned",
    )
    submission_type = models.CharField(
        max_length=25,
        choices=SubType.choices,
        default="FullElectronic",
    )
    signature_status = models.BooleanField(
        null=True,
        blank=True,
    )
    origin_type = models.CharField(
        max_length=25,
        choices=OriginType.choices,
        default="Service",
    )
    shipped_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    potential_ship_date = models.DateTimeField(
        verbose_name="Potential ship date",
        null=True,
        blank=True,
    )
    received_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    certified_date = models.DateTimeField(
        null=True,
        blank=True,
    )
    certified_by = models.JSONField(
        null=True,
        blank=True,
    )
    generator = models.ForeignKey(
        "ManifestHandler",
        on_delete=models.PROTECT,
        related_name="generator",
    )
    # transporters
    tsd = models.ForeignKey(
        "ManifestHandler",
        verbose_name="Designated facility",
        on_delete=models.PROTECT,
        related_name="designated_facility",
    )
    broker = models.JSONField(null=True, blank=True)
    # wastes
    rejection = models.BooleanField(
        blank=True,
        default=False,
    )
    rejection_info = models.JSONField(
        verbose_name="Rejection Information",
        null=True,
        blank=True,
    )
    discrepancy = models.BooleanField(
        blank=True,
        default=False,
    )
    residue = models.BooleanField(
        blank=True,
        default=False,
    )
    residue_new_mtn = models.JSONField(
        verbose_name="Residue new MTN",
        blank=True,
        default=list,
    )
    import_flag = models.BooleanField(
        verbose_name="Import",
        blank=True,
        default=False,
    )
    import_info = models.JSONField(
        verbose_name="Import information",
        null=True,
        blank=True,
    )
    contains_residue_or_rejection = models.BooleanField(
        verbose_name="Contains previous rejection or residue waste",
        null=True,
        blank=True,
    )
    printed_document = models.JSONField(
        null=True,
        blank=True,
    )
    form_document = models.JSONField(
        null=True,
        blank=True,
    )
    additional_info = models.ForeignKey(
        "AdditionalInfo",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    correction_info = models.JSONField(
        null=True,
        blank=True,
    )
    ppc_status = models.JSONField(
        verbose_name="PPC info",
        null=True,
        blank=True,
    )
    locked = models.BooleanField(
        null=True,
        blank=True,
    )
    lock_reason = models.CharField(
        max_length=25,
        choices=LockReason.choices,
        null=True,
        blank=True,
    )
    transfer_requested = models.BooleanField(
        null=True,
        blank=True,
    )
    transfer_status = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    original_sub_type = models.CharField(
        verbose_name="Original Submission Type",
        max_length=25,
        choices=SubType.choices,
        null=True,
        blank=True,
    )
    transfer_count = models.IntegerField(
        null=True,
        blank=True,
    )
    next_transfer_time = models.DateTimeField(
        verbose_name="Next Transfer Time",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.mtn}"


class AdditionalInfo(models.Model):
    """
    Entity containing Additional Information. Relevant to Both Manifest and individual WastesLines.
    Shipment rejection related info is stored in this object.
    """

    class NewDestination(models.TextChoices):
        """Shipment destination choices upon rejection"""

        GENERATOR = "GEN", _("Generator")
        TSDF = "TSD", _("Tsdf")

    original_mtn = models.JSONField(
        null=True,
        blank=True,
        help_text="Original manifest tracking number of rejected manifest"
        "Regex expression validation: [0-9]{9}[A-Z]{3}",
        validators=[validate_mtn],
    )
    new_destination = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        choices=NewDestination.choices,
        help_text="Destination of the new manifest created during rejection or residue.",
    )
    consent_number = models.CharField(
        max_length=12,
        null=True,
        blank=True,
    )
    # comments ToDo: implement Comment model, one-to-many relationship with additional info
    comments = models.JSONField(
        null=True,
        blank=True,
    )
    handling_instructions = models.CharField(
        max_length=4000,
        null=True,
        blank=True,
        help_text="Special Handling Instructions",
    )

    class Meta:
        verbose_name = "AdditionalInfo"
        verbose_name_plural = "AdditionalInfo"

    def __str__(self):
        return f"{self.original_mtn or 'Unknown'}"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"
