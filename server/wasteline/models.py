"""Models for hazardous waste listed on a uniform hazardous waste manifest."""

import logging
from typing import ClassVar, Optional

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)


class WasteLineManager(models.Manager):
    """Wasteline model query interface."""

    def save(self, instance: Optional["WasteLine"], **waste_data: dict) -> "WasteLine":
        """Save a WasteLine instance."""
        try:
            line_number = waste_data.pop("line_number", None)
            manifest = waste_data.pop("manifest", None)
            wl, created = WasteLine.objects.update_or_create(
                manifest=manifest,
                line_number=line_number,
                defaults=waste_data,
            )
        except KeyError as exc:
            msg = f"Missing required field: {exc}"
            raise ValidationError(msg) from exc
        else:
            return wl


class WasteLine(models.Model):
    """Model definition for hazardous waste listed on a uniform hazardous waste manifest."""

    manifest = models.ForeignKey(
        "manifest.Manifest",
        related_name="wastes",
        on_delete=models.CASCADE,
    )
    line_number = models.PositiveIntegerField(
        verbose_name="waste line number",
    )
    dot_hazardous = models.BooleanField(
        verbose_name="DOT hazardous",
    )
    dot_info = models.JSONField(
        verbose_name="DOT information",
        null=True,
        blank=True,
    )
    quantity = models.JSONField(
        null=True,
        blank=True,
    )
    hazardous_waste = models.JSONField(
        null=True,
        blank=True,
    )
    br = models.BooleanField(
        verbose_name="BR info provided",
    )
    br_info = models.JSONField(
        verbose_name="BR information",
        null=True,
        blank=True,
    )
    management_method = models.JSONField(
        verbose_name="management method code",
        null=True,
        blank=True,
    )
    pcb = models.BooleanField(
        verbose_name="contains PCBs",
    )
    pcb_infos = models.JSONField(
        verbose_name="PCB information",
        null=True,
        blank=True,
    )
    discrepancy_info = models.JSONField(
        verbose_name="discrepancy-residue information",
        null=True,
        blank=True,
    )
    epa_waste = models.BooleanField(
        verbose_name="EPA waste",
    )
    additional_info = models.JSONField(
        null=True,
        blank=True,
    )

    objects = WasteLineManager()

    class Meta:
        """Metaclass."""

        ordering: ClassVar = ["manifest__mtn", "line_number"]
        unique_together = ("manifest", "line_number")

    def __str__(self):
        """Human-readable representation of the WasteLine."""
        return f"{self.manifest} line {self.line_number}"


class FederalWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with Federal Waste Codes."""

    def get_queryset(self):
        """Return only federal waste codes."""
        return super().get_queryset().filter(code_type=WasteCode.CodeType.FEDERAL)


class StateWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with State Waste Codes."""

    def filter_by_state_id(self, state_id: str) -> models.QuerySet:
        """Get a list of state waste codes by state id."""
        return self.filter(state_id=state_id)

    def get_queryset(self):
        """Return only state waste codes."""
        return super().get_queryset().filter(code_type=WasteCode.CodeType.STATE)


class WasteCode(models.Model):
    """Manifest Federal and state waste codes."""

    class CodeType(models.TextChoices):
        """Waste code type."""

        STATE = "ST", _("State")
        FEDERAL = "FD", _("Federal")

    AK = "AK"
    AL = "AL"
    AP = "AP"
    AR = "AR"
    AZ = "AZ"
    CA = "CA"
    CO = "CO"
    CT = "CT"
    DC = "DC"
    DE = "DE"
    FL = "FL"
    GA = "GA"
    GU = "GU"
    HI = "HI"
    IA = "IA"
    ID = "ID"
    IL = "IL"
    IN = "IN"
    KS = "KS"
    KY = "KY"
    LA = "LA"
    MA = "MA"
    MD = "MD"
    ME = "ME"
    MI = "MI"
    MN = "MN"
    MO = "MO"
    MS = "MS"
    MT = "MT"
    NC = "NC"
    ND = "ND"
    NE = "NE"
    NH = "NH"
    NJ = "NJ"
    NM = "NM"
    NV = "NV"
    NY = "NY"
    OH = "OH"
    OK = "OK"
    OR = "OR"
    PA = "PA"
    PR = "PR"
    RI = "RI"
    SC = "SC"
    SD = "SD"
    TN = "TN"
    TX = "TX"
    UT = "UT"
    VA = "VA"
    VI = "VI"
    VT = "VT"
    WA = "WA"
    WI = "WI"
    WV = "WV"
    WY = "WY"

    STATE_CHOICES: ClassVar = [
        (AK, "Alaska"),
        (AL, "Alabama"),
        (AP, "Armed Forces Pacific"),
        (AR, "Arkansas"),
        (AZ, "Arizona"),
        (CA, "California"),
        (CO, "Colorado"),
        (CT, "Connecticut"),
        (DC, "District of Columbia"),
        (DE, "Delaware"),
        (FL, "Florida"),
        (GA, "Georgia"),
        (GU, "Guam"),
        (HI, "Hawaii"),
        (IA, "Iowa"),
        (ID, "Idaho"),
        (IL, "Illinois"),
        (IN, "Indiana"),
        (KS, "Kansas"),
        (KY, "Kentucky"),
        (LA, "Louisiana"),
        (MA, "Massachusetts"),
        (MD, "Maryland"),
        (ME, "Maine"),
        (MI, "Michigan"),
        (MN, "Minnesota"),
        (MO, "Missouri"),
        (MS, "Mississippi"),
        (MT, "Montana"),
        (NC, "North Carolina"),
        (ND, "North Dakota"),
        (NE, "Nebraska"),
        (NH, "New Hampshire"),
        (NJ, "New Jersey"),
        (NM, "New Mexico"),
        (NV, "Nevada"),
        (NY, "New York"),
        (OH, "Ohio"),
        (OK, "Oklahoma"),
        (OR, "Oregon"),
        (PA, "Pennsylvania"),
        (PR, "Puerto Rico"),
        (RI, "Rhode Island"),
        (SC, "South Carolina"),
        (SD, "South Dakota"),
        (TN, "Tennessee"),
        (TX, "Texas"),
        (UT, "Utah"),
        (VA, "Virginia"),
        (VI, "Virgin Islands"),
        (VT, "Vermont"),
        (WA, "Washington"),
        (WI, "Wisconsin"),
        (WV, "West Virginia"),
        (WY, "Wyoming"),
    ]

    code = models.CharField(
        max_length=6,
        unique=True,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    code_type = models.CharField(
        choices=CodeType.choices,
        max_length=2,
    )
    state_id = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=STATE_CHOICES,
    )

    objects = models.Manager()
    federal = FederalWasteCodeManager()
    state = StateWasteCodeManager()

    class Meta:
        """Metaclass."""

        ordering: ClassVar = ["code"]

    def __str__(self):
        """Human-readable representation of the WasteCode."""
        return f"{self.code}"


class DotLookupType(models.TextChoices):
    """DOT Lookup value types."""

    ID = ("ID", _("Id"))  # DOT ID number
    GROUP = ("GROUP", _("Group"))  # DOT packing group
    NAME = ("NAME", _("Name"))  # DOT Proper shipping name
    CLASS = ("CLASS", _("Class"))  # DOT Hazard class


class DotLookupBaseManager(models.Manager):
    """Base Model manager for DOT lookup options."""

    def filter_by_value(self, value: str) -> models.QuerySet:
        """Filter by DOT Lookup Value."""
        return self.filter(value__icontains=value)


class IdNumbers(DotLookupBaseManager):
    """DOT Option model manager for dealing with DOT ID numbers."""

    def get_queryset(self):
        """Return only DOT ID number options."""
        return super().get_queryset().filter(value_type=DotLookupType.ID)


class PackingGroups(DotLookupBaseManager):
    """DOT Option model manager for dealing with DOT ID numbers."""

    def get_queryset(self):
        """Return only DOT Packing Group options."""
        return super().get_queryset().filter(value_type=DotLookupType.GROUP)


class ShippingNames(DotLookupBaseManager):
    """DOT Option model manager for dealing with DOT ID numbers."""

    def filter_by_value(self, value: str) -> models.QuerySet:
        """Filter by value."""
        return self.filter(value__icontains=value)

    def get_queryset(self):
        """Return only DOT Proper Shipping Name options."""
        return super().get_queryset().filter(value_type=DotLookupType.NAME)


class HazardClass(DotLookupBaseManager):
    """DOT Option model manager for dealing with DOT ID numbers."""

    def get_queryset(self):
        """Return only DOT Hazard Class options."""
        return super().get_queryset().filter(value_type=DotLookupType.CLASS)


class DotLookup(models.Model):
    """data used to construct Department of Transportation (DOT) shipping descriptions."""

    objects = models.Manager()
    id_numbers = IdNumbers()
    packing_groups = PackingGroups()
    shipping_names = ShippingNames()
    hazard_classes = HazardClass()

    value = models.CharField(
        max_length=255,
        null=False,
    )
    value_type = models.CharField(
        max_length=5,
        choices=DotLookupType.choices,
    )

    class Meta:
        """Metaclass."""

        ordering: ClassVar = ["value_type", "value"]
        verbose_name = "DOT lookup"
        verbose_name_plural = "DOT lookups"

    def __str__(self):
        """Human-readable representation of the DOT lookup."""
        return f"{self.value_type}: {self.value}"
