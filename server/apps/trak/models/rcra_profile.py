from django.contrib.auth.models import User
from django.db import models

from .sites import Site


class RcraProfile(models.Model):
    """
    Provides the user's RcraProfile information, excluding their RCRAInfo
    API key (see ProfileUpdateSerializer). Has a one-to-one relationship with
    the User model.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    rcra_api_key = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )
    rcra_api_id = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )
    rcra_username = models.CharField(
        max_length=128,
        blank=True,
    )
    epa_sites = models.ManyToManyField(
        Site,
        related_name='sites',
        blank=True,
    )
    phone_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
    )
    email = models.EmailField()

    def __str__(self):
        return f'{self.user.username}'
