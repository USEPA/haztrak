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

    def sync(self):
        from ..tasks import sync_user_sites
        task = sync_user_sites.delay(str(self.user.username))
        return task


EPA_PERMISSION_LEVEL = [
    ('Certifier', 'Certifier'),
    ('Preparer', 'Preparer'),
    ('Viewer', 'Viewer'),
]


class SitePermission(models.Model):
    """
    RCRAInfo Site Permissions per module connected to a user's RcraProfile
    and the corresponding Site
    """
    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE
    )
    profile = models.ForeignKey(
        RcraProfile,
        on_delete=models.PROTECT
    )
    site_manager = models.BooleanField(
        default=False
    )
    annual_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL
    )
    biennial_report = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL
    )
    e_manifest = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL
    )
    my_rcra_id = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL
    )
    wiets = models.CharField(
        max_length=12,
        choices=EPA_PERMISSION_LEVEL
    )

    def __str__(self):
        return f'{self.profile.user}: {self.site}'
