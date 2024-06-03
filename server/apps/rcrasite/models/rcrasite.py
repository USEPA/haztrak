import logging
from typing import Optional, Union

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.rcrasite.models import Address, Contact, RcraPhone

logger = logging.getLogger(__name__)


class RcraSiteType(models.TextChoices):
    GENERATOR = "Generator"
    TRANSPORTER = "Transporter"
    TSDF = "Tsdf"
    BROKER = "Broker"


class RcraSiteManager(models.Manager):
    """RcraSite Model database querying interface"""

    def __init__(self):
        self.handler_data = None
        super().__init__()

    def get_by_epa_id(self, epa_id: str) -> "RcraSite":
        """Return an RcraSite object by its epa_id"""
        return self.get(epa_id__iexact=epa_id)

    def save(self, instance: Optional["RcraSite"], **handler_data) -> "RcraSite":
        """
        Create an RcraSite and its related fields

        Keyword Args:
            contact (dict): Contact data in (ordered)dict format
            site_address (dict): Site address data dict
            mail_address (dict): mailing address data dict
            emergency_phone (dict): optional Phone dict
        """
        try:
            epa_id = handler_data.get("epa_id")
            if self.model.objects.filter(epa_id=epa_id).exists():
                return RcraSite.objects.get(epa_id=epa_id)
            self.handler_data = handler_data
            new_contact = Contact.objects.save(**self.handler_data.pop("contact"))
            emergency_phone = self.get_emergency_phone()
            site_address = self.get_address("site_address")
            mail_address = self.get_address("mail_address")
            rcra_site, created = self.model.objects.update_or_create(
                epa_id=self.handler_data.pop("epa_id"),
                site_address=site_address,
                mail_address=mail_address,
                emergency_phone=emergency_phone,
                contact=new_contact,
                defaults=self.handler_data,
            )
            return rcra_site
        except KeyError as exc:
            logger.warning(f"error while creating {self.model.__class__.__name__}{exc}")

    def get_emergency_phone(self) -> Union[RcraPhone, None]:
        """Check if emergency phone is present and create an RcraPhone row"""
        try:
            emergency_phone_data = self.handler_data.pop("emergency_phone")
            if emergency_phone_data is not None:
                return RcraPhone.objects.create(**emergency_phone_data)
        except KeyError as exc:
            logger.debug(exc)
            return None

    def get_address(self, key) -> Address:
        """Remove Address data and create if necessary"""
        try:
            address = self.handler_data.pop(key)
            if isinstance(address, Address):
                return address
            return Address.objects.create(**address)
        except KeyError as exc:
            logger.warning(exc)
            raise ValidationError(exc)


class RcraSite(models.Model):
    """RCRAInfo Site model (see 'Handler' which wraps this model with manifest specific data)"""

    class Meta:
        verbose_name = "RCRAInfo Site"
        verbose_name_plural = "RCRAInfo Sites"
        ordering = ["epa_id"]

    objects = RcraSiteManager()

    site_type = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        choices=RcraSiteType.choices,
    )
    epa_id = models.CharField(
        verbose_name="EPA ID number",
        max_length=25,
        unique=True,
    )
    name = models.CharField(
        max_length=200,
    )
    site_address = models.ForeignKey(
        "Address",
        on_delete=models.CASCADE,
        related_name="site_address",
    )
    mail_address = models.ForeignKey(
        "Address",
        on_delete=models.CASCADE,
        related_name="mail_address",
    )
    modified = models.BooleanField(
        null=True,
        blank=True,
    )
    registered = models.BooleanField(
        null=True,
        blank=True,
    )
    contact = models.ForeignKey(
        "Contact",
        on_delete=models.CASCADE,
        verbose_name="contact information",
    )
    emergency_phone = models.ForeignKey(
        RcraPhone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    gis_primary = models.BooleanField(
        verbose_name="GIS primary",
        null=True,
        blank=True,
        default=False,
    )
    can_esign = models.BooleanField(
        verbose_name="can electronically sign",
        null=True,
        blank=True,
    )
    limited_esign = models.BooleanField(
        verbose_name="limited electronic signing ability",
        null=True,
        blank=True,
    )
    registered_emanifest_user = models.BooleanField(
        verbose_name="has registered e-manifest user",
        null=True,
        blank=True,
        default=False,
    )

    def __str__(self):
        return f"{self.epa_id}"


class Role(models.TextChoices):
    INDUSTRY = "IN", _("Industry")
    PPC = "PP", _("Ppc")
    EPA = "EP", _("Epa")
    STATE = "ST", _("State")
