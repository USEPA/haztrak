import logging

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.trak.models.base_models import TrakBaseManager, TrakBaseModel

logger = logging.getLogger(__name__)


class WasteLineManager(TrakBaseManager):
    """
    Inter-model related functionality for Contact Model
    """

    def save(self, **waste_data) -> models.QuerySet:
        return super().save(**waste_data)


class WasteLine(TrakBaseModel):
    """
    ToDo: Every place we have as a JSON field likely should be stored in separate table
    Model definition for hazardous waste listed on a uniform hazardous waste manifest.
    """

    class Meta:
        ordering = ["manifest__mtn", "line_number"]

    objects = WasteLineManager()

    manifest = models.ForeignKey(
        "Manifest",
        related_name="wastes",
        on_delete=models.CASCADE,
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
    line_number = models.PositiveIntegerField(
        verbose_name="waste line number",
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

    def __str__(self):
        return f"{self.manifest} line {self.line_number}"


class RcraCodeBaseModel(TrakBaseModel):
    """Abstract base class for Epa Lookups and codes"""

    code = models.CharField(
        max_length=2,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.code}"

    class Meta:
        abstract = True


class FederalWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with Federal Waste Codes"""

    def get_queryset(self):
        return super().get_queryset().filter(code_type=WasteCode.CodeType.FEDERAL)


class StateWasteCodeManager(models.Manager):
    """WasteCode model manager for dealing with State Waste Codes"""

    def get_queryset(self):
        return super().get_queryset().filter(code_type=WasteCode.CodeType.STATE)


class WasteCode(RcraCodeBaseModel):
    """Manifest Federal and state waste codes"""

    class Meta:
        ordering = ["code"]

    objects = models.Manager()
    federal = FederalWasteCodeManager()
    state = StateWasteCodeManager()

    class CodeType(models.TextChoices):
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

    STATE_CHOICES = [
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


class DotOptionType(models.TextChoices):
    ID = ("ID", _("Id"))  # DOT ID number
    GROUP = ("GROUP", _("Group"))  # DOT packing group
    NAME = ("NAME", _("Name"))  # DOT Proper shipping name
    CLASS = ("CLASS", _("Class"))  # DOT Hazard class


class IdNumbers(models.Manager):
    """DOT Option model manager for dealing with DOT ID numbers"""

    def get_queryset(self):
        return super().get_queryset().filter(value_type=DotOptionType.ID)


class PackingGroups(models.Manager):
    """DOT Option model manager for dealing with DOT ID numbers"""

    def get_queryset(self):
        return super().get_queryset().filter(value_type=DotOptionType.GROUP)


class ShippingNames(models.Manager):
    """DOT Option model manager for dealing with DOT ID numbers"""

    def get_queryset(self):
        return super().get_queryset().filter(value_type=DotOptionType.NAME)


class HazardClass(models.Manager):
    """DOT Option model manager for dealing with DOT ID numbers"""

    def get_queryset(self):
        return super().get_queryset().filter(value_type=DotOptionType.CLASS)


class DotLookup(models.Model):
    """data used to construct Department of Transportation (DOT) shipping descriptions"""

    objects = models.Manager()
    id_numbers = IdNumbers()
    packing_groups = PackingGroups()
    shipping_names = ShippingNames()
    hazard_classes = HazardClass()

    class Meta:
        ordering = ["value_type", "value"]

    value = models.CharField(
        max_length=255,
        null=False,
    )
    value_type = models.CharField(
        max_length=5,
        choices=DotOptionType.choices,
    )

    def __str__(self):
        return f"{self.value_type}: {self.value}"
