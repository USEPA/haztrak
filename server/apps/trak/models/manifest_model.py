import logging
from datetime import datetime

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.trak.models import ManifestHandler

logger = logging.getLogger(__name__)


def draft_mtn():
    """
    A callable that returns a timestamped draft MTN in lieu of an
    official MTN from e-Manifest
    """
    return str(f'draft-{datetime.now().strftime("%Y-%m-%d-%H:%M:%S")}')


class ManifestManager(models.Manager):
    """
    Inter-model related functionality for Manifest Model
    """

    @staticmethod
    def create_manifest(manifest_data):
        """Create a manifest with its related models instances"""
        # Create manifest handlers (generator and TSD) and all related models
        tsd_data = manifest_data.pop("tsd")
        gen_data = manifest_data.pop("generator")
        manifest_generator = ManifestHandler.objects.create_manifest_handler(**gen_data)
        manifest_tsd = ManifestHandler.objects.create_manifest_handler(**tsd_data)
        # Create model instances
        return Manifest.objects.create(
            generator=manifest_generator, tsd=manifest_tsd, **manifest_data
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
    additional_info = models.JSONField(
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
