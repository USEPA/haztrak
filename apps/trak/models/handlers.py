from django.db import models

from lib.rcrainfo import lookups as lu


class Handler(models.Model):
    epa_id = models.CharField(
        verbose_name='EPA Id number',
        max_length=25
    )
    name = models.CharField(
        max_length=200
    )
    modified = models.BooleanField(
        null=True,
        blank=True
    )
    registered = models.BooleanField(
        null=True,
        blank=True
    )
    contact = models.JSONField(
        verbose_name='Contact information')
    emergency_phone = models.JSONField(
        null=True,
        blank=True
    )
    electronic_signatures_info = models.JSONField(
        verbose_name='Electronic signature info',
        null=True,
        blank=True
    )
    gis_primary = models.BooleanField(
        verbose_name='GIS primary',
        null=True,
        blank=True,
        default=False
    )
    can_esign = models.BooleanField(
        verbose_name='Can electronically sign',
        null=True,
        blank=True
    )
    limited_esign = models.BooleanField(
        verbose_name='Limited electronic signing ability',
        null=True,
        blank=True
    )
    registered_emanifest_user = models.BooleanField(
        verbose_name='Has Registered e-Manifest user',
        null=True,
        blank=True,
        default=False
    )
    # Site Address related fields
    site_street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )
    site_address1: str = models.CharField(
        verbose_name='Site address 1',
        max_length=50
    )
    site_address2 = models.CharField(
        verbose_name='Site address 2',
        max_length=50,
        default=None,
        null=True,
        blank=True
    )
    site_city = models.CharField(
        null=True,
        blank=True,
        max_length=25
    )
    site_state = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.STATES
    )
    site_country = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.COUNTRIES
    )
    site_zip = models.CharField(
        null=True,
        blank=True,
        max_length=5
    )
    # Mailing address related fields
    mail_street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )
    mail_address1: str = models.CharField(
        verbose_name='Mailing address 1',
        max_length=50
    )
    mail_address2 = models.CharField(
        verbose_name='Mailing address 2',
        max_length=50,
        default=None,
        null=True,
        blank=True
    )
    mail_city = models.CharField(
        null=True,
        blank=True,
        max_length=25
    )
    mail_state = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.STATES
    )
    mail_country = models.CharField(
        max_length=2,
        null=True,
        blank=True,
        choices=lu.COUNTRIES
    )
    mail_zip = models.CharField(
        null=True,
        blank=True,
        max_length=5
    )

    def __str__(self):
        return f'{self.epa_id}'


class Site(models.Model):
    name = models.CharField(
        verbose_name='Site Alias',
        max_length=200)
    epa_site = models.OneToOneField(
        verbose_name='Handler',
        to=Handler,
        on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.epa_site.epa_id}'


class ElectronicSignature(models.Model):
    signer_first_name = models.CharField(
        verbose_name='First name',
        max_length=200)
    signer_last_name = models.CharField(
        verbose_name='Last name',
        max_length=200)
    signer_user_id = models.CharField(
        verbose_name='User ID',
        max_length=200)
    signature_date = models.DateTimeField(
        verbose_name='Signature_date')

    def __str__(self):
        return f'Signed {self.signature_date} by {self.signer_user_id}'
