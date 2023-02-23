import logging
from typing import Union

from django.core.exceptions import ValidationError
from django.db import models

from apps.trak.models import Address, Contact, EpaPhone

logger = logging.getLogger(__name__)


class HandlerManager(models.Manager):
    """
    Inter-model related functionality for Handler Model
    """

    def __init__(self):
        self.handler_data = None
        super().__init__()

    def create_handler(self, **handler_data):
        """
        Create a handler and its related fields

        Keyword Args:
            contact (dict): Contact data in (ordered)dict format
            site_address (dict): Site address data dict
            mail_address (dict): mailing address data dict
            emergency_phone (dict): optional Phone dict
        """
        try:
            epa_id = handler_data.get("epa_id")
            if Handler.objects.filter(epa_id=epa_id).exists():
                return Handler.objects.get(epa_id=epa_id)
            self.handler_data = handler_data
            new_contact = Contact.objects.create(self.handler_data.pop("contact"))
            emergency_phone = self.get_emergency_phone()
            site_address = self.get_address("site_address")
            mail_address = self.get_address("mail_address")
            return super().create(
                site_address=site_address,
                mail_address=mail_address,
                emergency_phone=emergency_phone,
                contact=new_contact,
                **self.handler_data,
            )
        except KeyError as exc:
            logger.warning(f"error while creating handler {exc}")

    def get_emergency_phone(self) -> Union[EpaPhone, None]:
        """Check if emergency phone is present and create an EpaPhone row"""
        try:
            emergency_phone_data = self.handler_data.pop("emergency_phone")
            if emergency_phone_data is not None:
                return EpaPhone.objects.create(**emergency_phone_data)
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


class Handler(models.Model):
    """
    RCRAInfo Handler model definition for entities on the uniform hazardous waste manifests
    """

    objects = HandlerManager()

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
        verbose_name="EPA Id number",
        max_length=25,
        unique=True,
    )
    name = models.CharField(
        max_length=200,
    )
    site_address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        related_name="site_address",
    )
    mail_address = models.ForeignKey(
        Address,
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
        Contact,
        on_delete=models.CASCADE,
        verbose_name="Contact Information",
    )
    emergency_phone = models.ForeignKey(
        EpaPhone,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    electronic_signatures_info = models.JSONField(
        verbose_name="Electronic signature info",
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
        verbose_name="Can electronically sign",
        null=True,
        blank=True,
    )
    limited_esign = models.BooleanField(
        verbose_name="Limited electronic signing ability",
        null=True,
        blank=True,
    )
    registered_emanifest_user = models.BooleanField(
        verbose_name="Has Registered e-manifest user",
        null=True,
        blank=True,
        default=False,
    )

    def __str__(self):
        return f"{self.epa_id}"
