from django.contrib.auth.models import User
from django.db import models

from apps.trak.models import Site


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rcra_api_key = models.CharField(max_length=128, null=True, blank=True)
    rcra_api_id = models.CharField(max_length=128, null=True, blank=True)
    epa_sites = models.ManyToManyField(Site)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return f'{self.user.username}'
