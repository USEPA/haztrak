from django.db import models

from apps.trak.models import Address, Contact


class HandlerManager(models.Manager):
    """
    Inter-model related functionality for Handler Model
    """

    def __init__(self):
        self.handler_data = None
        super().__init__()

    def create_with_related(self, **handler_data):
        self.handler_data = handler_data
        new_contact = Contact.objects.create(self.handler_data.pop('contact'))
        site_address = self.get_address('site_address')
        mail_address = self.get_address('mail_address')
        return super().create(site_address=site_address,
                              mail_address=mail_address,
                              **self.handler_data,
                              contact=new_contact)

    def get_address(self, key) -> Address:
        address = self.handler_data.pop(key)
        if isinstance(address, Address):
            return address
        else:
            return Address.objects.create(**address)


class Handler(models.Model):
    """
    RCRAInfo Handler model definition for entities on the uniform hazardous waste manifests
    """
    objects = HandlerManager()

    site_type = models.CharField(max_length=20,
                                 choices=[
                                     ('designatedFacility', 'Tsdf'),
                                     ('generator', 'Generator'),
                                     ('transporter', 'Transporter'),
                                     ('broker', 'Broker')
                                 ])

    epa_id = models.CharField(
        verbose_name='EPA Id number',
        max_length=25,
        unique=True,
    )
    name = models.CharField(
        max_length=200,
    )
    site_address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        related_name='site_address',
    )
    mail_address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        related_name='mail_address',
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
        verbose_name='Contact Information',
    )
    emergency_phone = models.JSONField(
        null=True,
        blank=True,
    )
    electronic_signatures_info = models.JSONField(
        verbose_name='Electronic signature info',
        null=True,
        blank=True,
    )
    gis_primary = models.BooleanField(
        verbose_name='GIS primary',
        null=True,
        blank=True,
        default=False,
    )
    can_esign = models.BooleanField(
        verbose_name='Can electronically sign',
        null=True,
        blank=True,
    )
    limited_esign = models.BooleanField(
        verbose_name='Limited electronic signing ability',
        null=True,
        blank=True,
    )
    registered_emanifest_user = models.BooleanField(
        verbose_name='Has Registered e-manifest user',
        null=True,
        blank=True,
        default=False,
    )

    def __str__(self):
        return f'{self.epa_id}'
