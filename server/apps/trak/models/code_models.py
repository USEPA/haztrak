import logging

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.trak.models.base_models import TrakBaseModel

logger = logging.getLogger(__name__)


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
