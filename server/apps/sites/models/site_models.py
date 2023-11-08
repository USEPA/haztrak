import logging
from typing import Union

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.sites.models import Address, Contact
from apps.sites.models.contact_models import RcraPhone

from .base_models import SitesBaseManager, SitesBaseModel

logger = logging.getLogger(__name__)


class RcraSiteType(models.TextChoices):
    """A hazardous waste rcra_site's type. Whether they are the rcra_site
    that generates, transports, or treats the waste (Tsdf).
    It's also possible they can be a broker although this is much less common"""

    GENERATOR = "GEN", _("Generator")
    TRANSPORTER = "TRA", _("Transporter")
    TSDF = "TSD", _("Tsdf")
    BROKER = "BRO", _("Broker")


class RcraSiteManager(SitesBaseManager):
    """Inter-model related functionality for RcraSite Model"""

    def __init__(self):
        self.handler_data = None
        super().__init__()

    def save(self, **handler_data):
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
            return super().save(
                site_address=site_address,
                mail_address=mail_address,
                emergency_phone=emergency_phone,
                contact=new_contact,
                **self.handler_data,
            )
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


class RcraSite(SitesBaseModel):
    """
    RCRAInfo RcraSite model definition for entities on the uniform hazardous waste manifests
    """

    class Meta:
        ordering = ["epa_id"]

    objects = RcraSiteManager()

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


class HaztrakSite(SitesBaseModel):
    """
    Haztrak Site is a cornerstone model that many other models rely on.
    It wraps around RCRAInfo sites (AKA handlers, our RcraSite object). and adds
    additional functionality and fields.
    """

    class Meta:
        ordering = ["rcra_site__epa_id"]
        verbose_name = "Haztrak Site"
        verbose_name_plural = "Haztrak Sites"

    name = models.CharField(
        verbose_name="site alias",
        max_length=200,
        validators=[MinValueValidator(2, "site aliases must be longer than 2 characters")],
    )
    rcra_site = models.OneToOneField(
        verbose_name="rcra_site",
        to=RcraSite,
        on_delete=models.CASCADE,
    )
    last_rcrainfo_manifest_sync = models.DateTimeField(
        verbose_name="last RCRAInfo manifest sync date",
        null=True,
        blank=True,
    )
    admin_rcrainfo_profile = models.ForeignKey(
        "core.RcraProfile",
        on_delete=models.SET_NULL,
        null=True,
    )

    @property
    def admin_has_rcrainfo_api_credentials(self) -> bool:
        """Returns True if the admin user has RcraInfo API credentials"""
        if self.admin_rcrainfo_profile.has_api_credentials:
            return True
        return False

    def __str__(self):
        """Used in StringRelated fields in serializer classes"""
        return f"{self.rcra_site.epa_id}"


class Role(models.TextChoices):
    INDUSTRY = "IN", _("Industry")
    PPC = "PP", _("Ppc")
    EPA = "EP", _("Epa")
    STATE = "ST", _("State")


class SitePermissions(SitesBaseModel):
    """The Role Based access a user has to a site"""

    class Meta:
        verbose_name = "Site Permissions"

    profile = models.ForeignKey(
        "core.HaztrakProfile",
        on_delete=models.CASCADE,
        related_name="site_permissions",
    )
    site = models.ForeignKey(
        HaztrakSite,
        on_delete=models.CASCADE,
    )
    emanifest = models.CharField(
        max_length=6,
        default="view",
        choices=[
            ("viewer", "view"),
            ("editor", "edit"),
            ("signer", "sign"),
        ],
    )

    def __str__(self):
        return f"{self.profile.user}"


class RcraSitePermissions(SitesBaseModel):
    """
    RCRAInfo Site Permissions per module connected to a user's RcraProfile
    and the corresponding HaztrakSite
    """

    CERTIFIER = "Certifier"
    PREPARER = "Preparer"
    VIEWER = "Viewer"

    EPA_PERMISSION_LEVEL = [
        (CERTIFIER, "Certifier"),
        (PREPARER, "Preparer"),
        (VIEWER, "Viewer"),
    ]

    class Meta:
        verbose_name = "RCRA Site Permission"
        ordering = ["site__epa_id"]

    site = models.ForeignKey(
        RcraSite,
        on_delete=models.CASCADE,
    )
    profile = models.ForeignKey(
        "core.RcraProfile",
        on_delete=models.PROTECT,
        related_name="permissions",
    )
    site_manager = models.BooleanField(
        default=False,
    )
    annual_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    biennial_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    e_manifest = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    my_rcra_id = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )
    wiets = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL,
    )

    def __str__(self):
        return f"{self.profile.user}: {self.site.epa_id}"

    def clean(self):
        if self.site_manager:
            fields = ["annual_report", "biennial_report", "e_manifest", "my_rcra_id", "wiets"]
            for field_name in fields:
                if getattr(self, field_name) != "Certifier":
                    raise ValidationError(
                        f"The value for the '{field_name}' field must be set to 'Certifier'."
                    )
