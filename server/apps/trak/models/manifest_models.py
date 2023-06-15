import logging
import re
from typing import Dict, List

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Max, Q, QuerySet
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField

from apps.sites.models import RcraSiteType, RcraStates, Role
from apps.trak.models import Handler

from .base_models import TrakBaseManager, TrakBaseModel
from .signature_models import ESignature
from .transporter_models import Transporter
from .waste_models import WasteLine

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


class ManifestManager(TrakBaseManager):
    """
    Inter-model related functionality for Manifest Model
    """

    def existing_mtn(self, *args, mtn: List[str]) -> QuerySet:
        """
        Filter non-existent manifest tracking numbers (MTN).
        Also accepts *args to pass things like django.db.models.Q objects
        """
        return self.model.objects.filter(*args, mtn__in=mtn)

    @staticmethod
    def get_handler_query(site_id: str, site_type: RcraSiteType | str):
        """Returns a Django Query object for filtering by rcra_site type"""
        if isinstance(site_type, str) and not isinstance(site_type, RcraSiteType):
            site_type = site_type.lower()
        match site_type:
            case RcraSiteType.GENERATOR | "generator":
                return Q(generator__rcra_site__epa_id=site_id)
            case RcraSiteType.TRANSPORTER | "transporter":
                return Q(transporters__rcra_site__epa_id=site_id)
            case RcraSiteType.TSDF | "tsdf":
                return Q(tsdf__rcra_site__epa_id=site_id)
            case _:
                raise ValueError(f"unrecognized site_type argument {site_type}")

    def save(self, **manifest_data: Dict):
        """Create a manifest with its related models instances"""
        waste_data = []
        trans_data = []
        additional_info = None
        manifest_generator = None
        manifest_tsdf = None
        if "wastes" in manifest_data:
            waste_data = manifest_data.pop("wastes")
        if "transporters" in manifest_data:
            trans_data = manifest_data.pop("transporters")
        # Create manifest handlers (generator and TSDF) and all related models
        if "generator" in manifest_data:
            manifest_generator = Handler.objects.save(**manifest_data.pop("generator"))
        if "tsdf" in manifest_data:
            manifest_tsdf = Handler.objects.save(**manifest_data.pop("tsdf"))
        if "additional_info" in manifest_data:
            additional_info = AdditionalInfo.objects.create(**manifest_data.pop("additional_info"))
        # Create model instances
        manifest = super().save(
            generator=manifest_generator,
            tsdf=manifest_tsdf,
            additional_info=additional_info,
            **manifest_data,
        )
        # save one-to-many objects that needs to Manifest.id as a foreign key
        for waste_line in waste_data:
            saved_waste_line = WasteLine.objects.save(manifest=manifest, **waste_line)
            logger.debug(f"WasteLine saved {saved_waste_line.pk}")
        for transporter in trans_data:
            saved_transporter = Transporter.objects.save(manifest=manifest, **transporter)
            logger.debug(f"WasteLine saved {saved_transporter.pk}")
        return manifest


class Manifest(TrakBaseModel):
    """
    Model definition the e-Manifest Uniform Hazardous Waste Manifest
    """

    class Meta:
        ordering = ["update_date", "mtn"]

    objects = ManifestManager()

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
        verbose_name="potential ship date",
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
        "Handler",
        on_delete=models.PROTECT,
        related_name="generator",
    )
    # transporters
    tsdf = models.ForeignKey(
        "Handler",
        verbose_name="designated facility",
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
        verbose_name="residue new MTN",
        blank=True,
        default=list,
    )
    import_flag = models.BooleanField(
        verbose_name="import",
        blank=True,
        default=False,
    )
    import_info = models.JSONField(
        verbose_name="import information",
        null=True,
        blank=True,
    )
    contains_residue_or_rejection = models.BooleanField(
        verbose_name="contains previous rejection or residue waste",
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
        verbose_name="original submission type",
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
        verbose_name="next transfer time",
        null=True,
        blank=True,
    )

    @property
    def is_draft(self) -> bool:
        if self.mtn is None or self.mtn.endswith("DFT"):
            return True
        return False

    def __str__(self):
        return f"{self.mtn}"


class AdditionalInfo(TrakBaseModel):
    """
    Entity containing Additional Information. Relevant to Both Manifest and individual WastesLines.
    Shipment rejection related info is stored in this object.
    """

    class Meta:
        verbose_name = "Additional Info"
        verbose_name_plural = "Additional Info"

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

    def __str__(self):
        return f"{self.original_mtn or 'Unknown'}"


class PortOfEntry(TrakBaseModel):
    """
    Contains location information pertaining to where hazardous waste was imported
    """

    class Meta:
        verbose_name = "Port of Entry"
        verbose_name_plural = "Ports of Entry"

    state = models.CharField(
        choices=RcraStates.choices,
        max_length=2,
        null=True,
        blank=True,
    )
    city_port = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )


class ImportInfo(TrakBaseModel):
    """
    Contains information on hazardous waste imported to the United Stated
    """

    class Meta:
        verbose_name = "Import Info"
        verbose_name_plural = "Import Info"

    import_generator = models.JSONField(
        null=True,
        blank=True,
    )
    port_of_entry = models.ForeignKey(
        "PortOfEntry",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )


class CorrectionInfo(TrakBaseModel):
    """
    Contains correction information.
    Shall not be provided for Save  and Update Manifest services.
    will be returned by Get manifest service
    """

    class Meta:
        verbose_name = "Correction Info"
        verbose_name_plural = "Correction Info"

    version_number = models.IntegerField(
        null=True,
        blank=True,
    )
    active = models.BooleanField(
        null=True,
        blank=True,
    )
    ppc_active = models.BooleanField(
        null=True,
        blank=True,
    )
    electronic_signature_info = models.ForeignKey(
        "ESignature",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    epa_site_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )
    initiator_role = models.CharField(
        choices=Role.choices,
        max_length=2,
        null=True,
        blank=True,
    )
    update_role = models.CharField(
        choices=Role.choices,
        max_length=2,
        null=True,
        blank=True,
    )


class RejectionInfo(TrakBaseModel):
    """
    Rejection information about the entity if the manifest is rejected
    """
    
    class Meta:
        verbose_name = "Rejection Info"
        verbose_name_plural = "Rejection Info"
    
    class FacilityType(models.TextChoices):
        """
        Specifies the type of the alternate facility for shipping rejected waste
        """

        GENERATOR = "GEN", _("Generator")
        TSDF = "TSD", _("Tsdf")
    
    class RejectionType(models.TextChoices):
        
        FR = "FR", _("Full Rejection")
        PR = "PR", _("Partial Rejection")
    
    transporter_on_site = models.BooleanField(
        null=True,
        blank=True,
    )
    
    rejection_type = models.CharField(
        choices=RejectionType.choices,
        max_length=2,
        null=True,
        blank=True,
    )
    
    alternate_designated_facility_type = models.CharField(
        choices=FacilityType.choices,
        max_length=3,
        null=True,
        blank=True,
    )
    
    generator_paper_signature = models.ForeignKey(
        "PaperSignature",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    
    generator_electronic_signature = models.ForeignKey(
        "ESignature",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    
    alternate_designated_facility = models.ForeignKey(
        "Handler",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    
    new_manifest_tracking_numbers = ArrayField(
        base_field=models.CharField(max_length=200, null=True), 
        default=list
        )
    
    rejection_comments = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        )
