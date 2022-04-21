from django.contrib.auth.models import User
from django.db import models
from apps.sites.models import EpaSite


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rcra_api_key = models.CharField(max_length=128, null=True)
    rcra_api_id = models.CharField(max_length=128, null=True)
    epa_sites = models.ManyToManyField(EpaSite)

    def __str__(self):
        return self.user.username
