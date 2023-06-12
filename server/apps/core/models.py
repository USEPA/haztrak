from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.sites.models.base_models import SitesBaseModel
from haztrak import settings


class HaztrakUser(AbstractUser):
    pass


class RcraProfile(SitesBaseModel):
    """
    Contains a user's RcraProfile information, such as username, and API credentials.
    Has a one-to-one relationship with the User model.
    """

    class Meta:
        ordering = ["rcra_username"]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
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
        null=True,
        blank=True,
    )
    phone_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
    )
    email = models.EmailField()

    def __str__(self):
        return f"{self.user.username}"

    def sync(self):
        """Launch task to sync use profile. ToDo: remove this method"""
        from apps.sites.tasks import sync_user_sites

        task = sync_user_sites.delay(str(self.user.username))
        return task

    @property
    def is_api_user(self) -> bool:
        """Returns true if the use has Rcrainfo API credentials"""
        if self.rcra_username and self.rcra_api_id and self.rcra_api_key:
            return True
        return False
