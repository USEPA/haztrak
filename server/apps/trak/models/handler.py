from django.db import models


class Handler(models.Model):
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
    )
    name = models.CharField(
        max_length=200,
    )
    site_address = models.ForeignKey(
        'Address',
        on_delete=models.CASCADE,
        related_name='site_address',
    )
    mail_address = models.ForeignKey(
        'Address',
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
    contact = models.JSONField(
        verbose_name='Contact information')
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
