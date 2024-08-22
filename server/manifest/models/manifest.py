import logging
import re
from abc import ABC, abstractmethod
from typing import List, Literal, Optional

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q, QuerySet
from django.utils.translation import gettext_lazy as _
from rcrasite.models import RcraSiteType, RcraStates
from wasteline.models import WasteLine

from .handler import Handler, Transporter

logger = logging.getLogger(__name__)


def draft_mtn():
    """returns a timestamped draft MTN in lieu of an official MTN from e-Manifest"""
    mtn_count: int = Manifest.objects.all().count()
    return f"{str(mtn_count).zfill(9)}DFT"


def validate_mtn(value):
    """Validate manifest tracking number format"""
    if not re.match(r"[0-9]{9}[A-Z]{3}", value):
        raise ValidationError(
            _("%(value)s is not in valid MTN format: [0-9]{9}[A-Z]{3}"),
            params={"value": value},
        )


class ManifestHandlerFilter(ABC):
    """Interface for filtering manifests by handler"""

    @abstractmethod
    def filter_by_epa_id(self, epa_id: str) -> QuerySet:
        pass


class GeneratorFilter(ManifestHandlerFilter):
    """implementation for filtering manifests by generator"""

    def filter_by_epa_id(self, epa_id: str) -> Q:
        return Q(generator__rcra_site__epa_id=epa_id)


class TransporterFilter(ManifestHandlerFilter):
    """implementation for filtering manifests by Transporter"""

    def filter_by_epa_id(self, epa_id: str) -> Q:
        return Q(transporters__rcra_site__epa_id=epa_id)


class TsdfFilter(ManifestHandlerFilter):
    """implementation for filtering manifests by receiving facility"""

    def filter_by_epa_id(self, epa_id: str) -> Q:
        return Q(tsdf__rcra_site__epa_id=epa_id)


class AllHandlerFilter(ManifestHandlerFilter):
    """implementation for filtering manifests by all handlers types"""

    def filter_by_epa_id(self, epa_id: str) -> Q:
        return Q(
            Q(generator__rcra_site__epa_id=epa_id)
            | Q(tsdf__rcra_site__epa_id=epa_id)
            | Q(transporters__rcra_site__epa_id=epa_id)
        )


class HandlerFilterFactory:
    """Abstract Factory for creating ManifestHandlerFilter instances based on site_type"""

    @staticmethod
    def get_filter(site_type: RcraSiteType | Literal["all"]):
        if site_type == RcraSiteType.GENERATOR:
            return GeneratorFilter()
        elif site_type == RcraSiteType.TRANSPORTER:
            return TransporterFilter()
        elif site_type == RcraSiteType.TSDF:
            return TsdfFilter()
        elif site_type == "all":
            return AllHandlerFilter()
        else:
            raise ValueError(f"unrecognized site_type argument {site_type}")


class ManifestManager(models.Manager):
    """Manifest repository manager"""

    def filter_existing_mtn(self, mtn: List[str]) -> QuerySet:
        """Filter non-existent manifest tracking numbers (MTN)."""
        return self.model.objects.filter(mtn__in=mtn)

    def filter_by_epa_id_and_site_type(
        self, epa_ids: [str], site_type: RcraSiteType | Literal["all"] = "all"
    ) -> QuerySet:
        """Filter manifests by site_id and site_type"""
        handler_filter = HandlerFilterFactory.get_filter(site_type)
        return self.filter(handler_filter.filter_by_epa_id(epa_ids))

    @classmethod
    def save(cls, instance: Optional["Manifest"], **manifest_data: dict) -> "Manifest":
        """Update or Create a manifest with its related models instances"""
        waste_data = manifest_data.pop("wastes", [])
        transporter_data = manifest_data.pop("transporters", [])
        if instance:
            manifest = cls.update_manifest(instance, **manifest_data)
        else:
            manifest = cls.create_manifest(**manifest_data)
        for waste_line in waste_data:
            WasteLine.objects.save(None, manifest=manifest, **waste_line)
        Transporter.objects.filter(manifest=manifest).delete()
        for transporter in transporter_data:
            Transporter.objects.save(None, manifest=manifest, **transporter)
        return manifest

    @staticmethod
    def create_manifest(**data: dict):
        """Create a manifest instance with a dictionary of data"""
        try:
            additional_info: AdditionalInfo | None = None
            generator = Handler.objects.save(None, **data.pop("generator"))
            tsdf = Handler.objects.save(None, **data.pop("tsdf"))
            if "additional_info" in data:
                additional_info = AdditionalInfo.objects.create(**data.pop("additional_info"))
            manifest = Manifest.objects.create(
                generator=generator,
                tsdf=tsdf,
                additional_info=additional_info,
                **data,
            )
            return manifest
        except KeyError as e:
            raise ValidationError(f"Missing required key {e}")

    @staticmethod
    def update_manifest(instance, **data: dict):
        """Update a manifest instance with a dictionary of data"""
        if "generator" in data:
            instance.generator = Handler.objects.save(instance.generator, **data.pop("generator"))
        if "tsdf" in data:
            instance.tsdf = Handler.objects.save(instance.tsdf, **data.pop("tsdf"))
        if "additional_info" in data:
            instance.additional_info = AdditionalInfo.objects.create(**data.pop("additional_info"))
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


def manifest_factory(mtn=None, generator=None, tsdf=None, **kwargs):
    """Simple factory to create a Manifest instance with default values."""
    return Manifest(mtn=mtn, generator=generator, tsdf=tsdf, **kwargs)


class Manifest(models.Model):
    """Model definition the RCRA Uniform Hazardous Waste Manifest"""

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
    # transporters - one-to-many relationship, a manifest can have many transporters
    tsdf = models.ForeignKey(
        "Handler",
        verbose_name="designated facility",
        on_delete=models.PROTECT,
        related_name="designated_facility",
    )
    broker = models.JSONField(null=True, blank=True)
    # wastes - one-to-many relationship, a manifest can have many waste lines
    rejection = models.BooleanField(
        blank=True,
        null=True,
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


class AdditionalInfo(models.Model):
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
    # comments ToDo: implement Comment model
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


class PortOfEntry(models.Model):
    """location of where hazardous waste is imported or exported"""

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
