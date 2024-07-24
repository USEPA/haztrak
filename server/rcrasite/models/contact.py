import logging
from re import match

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)


class RcraCountries(models.TextChoices):
    US = "US", _("United States")
    MX = "MX", _("Mexico")
    CA = "CA", _("Canada")


class RcraStates(models.TextChoices):
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


class RcraPhoneNumber(models.CharField):
    """
    RcraPhoneNumber encapsulates RCRAInfo's representation of a phone (not including extensions)
    """

    def validate(self, value, model_instance):
        if not match(r"^\d{3}-\d{3}-\d{4}$", value):
            raise ValidationError(
                _("%(value)s should be a phone with format ###-###-####"),
                params={"value": value},
            )


class RcraPhone(models.Model):
    """
    RCRAInfo phone model, stores phones in ###-###-#### format
    along with up to 6 digit extension.
    """

    class Meta:
        ordering = ["number"]

    number = RcraPhoneNumber(
        max_length=12,
    )
    extension = models.CharField(
        max_length=6,
        null=True,
        blank=True,
    )

    def __str__(self):
        if self.extension:
            return f"{self.number} Ext. {self.extension}"
        return f"{self.number}"


class Address(models.Model):
    """
    Used to capture RCRAInfo address instances (mail, site).
    """

    class Meta:
        ordering = ["address1"]

    street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True,
    )
    address1 = models.CharField(
        verbose_name="address 1",
        max_length=50,
    )
    address2 = models.CharField(
        verbose_name="address 2",
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
        choices=RcraStates.choices,
    )
    country = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=RcraCountries.choices,
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


class ContactManager(models.Manager):
    """Contact Model database querying interface"""

    def save(self, **contact_data) -> models.QuerySet:
        """
        Create Contact instance in database, create related phone instance if applicable,
        and return the new instance.
        """
        if "phone" in contact_data:
            phone_data = contact_data.pop("phone")
            if isinstance(phone_data, RcraPhone):
                phone = phone_data
            else:
                phone = RcraPhone.objects.create(**phone_data)
            return self.create(**contact_data, phone=phone)
        return super().save(**contact_data)


class Contact(models.Model):
    """
    RCRAInfo contact including personnel information such as name, email, company,
    includes a phone related field.
    """

    class Meta:
        ordering = ["first_name"]

    objects = ContactManager()

    first_name = models.CharField(
        max_length=38,
        null=True,
        blank=True,
    )
    middle_initial = models.CharField(
        max_length=1,
        null=True,
        blank=True,
    )
    last_name = models.CharField(
        max_length=38,
        null=True,
        blank=True,
    )
    phone = models.ForeignKey(
        RcraPhone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    email = models.EmailField(
        null=True,
        blank=True,
    )
    company_name = models.CharField(
        max_length=80,
        null=True,
        blank=True,
    )

    def __str__(self):
        try:
            first = self.first_name
            middle = self.middle_initial or ""
            last = self.last_name
            return f"{first.capitalize()} {middle.capitalize()} {last.capitalize()}"
        except AttributeError:
            return f"Unknown Contact {self.pk}"
