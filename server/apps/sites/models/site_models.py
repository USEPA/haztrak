import logging
from typing import Union

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.sites.models import Address, Contact
from apps.sites.models.contact_models import SitePhone

from .base_models import SitesBaseManager, SitesBaseModel

logger = logging.getLogger(__name__)


class EpaSiteType(models.TextChoices):
    """A hazardous waste epa_site's type. Whether they are the epa_site
    that generates, transports, or treats the waste (Tsdf).
    It's also possible they can be a broker although this is much less common"""

    GENERATOR = "GEN", _("Generator")
    TRANSPORTER = "TRA", _("Transporter")
    TSDF = "TSD", _("Tsdf")
    BROKER = "BRO", _("Broker")


class EpaSiteManager(SitesBaseManager):
    """
    Inter-model related functionality for EpaSite Model
    """

    def __init__(self):
        self.handler_data = None
        super().__init__()

    def save(self, **handler_data):
        """
        Create an EpaSite and its related fields

        Keyword Args:
            contact (dict): Contact data in (ordered)dict format
            site_address (dict): Site address data dict
            mail_address (dict): mailing address data dict
            emergency_phone (dict): optional Phone dict
        """
        try:
            epa_id = handler_data.get("epa_id")
            if self.model.objects.filter(epa_id=epa_id).exists():
                return EpaSite.objects.get(epa_id=epa_id)
            self.handler_data = handler_data
            new_contact = Contact.objects.save(**self.handler_data.pop("contact"))
            emergency_phone = self.get_emergency_phone()
            site_address = self.get_address("site_address")
            mail_address = self.get_address("mail_address")
            return super().save(
                site_address=site_address,
                mail_address=mail_address,
                emergency_phone=emergency_phone,
                contact=new_contact,
                **self.handler_data,
            )
        except KeyError as exc:
            logger.warning(f"error while creating {self.model.__class__.__name__}{exc}")

    def get_emergency_phone(self) -> Union[SitePhone, None]:
        """Check if emergency phone is present and create an SitePhone row"""
        try:
            emergency_phone_data = self.handler_data.pop("emergency_phone")
            if emergency_phone_data is not None:
                return SitePhone.objects.create(**emergency_phone_data)
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


class EpaSite(SitesBaseModel):
    """
    RCRAInfo EpaSite model definition for entities on the uniform hazardous waste manifests
    """

    class Meta:
        ordering = ["epa_id"]

    objects = EpaSiteManager()

    site_type = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        choices=[
            ("Tsdf", "Tsdf"),
            ("Generator", "Generator"),
            ("Transporter", "Transporter"),
            ("Broker", "Broker"),
        ],
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
        SitePhone,
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


class Site(SitesBaseModel):
    """
    Haztrak Site model used to control access to EpaSite object.

    Not to be confused with what are frequently called 'sites' in RCRAInfo, for that,
    see the EpaSite model.
    """

    class Meta:
        ordering = ["epa_site__epa_id"]

    name = models.CharField(
        verbose_name="site alias",
        max_length=200,
        validators=[MinValueValidator(2, "site aliases must be longer than 2 characters")],
    )
    epa_site = models.OneToOneField(
        verbose_name="epa_site",
        to=EpaSite,
        on_delete=models.CASCADE,
    )
    last_rcra_sync = models.DateTimeField(
        verbose_name="last sync with RCRAInfo",
        null=True,
        blank=True,
    )

    def __str__(self):
        """Used in StringRelated fields in serializer classes"""
        return f"{self.epa_site.epa_id}"
