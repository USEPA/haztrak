from django.db import models
from django.utils.translation import gettext_lazy as _


class EpaCountries(models.TextChoices):
    US = "US", _("United States")
    MX = "MX", _("Mexico")
    CA = "CA", _("Canada")


class EpaStates(models.TextChoices):
    AK = "AK", _("Alaska")
    AL = "AL", _("Alabama")
    AP = "AP", _("Armed Forces Pacific")
    AR = "AR", _("Arkansas")
    AZ = "AZ", _("Arizona")
    CA = "CA", _("California")
    CO = "CO", _("Colorado")
    CT = "CT", _("Connecticut")
    DC = "DC", _("Washington DC")
    DE = "DE", _("Delaware")
    FL = "FL", _("Florida")
    GA = "GA", _("Georgia")
    GU = "GU", _("Guam")
    HI = "HI", _("Hawaii")
    IA = "IA", _("Iowa")
    ID = "ID", _("Idaho")
    IL = "IL", _("Illinois")
    IN = "IN", _("Indiana")
    KS = "KS", _("Kansas")
    KY = "KY", _("Kentucky")
    LA = "LA", _("Louisiana")
    MA = "MA", _("Massachusetts")
    MD = "MD", _("Maryland")
    ME = "ME", _("Maine")
    MI = "MI", _("Michigan")
    MN = "MN", _("Minnesota")
    MO = "MO", _("Missouri")
    MS = "MS", _("Mississippi")
    MT = "MT", _("Montana")
    NC = "NC", _("North Carolina")
    ND = "ND", _("North Dakota")
    NE = "NE", _("Nebraska")
    NH = "NH", _("New Hampshire")
    NJ = "NJ", _("New Jersey")
    NM = "NM", _("New Mexico")
    NV = "NV", _("Nevada")
    NY = "NY", _("New York")
    OH = "OH", _("Ohio")
    OK = "OK", _("Oklahoma")
    OR = "OR", _("Oregon")
    PA = "PA", _("Pennsylvania")
    PR = "PR", _("Puerto Rico")
    RI = "RI", _("Rhode Island")
    SC = "SC", _("South Carolina")
    SD = "SD", _("South Dakota")
    TN = "TN", _("Tennessee")
    TX = "TX", _("Texas")
    UT = "UT", _("Utah")
    VA = "VA", _("Virginia")
    VI = "VI", _("Virgin Islands")
    VT = "VT", _("Vermont")
    WA = "WA", _("Washington")
    WI = "WI", _("Wisconsin")
    WV = "WV", _("West Virginia")
    WY = "WY", _("Wyoming")
    XA = "XA", _("REGION 01 PURVIEW")
    XB = "XB", _("REGION 02 PURVIEW")
    XC = "XC", _("REGION 03 PURVIEW")
    XD = "XD", _("REGION 04 PURVIEW")
    XE = "XE", _("REGION 05 PURVIEW")
    XF = "XF", _("REGION 06 PURVIEW")
    XG = "XG", _("REGION 07 PURVIEW")
    XH = "XH", _("REGION 08 PURVIEW")
    XI = "XI", _("REGION 09 PURVIEW")
    XJ = "XJ", _("REGION 10 PURVIEW")


class Address(models.Model):
    """
    Used to capture RCRAInfo address instances (mail, site).
    """

    street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True,
    )
    address1 = models.CharField(
        verbose_name="Address 1",
        max_length=50,
    )
    address2 = models.CharField(
        verbose_name="Address 2",
        max_length=50,
        default=None,
        null=True,
        blank=True,
    )
    city = models.CharField(
        max_length=25,
        null=True,
        blank=True,
    )
    state = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=EpaStates.choices,
    )
    country = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=EpaCountries.choices,
    )
    zip = models.CharField(
        null=True,
        blank=True,
        max_length=5,
    )

    def __str__(self):
        if self.street_number:
            return f"{self.street_number} {self.address1}"
        return f" {self.address1}"

    def __repr__(self):
        field_values = ", ".join(
            f"{field.name}={getattr(self, field.name)!r}" for field in self._meta.fields
        )
        return f"<{self.__class__.__name__}({field_values})>"
