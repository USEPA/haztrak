from django.db import models


class Handler(models.Model):
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
        verbose_name='Has Registered e-Manifest user',
        null=True,
        blank=True,
        default=False,
    )

    def __str__(self):
        return f'{self.epa_id}'


class Site(models.Model):
    name = models.CharField(
        verbose_name='Site Alias',
        max_length=200,
    )
    epa_site = models.OneToOneField(
        verbose_name='Handler',
        to=Handler,
        on_delete=models.CASCADE,
    )

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('site_details', kwargs={'pk': self.pk})

    def __str__(self):
        return f'{self.epa_site.epa_id}'
