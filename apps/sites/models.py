from django.db import models

from lib.rcrainfo import lookups as lu


class EpaSite(models.Model):
    epa_id = models.CharField(max_length=32)
    epa_name = models.CharField(max_length=200, null=True)
    modified = models.BooleanField(null=True)
    has_site_id = models.BooleanField(null=True)
    registered = models.BooleanField(null=True)
    mailing_address = models.ForeignKey('Address', related_name='mailing_address', on_delete=models.CASCADE)
    site_address = models.ForeignKey('Address', related_name='site_address', on_delete=models.CASCADE)
    gis_primary = models.BooleanField(default=False)
    can_esign = models.BooleanField(default=False)
    limited_esign = models.BooleanField(default=True)
    has_emanifest_user = models.BooleanField(default=False)
    site_type = models.CharField(max_length=32, choices=lu.SITE_TYPE, default='GEN')
    federal_generator_status = models.CharField(max_length=32, choices=lu.GEN_STATUS, null=True, default=None)

    def __str__(self):
        return self.epa_id


class Address(models.Model):
    street_number = models.IntegerField(null=True, blank=True)
    address1: str = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200, default=None, blank=True)
    city = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=32)
    state_name = models.CharField(max_length=32, choices=lu.STATES)

    def __str__(self):
        return self.address1
